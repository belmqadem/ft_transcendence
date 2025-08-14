import { getFriends } from "@/services/get-friends";
import { getUserById } from "@/services/get-user-by-id";
import { styles } from "@/styles/styles";
import { navigateTo } from "@/utils/navigate-to-link";
import { fontSizes } from "@/styles/fontSizes";
import { getUserTitle } from "@/utils/get-user-title";
import { getWelcomeTitle } from "@/components/home/Hero";
import { getUserStatus, startStatusListener } from "@/services/status-service";

let profilesCache: any[] = [];

async function renderChatList() {
  const chatListElement = document.getElementById("chat-list");
  if (!chatListElement) return;

  chatListElement.innerHTML = profilesCache
    .map((profile) => {
      if (!profile) return "";

      const isOnline = getUserStatus(profile.id);

      return `
      <li class="${styles.friendsListItemStyle}">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img src="${profile.avatar_url}" alt="${profile.username}'s avatar"
              class="${styles.friendsAvatarStyle}" />
            <span class="
              absolute bottom-0 right-0 block w-3 h-3 rounded-full
              ring-2 ring-[#1c1d22]
              ${isOnline ? "bg-pong-success" : "bg-gray-500"}
            " title="${isOnline ? "Online" : "Offline"}"></span>
          </div>
          <div class="flex flex-col">
            <span class="${
              fontSizes.bodyFontSize
            } font-semibold text-white normal-case">
              ${getWelcomeTitle(profile)} ${profile.username}
            </span>
            <span class="text-xs md:text-sm text-pong-dark-secondary">
              ${getUserTitle(profile.rank)}
            </span>
          </div>
        </div>

        <button
          class="
            p-2 rounded-full
            hover:bg-pong-dark-highlight/20
            transition-all duration-200
            text-pong-dark-primary hover:text-pong-accent
          "
          data-chat-id="${profile.id}"
        >
          <i class="fa-solid fa-message text-lg md:text-2xl"></i>
        </button>
      </li>
      `;
    })
    .join("");

  Array.from(chatListElement.querySelectorAll("button[data-chat-id]")).forEach(
    (btn) => {
      btn.addEventListener("click", (e) => {
        const chatId = (e.currentTarget as HTMLButtonElement).getAttribute(
          "data-chat-id"
        );
        if (chatId) {
          navigateTo(`/lounge/${chatId}`);
        }
      });
    }
  );
}

export async function loadChatList() {
  const chatListElement = document.getElementById("chat-list");
  if (!chatListElement) return;

  const friendIds = await getFriends();

  if (!friendIds.length) {
    chatListElement.innerHTML = `<li class="text-pong-dark-secondary text-center py-2 text-sm md:text-lg">No clubmates to chat with yet — send a friend request to start the rally!</li>`;
    return;
  }

  profilesCache = await Promise.all(friendIds.map((id) => getUserById(id)));

  await renderChatList();

  startStatusListener();

  window.addEventListener("status-updated", async () => {
    await renderChatList();
  });
}
