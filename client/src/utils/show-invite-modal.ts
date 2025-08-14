import { getAllUsers } from "@/services/get-all-users";
import { getFriends } from "@/services/get-friends";
import { inviteFriend } from "@/services/invite-friend";
import { UserProfile } from "types/types";
import { getAvatarUrl } from "./get-avatar-url";
import { getWelcomeTitle } from "@/components/home/Hero";
import { navigateTo } from "./navigate-to-link";
import { getUserStatus } from "@/services/status-service";

export async function showInviteModal(me: UserProfile) {
  const oldModal = document.getElementById("remote-invite-modal");
  if (oldModal) oldModal.remove();

  const modal = document.createElement("div");
  modal.id = "remote-invite-modal";
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4";

  modal.innerHTML = `
    <div class="
      relative
      bg-gradient-to-br from-[#1f2128] to-[#2a2d36]
      rounded-2xl shadow-2xl p-8 max-w-lg w-full
      flex flex-col items-center
      border border-pong-accent/20
      animate-fade-in
    " style="max-height: 90vh; overflow-y: auto;">
      
      <button
        id="close-remote-invite"
        class="
          absolute top-4 right-4
          w-10 h-10 flex items-center justify-center
          rounded-full text-pong-dark-secondary hover:text-white
          hover:bg-pong-dark-accent/30 transition-all duration-300
        "
        title="Close"
      >
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>

      <h2 class="text-2xl font-bold text-pong-accent mb-2 tracking-wide text-center">
        Invite a Player
      </h2>
      <p class="text-pong-dark-primary text-center mb-6">
        Select any club member to challenge for an online match
      </p>

      <ul id="friends-list-modal" class="
        w-full flex flex-col gap-3 mb-2
        max-h-[420px] overflow-y-auto p-1 custom-scrollbar
      ">
        <div class="text-center text-pong-dark-secondary py-6">Loading members...</div>
      </ul>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#close-remote-invite")?.addEventListener("click", () => {
    modal.remove();
  });

  const [allUsers, friendIds] = await Promise.all([
    getAllUsers(),
    getFriends(),
  ]);

  const list = modal.querySelector("#friends-list-modal");
  if (!list) return;
  if (!allUsers.length) {
    list.innerHTML =
      '<div class="text-center text-pong-dark-secondary py-6">No members found in the club.</div>';
    return;
  }

  const filteredUsers = allUsers.filter((u: UserProfile) => u.id !== me.id);

  list.innerHTML = filteredUsers
    .map((profile: UserProfile) => {
      if (!profile) return "";

      const isFriend = friendIds.includes(profile.id);
      const isOnline = getUserStatus(profile.id);

      return `
      <li class="
        flex items-center justify-between gap-4
        bg-pong-dark-primary/30
        rounded-xl px-5 py-4
        shadow-lg hover:shadow-xl
        border border-pong-accent/10
        transition-all duration-300 hover:-translate-y-0.5
      ">
        <div class="player-invite-profile flex items-center gap-4 cursor-pointer group" data-id="${
          profile.id
        }">
          <div class="relative">
            <img src="${getAvatarUrl(profile)}"
                alt="${profile.username}"
                class="
                  w-12 h-12 rounded-full object-cover
                  border-2 border-pong-accent/50 shadow-sm
				  group-hover:scale-110 transition-transform duration-300
                " />
            <span class="
              absolute bottom-0 right-0 block w-3 h-3 rounded-full
              ring-2 ring-[#1f2128]
              ${isOnline ? "bg-pong-success" : "bg-gray-500"}
            " title="${isOnline ? "Online" : "Offline"}"></span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-white text-base md:text-lg">
              ${getWelcomeTitle(profile)} ${profile.username}
            </span>
            <span class="
              mt-1 px-2 py-0.5 rounded-full text-xs font-semibold w-fit
              ${
                isFriend
                  ? "bg-pong-success/20 text-pong-success"
                  : "bg-pong-dark-secondary/20 text-pong-secondary"
              }
            ">
              ${isFriend ? "Friend" : "Club Member"}
            </span>
          </div>
        </div>
        <button
          class="
            invite-btn flex items-center justify-center w-11 h-11
            bg-gradient-to-br from-pong-accent to-pong-dark-accent
            hover:from-pong-dark-accent hover:to-pong-accent
            rounded-full text-white text-lg shadow-md hover:shadow-lg
            transition-all duration-200
          "
          title="Invite to play"
          data-id="${profile.id}">
          <i class="fa-solid fa-table-tennis-paddle-ball"></i>
        </button>
      </li>`;
    })
    .join("");

  list.querySelectorAll(".player-invite-profile").forEach((item) => {
    item.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      const userId = target.getAttribute("data-id");
      if (userId) {
        navigateTo(`/members/${userId}`);
        document.getElementById("remote-invite-modal")?.remove();
      }
    });
  });

  list.querySelectorAll(".invite-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const friendId = Number(
        (e.currentTarget as HTMLElement).getAttribute("data-id")
      );
      btn.setAttribute("disabled", "true");

      await inviteFriend(friendId);

      (btn as HTMLElement).innerHTML = `<i class="fa-solid fa-check"></i>`;
      (btn as HTMLElement).classList.add("bg-green-500");
    });
  });
}
