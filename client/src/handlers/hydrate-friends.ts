import { getWelcomeTitle } from "@/components/home/Hero";
import { getFriends } from "@/services/get-friends";
import { getUserById } from "@/services/get-user-by-id";
import { removeFriend } from "@/services/remove-friend";
import { styles } from "@/styles/styles";
import { getAvatarUrl } from "@/utils/get-avatar-url";
import { getUserTitle } from "@/utils/get-user-title";
import { navigateTo } from "@/utils/navigate-to-link";
import { UserProfile } from "types/types";
import { hydrateAllMembers } from "./hydrate-all-members";
import { fontSizes } from "@/styles/fontSizes";
import { inviteFriend } from "@/services/invite-friend";

export async function hydrateFriends(me: UserProfile) {
  const list = document.getElementById("friends-list") as HTMLUListElement;
  if (!list) return;

  const friends = await getFriends();

  if (!friends.length) {
    list.innerHTML = `<li class="text-pong-dark-secondary text-center py-2 text-sm md:text-lg">No clubmates here yet — start making connections!</li>`;
    return;
  }

  list.innerHTML = "";

  for (const friend_id of friends) {
    const user = await getUserById(friend_id);
    if (!user) return;

    const li = document.createElement("li");

    li.className =
      styles.friendsListItemStyle +
      " !flex-col sm:!flex-row !items-start sm:!items-center !gap-2 sm:!gap-4";
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

    const unfriendBtn = document.createElement("button");
    unfriendBtn.className =
      "p-2 rounded-full hover:bg-pong-dark-highlight/20 transition-all duration-200 text-pong-dark-primary hover:text-pong-accent";
    unfriendBtn.innerHTML = `<i class="fa-solid fa-user-minus text-base md:text-lg"></i>`;
    unfriendBtn.onclick = async () => {
      unfriendBtn.disabled = true;
      await removeFriend(user.id);
      await hydrateFriends(me);
      await hydrateAllMembers(me);
    };

    li.appendChild(left);
    li.appendChild(unfriendBtn);
    list.appendChild(li);
  }
}
