import { getAllUsers } from "@/services/get-all-users";
import { getAvatarUrl } from "@/utils/get-avatar-url";
import { styles } from "@/styles/styles";
import { UserProfile } from "types/types";
import { navigateTo } from "@/utils/navigate-to-link";
import { getWelcomeTitle } from "@/components/home/Hero";

export async function hydrateTopThree(me: UserProfile) {
  const list = document.getElementById("top-three-list") as HTMLOListElement;
  if (!list) return;

  const members = await getAllUsers();

  members.sort((a: UserProfile, b: UserProfile) => {
    return b.level - a.level;
  });

  list.innerHTML = "";

  for (let i = 0; i < 3 && i < members.length; i++) {
    const user = members[i];
    if (!user) continue;

    const li = document.createElement("li");
    li.className = styles.listStyle + " items-center gap-4 cursor-pointer";
    li.onclick = () => {
      user.id === me.id
        ? navigateTo(`/my_profile`)
        : navigateTo(`/members/${user.id}`);
    };

    const rankSpan = document.createElement("span");
    rankSpan.className =
      "text-sm md:text-lg font-bold text-pong-dark-accent text-center mr-2";
    rankSpan.textContent = (i + 1).toString();

    const avatarImg = document.createElement("img");
    avatarImg.src = getAvatarUrl(user);
    avatarImg.alt = `${user.username}'s avatar`;
    avatarImg.className = "w-8 h-8 md:w-10 md:h-10 rounded-full";

    const nameSpan = document.createElement("span");
    nameSpan.className = "font-semibold text-pong-dark-primary";
    nameSpan.innerHTML = `${getWelcomeTitle(user)} ${user.username}`;

    const levelSpan = document.createElement("span");
    levelSpan.className =
      "ml-auto text-xs md:text-sm text-pong-secondary italic";
    levelSpan.textContent = `Level ${user.level}`;

    li.appendChild(rankSpan);
    li.appendChild(avatarImg);
    li.appendChild(nameSpan);
    li.appendChild(levelSpan);

    list.appendChild(li);
  }
}
