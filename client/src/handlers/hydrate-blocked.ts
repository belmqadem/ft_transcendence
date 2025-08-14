import { getBlockedUsers } from "@/services/get-blocked-users";
import { getUserById } from "@/services/get-user-by-id";
import { unblockFriend } from "@/services/unblock-friend";
import { getAvatarUrl } from "@/utils/get-avatar-url";
import { styles } from "@/styles/styles";
import { navigateTo } from "@/utils/navigate-to-link";
import { fontSizes } from "@/styles/fontSizes";
import { getWelcomeTitle } from "@/components/home/Hero";
import { getUserTitle } from "@/utils/get-user-title";

export async function hydrateBlocked() {
  const list = document.getElementById("muted-list") as HTMLUListElement;
  if (!list) return;

  const blocked = await getBlockedUsers();

  if (!blocked.length) {
    list.innerHTML = `<li class="text-pong-dark-secondary text-center py-2 text-sm md:text-lg">Your blocklist is as clear as the BHV hotel pool.</li>`;
    return;
  }

  list.innerHTML = "";

  for (const userId of blocked) {
    const user = await getUserById(userId);
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

    const unmuteBtn = document.createElement("button");
    unmuteBtn.className =
      "p-2 rounded-full hover:bg-pong-dark-highlight/20 transition-all duration-200 text-pong-dark-primary hover:text-pong-accent";

    unmuteBtn.innerHTML = `<i class="fas fa-unlock-alt"></i>`;
    unmuteBtn.onclick = async () => {
      await unblockFriend(user.id);
      await hydrateBlocked();
    };

    li.appendChild(left);
    li.appendChild(unmuteBtn);
    list.appendChild(li);
  }
}
