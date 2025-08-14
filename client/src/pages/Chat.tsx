import { styles } from "@/styles/styles";
import { startChatListener, sendChatMessage } from "@/services/chat-service";
import { getCurrentUser } from "@/utils/user-store";
import { MessageSent, UserProfile } from "types/types";
import { getUserById } from "@/services/get-user-by-id";
import { Loader } from "@/components/common/Loader";
import { ChatBlock } from "@/components/chat/ChatBlock";
import { NavBar } from "@/components/layout/NavBar";
import { inviteFriend } from "@/services/invite-friend";
import { navigateTo } from "@/utils/navigate-to-link";
import { getFriends } from "@/services/get-friends";
import { getAvatarUrl } from "@/utils/get-avatar-url";
import { getWelcomeTitle } from "@/components/home/Hero";
import { getUserStatus } from "@/services/status-service";
import { Profile } from "./Profile";

export async function Chat(friendId: number) {
  const friend = await getUserById(friendId);
  const currentUser = getCurrentUser();

  const section = document.createElement("section");
  section.className = styles.pageLayoutDark;

  if (!friend || !currentUser) {
    section.appendChild(
      Loader({
        text: friend
          ? "Preparing your club profile..."
          : "Unable to load chat. Please try again later.",
      })
    );
    return section;
  }

  section.appendChild(NavBar());

  const container = document.createElement("div");
  container.className = "w-full relative flex";

  const usersSideBar = document.createElement("aside");
  usersSideBar.className = `
    hidden md:flex flex-col
    w-64 min-w-48 max-w-xs
    bg-gradient-to-br from-[#2b2e34]/80 to-[#363a43]/60 backdrop-blur-md border-l border-pong-dark-accent/30
    h-[calc(100vh-4rem)]
    overflow-y-auto
    py-6 px-4 gap-3 mt-16
    rounded-l-xl shadow-inner
    custom-scrollbar
  `;

  (async () => {
    const friendIds = await getFriends();
    const friendProfiles: UserProfile[] = [];

    if (friendIds.length === 0) {
      const noFriendsMessage = document.createElement("div");
      noFriendsMessage.className = "text-white text-center py-10";
      noFriendsMessage.innerHTML = `				
			<i class="fa-solid fa-users-slash text-4xl mb-4"></i>
			<p class="text-lg">You have no friends yet.</p>
			<p class="text-sm text-gray-400">Add friends to start chatting!</p
		`;
      usersSideBar.appendChild(noFriendsMessage);
      return;
    }

    for (const id of friendIds) {
      if (id !== currentUser.id) {
        const user = await getUserById(id);
        if (user) friendProfiles.push(user);
      }
    }
    for (const user of friendProfiles) {
      const isOnline = getUserStatus(user.id);
      const userBtn = document.createElement("button");
      userBtn.className =
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-pong-dark-accent/20 transition-colors";
      userBtn.innerHTML = `
	  	<div class="relative">
		  <img src="${getAvatarUrl(user)}" alt="${
        user.username
      }" class="w-10 h-10 rounded-full object-cover" />
		  <span class="
			absolute bottom-0 right-0 block w-2 h-2 rounded-full
			ring-1 ring-[#1f2128]
			${isOnline ? "bg-pong-success" : "bg-gray-500"}">
		  </span>
		</div>
        <span class="text-white font-medium">${getWelcomeTitle(user)} ${
        user.username
      }</span>
      `;
      userBtn.onclick = () => {
        navigateTo(`/lounge/${user.id}`);
      };
      usersSideBar.appendChild(userBtn);
    }
  })();

  const mainArea = document.createElement("div");
  mainArea.className = "flex-1 flex flex-col";

  const main = document.createElement("main");
  main.className =
    "px-0 md:pl-16 md:pr-4 pt-16 md:pt-24 md:pb-12 h-[100vh] md:h-[calc(100vh-2rem)] overflow-y-auto flex flex-col items-center gap-6";

  const loadingDiv = document.createElement("div");
  loadingDiv.className =
    "text-white py-10 text-lg font-semibold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  loadingDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading messages...`;
  main.appendChild(loadingDiv);

  mainArea.appendChild(main);

  container.appendChild(mainArea);
  container.appendChild(usersSideBar);
  section.appendChild(container);

  const messages: MessageSent[] = [];

  setTimeout(async () => {
    main.removeChild(loadingDiv);

    const chatBlock = ChatBlock({
      ...friend,
    });
    main.appendChild(chatBlock);

    const chatMessages = section.querySelector(
      "#chat-messages"
    ) as HTMLDivElement;
    const chatForm = section.querySelector(
      "#chat-input-form"
    ) as HTMLFormElement;
    const chatInput = section.querySelector("#chat-input") as HTMLInputElement;

    let renderCount = 15;
    const renderStep = 10;

    function renderMessages(keepScroll = false) {
      if (!chatMessages) return;
      chatMessages.innerHTML = "";

      const totalMessages = messages.length;
      const startIndex = Math.max(0, totalMessages - renderCount);
      const visibleMessages = messages.slice(startIndex, totalMessages);

      visibleMessages.forEach((msg) => {
        const isMe = msg.sender_id === currentUser?.id;
        const msgDiv = document.createElement("div");
        msgDiv.className = `flex flex-col ${
          isMe ? "items-end" : "items-start"
        }`;
        msgDiv.innerHTML = `
	  <span class="${isMe ? "bg-pong-dark-primary" : "bg-[#BFBEAE]"} 
	                  text-pong-primary px-4 py-2 rounded-lg shadow-sm max-w-[70%] break-words overflow-hidden text-wrap normal-case">
	    ${msg.content}
	  </span>

      <span class="text-xs text-pong-highlight ${isMe ? "mr-2" : "ml-2"} mt-1">
        ${isMe ? "You" : friend?.username} • ${new Date().toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
      </span>
    `;
        chatMessages.appendChild(msgDiv);
      });

      if (!keepScroll) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    chatMessages.addEventListener("scroll", async () => {
      if (chatMessages.scrollTop === 0) {
        const prevHeight = chatMessages.scrollHeight;
        renderCount += renderStep;
        renderMessages(true);
        const newHeight = chatMessages.scrollHeight;
        chatMessages.scrollTop = newHeight - prevHeight;
      }
    });

    renderMessages();

    startChatListener((msg: MessageSent) => {
      const isRelevant =
        (msg.sender_id === currentUser.id && msg.recipient_id === friend.id) ||
        (msg.sender_id === friend.id && msg.recipient_id === currentUser.id);
      if (isRelevant) {
        messages.push(msg);
        renderMessages();
      }
    });

    if (chatForm && chatInput) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = chatInput.value.trim();
        if (!content) return;

        const newMsg: MessageSent = {
          type: "MESSAGE_SENT",
          sender_id: currentUser.id,
          recipient_id: friend.id,
          content,
          message_id: -1,
        };

        sendChatMessage(newMsg as any);
        messages.push(newMsg);
        renderMessages();
        chatInput.value = "";
      });
    }

    const challengeBtn = section.querySelector(
      "#challenge-button"
    ) as HTMLButtonElement;

    if (challengeBtn) {
      challengeBtn.addEventListener("click", async () => {
        challengeBtn.disabled = true;
        await inviteFriend(friend.id);
        setTimeout(() => {
          challengeBtn.disabled = false;
        }, 3000);
      });
    }
  }, 500);

  return section;
}
