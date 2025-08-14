import { UserProfile } from "types/types";
import { styles } from "@/styles/styles";
import { getAllUsers } from "@/services/get-all-users";
import { sendFriendRequest } from "@/services/send-friend-request";
import { getAvatarUrl } from "@/utils/get-avatar-url";
import { getFriends } from "@/services/get-friends";
import { navigateTo } from "@/utils/navigate-to-link";
import { cancelFriendRequest } from "@/services/cancel-friend-request";
import { getWelcomeTitle } from "@/components/home/Hero";
import { getUserTitle } from "@/utils/get-user-title";
import { fontSizes } from "@/styles/fontSizes";
import { listPendingRequests } from "@/services/list-pending-requests";
import { acceptFriend } from "@/services/accept-friend";
import { rejectFriend } from "@/services/reject-friend";
import { hydrateFriends } from "./hydrate-friends";
import { hydratePendingRequests } from "./hydrate-pending";

export async function hydrateAllMembers(currentUser: UserProfile) {
  const list = document.getElementById("all-members-list") as HTMLUListElement;
  if (!list) return;

  const users = await getAllUsers();
  const friends = await getFriends();
  const { sent, received } = await listPendingRequests();

  if (!users.length || users.length === 1) {
    list.innerHTML = `<li class="text-pong-dark-secondary text-center py-2 text-sm md:text-lg">No clubmates spotted — maybe try a new shot!</li>`;
    return;
  }

  list.innerHTML = "";

  users.forEach((user: UserProfile) => {
    if (user.id !== currentUser.id && !friends.includes(user.id)) {
      const li = document.createElement("li");
      li.className = styles.friendsListItemStyle;

      const left = document.createElement("div");
      left.className = "flex items-center gap-4 cursor-pointer group";
      left.onclick = () => navigateTo(`/members/${user.id}`);

      const avatar = document.createElement("img");
      avatar.src = getAvatarUrl(user);
      avatar.alt = `${user.username}'s avatar`;
      avatar.className = styles.friendsAvatarStyle;

      const nameWrapper = document.createElement("div");
      nameWrapper.className = "flex flex-col";

      const name = document.createElement("span");
      name.className = `${fontSizes.bodyFontSize} font-semibold text-white group-hover:underline`;
      name.textContent = `${getWelcomeTitle(user)} ${user.username}`;

      const subtitle = document.createElement("span");
      subtitle.className = "text-xs md:text-sm text-pong-dark-secondary";
      subtitle.textContent = getUserTitle(user.rank);

      nameWrapper.appendChild(name);
      nameWrapper.appendChild(subtitle);

      left.appendChild(avatar);
      left.appendChild(nameWrapper);

      if (received.includes(user.id)) {
        const buttons = document.createElement("div");
        buttons.className = "flex flex-row items-center gap-2 md:gap-3";

        const acceptBtn = document.createElement("button");
        acceptBtn.innerHTML = `<i class="fa-solid fa-circle-check text-base md:text-xl"></i>`;
        acceptBtn.className = `
          p-2 md:px-4 rounded-full bg-green-500/80 text-white
          hover:bg-green-500 transition-all duration-200
          shadow-sm hover:shadow-md
        `;
        acceptBtn.setAttribute("aria-label", "Accept friend request");
        acceptBtn.onclick = async () => {
          await acceptFriend(user.id);
          await hydrateAllMembers(currentUser);
          await hydrateFriends(currentUser);
          await hydratePendingRequests(currentUser);
        };

        const rejectBtn = document.createElement("button");
        rejectBtn.innerHTML = `<i class="fa-solid fa-circle-xmark text-base md:text-xl"></i>`;
        rejectBtn.className = `
          p-2 md:px-4 rounded-full bg-red-500/80 text-white
          hover:bg-red-500 transition-all duration-200
          shadow-sm hover:shadow-md
        `;
        rejectBtn.setAttribute("aria-label", "Reject friend request");
        rejectBtn.onclick = async () => {
          await rejectFriend(user.id);
          await hydrateAllMembers(currentUser);
        };

        buttons.appendChild(acceptBtn);
        buttons.appendChild(rejectBtn);
        li.appendChild(left);
        li.appendChild(buttons);
      } else {
        const addBtn = document.createElement("button");
        let requestSent = sent.includes(user.id);

        addBtn.className = requestSent
          ? "p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-all duration-200"
          : "p-2 rounded-full hover:bg-pong-dark-highlight/20 transition-all duration-200 text-pong-dark-primary hover:text-pong-accent";
        addBtn.setAttribute(
          "aria-label",
          requestSent ? "Cancel friend request" : "Send friend request"
        );
        addBtn.innerHTML = requestSent
          ? `<i class="fa-solid fa-circle-xmark text-base md:text-lg"></i>`
          : `<i class="fa-solid fa-user-plus text-base md:text-lg"></i>`;

        addBtn.onclick = async (e) => {
          e.stopPropagation();
          addBtn.disabled = true;

          if (!requestSent) {
            await sendFriendRequest(user.id);
            requestSent = true;
            addBtn.innerHTML = `<i class="fa-solid fa-circle-xmark text-base md:text-lg"></i>`;
            addBtn.className =
              "p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-all duration-200";
            addBtn.setAttribute("aria-label", "Cancel friend request");
          } else {
            await cancelFriendRequest(user.id);
            requestSent = false;
            addBtn.innerHTML = `<i class="fa-solid fa-user-plus text-base md:text-lg"></i>`;
            addBtn.className =
              "p-2 rounded-full hover:bg-pong-dark-highlight/20 transition-all duration-200 text-pong-dark-primary hover:text-pong-accent";
            addBtn.setAttribute("aria-label", "Send friend request");
          }

          setTimeout(() => {
            addBtn.disabled = false;
          }, 500);
        };

        li.appendChild(left);
        li.appendChild(addBtn);
      }

      list.appendChild(li);
    }
  });
}
