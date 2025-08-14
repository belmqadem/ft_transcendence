import { acceptFriend } from "@/services/accept-friend";
import { rejectFriend } from "@/services/reject-friend";
import { getUserById } from "@/services/get-user-by-id";
import { styles } from "@/styles/styles";
import { getAvatarUrl } from "@/utils/get-avatar-url";
import { navigateTo } from "@/utils/navigate-to-link";
import { listPendingRequests } from "@/services/list-pending-requests";
import { getWelcomeTitle } from "@/components/home/Hero";
import { getUserTitle } from "@/utils/get-user-title";
import { hydrateFriends } from "./hydrate-friends";
import { hydrateAllMembers } from "./hydrate-all-members";
import { UserProfile } from "types/types";
import { fontSizes } from "@/styles/fontSizes";

export async function hydratePendingRequests(me: UserProfile) {
  const list = document.getElementById(
    "pending-requests-list"
  ) as HTMLUListElement;
  if (!list) return;

  const pending = (await listPendingRequests()).received;

  if (!pending.length) {
    list.innerHTML = `<li class="text-pong-dark-secondary text-center py-2 text-sm md:text-lg">No pending friend requests — time to serve up some invites!</li>`;
    return;
  }

  list.innerHTML = "";

  for (const requester_id of pending) {
    const user = await getUserById(requester_id);
    if (!user) return;

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
      await acceptFriend(requester_id);
      await hydrateFriends(me);
      await hydrateAllMembers(me);
      await hydratePendingRequests(me);
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
      await rejectFriend(requester_id);
      await hydratePendingRequests(me);
    };

    buttons.appendChild(acceptBtn);
    buttons.appendChild(rejectBtn);

    li.appendChild(left);
    li.appendChild(buttons);
    list.appendChild(li);
  }
}
