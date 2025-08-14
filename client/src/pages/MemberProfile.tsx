import { NavBar } from "@/components/layout/NavBar";
import { MemberCard } from "@/components/profile/MemberCard";
import { getUserById } from "@/services/get-user-by-id";
import { styles } from "@/styles/styles";
import { navigateTo } from "@/utils/navigate-to-link";
import { removeFriend } from "@/services/remove-friend";
import { blockFriend } from "@/services/block-friend";
import { unblockFriend } from "@/services/unblock-friend";
import { inviteFriend } from "@/services/invite-friend";
import { sendFriendRequest } from "@/services/send-friend-request";
import { cancelFriendRequest } from "@/services/cancel-friend-request";
import { acceptFriend } from "@/services/accept-friend";
import { rejectFriend } from "@/services/reject-friend";
import { getFriends } from "@/services/get-friends";
import { listPendingRequests } from "@/services/list-pending-requests";
import { getBlockedUsers } from "@/services/get-blocked-users";
import { getCurrentUser } from "@/utils/user-store";
import { MatchHistory } from "@/components/profile/MatchHistory";
import { PerformanceMetrics } from "@/components/profile/PerformanceMetrics";
import { SecondaryHeader } from "@/components/common/SecondaryHeader";
import { Loader } from "@/components/common/Loader";
import { UserProfile } from "types/types";
import { getWelcomeTitle } from "@/components/home/Hero";
import { fontSizes } from "@/styles/fontSizes";
import { NoPerformanceData } from "@/components/profile/NoPerformanceData";

async function renderActions(
  user: UserProfile,
  friends: number[],
  pending: {
    sent: number[];
    received: number[];
  },
  blocked: number[],
  me: UserProfile,
  container: HTMLElement
) {
  const actions = document.createElement("div");
  actions.id = "quick-actions";
  actions.className = "flex flex-wrap gap-3 mt-4 justify-center";

  const isFriend = friends.includes(user.id);
  const isPendingSent = pending.sent.includes(user.id);
  const isPendingReceived = pending.received.includes(user.id);
  const isBlocked = blocked.includes(user.id);

  if (isBlocked) {
    actions.innerHTML = `
      <div class="flex flex-wrap gap-3">
        <button id="unblock-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-pong-accent hover:bg-pong-dark-accent text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-pong-accent/60" title="Unblock this member">
          <i class="fa-solid fa-unlock"></i>
          <span>Unblock</span>
        </button>
      </div>
    `;
  } else if (isFriend) {
    actions.innerHTML = `
      <div class="flex flex-wrap gap-3">
        <button id="chat-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-pong-accent hover:bg-pong-dark-accent text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-pong-accent/60" title="Open a private chat with this member">
          <i class="fa-solid fa-comments"></i> 
          <span>Chat</span>
        </button>
        <button id="invite-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-pong-highlight hover:bg-yellow-400 active:bg-yellow-300 text-black text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-yellow-400/60" title="Challenge to a match">
          <i class="fa-solid fa-table-tennis-paddle-ball"></i> 
          <span>Invite</span>
        </button>
        <button id="unfriend-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-pong-dark-accent hover:bg-pong-accent active:bg-pong-accent/80 text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-pong-accent/40" title="Remove this user from your friends">
          <i class="fa-solid fa-user-minus"></i>
          <span>Unfriend</span>
        </button>
        <button id="block-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-red-600/40" title="Block this member">
          <i class="fa-solid fa-ban"></i>
          <span>Block</span>
        </button>
      </div>
    `;
  } else if (isPendingReceived) {
    actions.innerHTML = `
      <div class="flex flex-wrap gap-3">
        <button id="accept-friend-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97]" title="Accept friend request">
          <i class="fa-solid fa-user-check"></i>
          <span>Accept</span>
        </button>
        <button id="decline-friend-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97]" title="Decline friend request">
          <i class="fa-solid fa-user-xmark"></i>
          <span>Decline</span>
        </button>
      </div>
    `;
  } else if (isPendingSent) {
    actions.innerHTML = `
      <div class="flex flex-wrap gap-3">
        <button id="cancel-friend-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-pong-dark-accent hover:bg-pong-accent text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97]" title="Cancel friend request">
          <i class="fa-solid fa-user-xmark"></i>
          <span>Cancel Request</span>
        </button>
      </div>
    `;
  } else {
    actions.innerHTML = `
      <div class="flex flex-wrap gap-3">
        <button id="add-friend-btn" class="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-pong-accent hover:bg-pong-dark-accent active:bg-pong-accent/70 text-white text-sm font-semibold shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-pong-accent/60" title="Send a friend request to this member">
          <i class="fa-solid fa-user-plus"></i> 
          <span>Add Friend</span>
        </button>
      </div>
    `;
  }

  setTimeout(() => {
    if (isBlocked) {
      const unblockBtn = document.getElementById("unblock-btn");
      if (unblockBtn) {
        unblockBtn.addEventListener("click", async () => {
          await unblockFriend(user.id);
          refreshActions(user, me, container);
        });
      }
    } else if (isFriend) {
      const chatBtn = document.getElementById("chat-btn");
      const blockBtn = document.getElementById("block-btn");
      const unfriendBtn = document.getElementById("unfriend-btn");
      const inviteBtn = document.getElementById("invite-btn");

      if (chatBtn) {
        chatBtn.addEventListener("click", () => {
          navigateTo(`/lounge/${user.id}`);
        });
      }
      if (blockBtn) {
        blockBtn.addEventListener("click", async () => {
          await blockFriend(user.id);
          refreshActions(user, me, container);
        });
      }
      if (unfriendBtn) {
        unfriendBtn.addEventListener("click", async () => {
          await removeFriend(user.id);
          refreshActions(user, me, container);
        });
      }
      if (inviteBtn) {
        inviteBtn.addEventListener("click", async () => {
          await inviteFriend(user.id);
        });
      }
    } else if (isPendingReceived) {
      const acceptBtn = document.getElementById("accept-friend-btn");
      const declineBtn = document.getElementById("decline-friend-btn");
      if (acceptBtn) {
        acceptBtn.addEventListener("click", async () => {
          await acceptFriend(user.id);
          refreshActions(user, me, container);
        });
      }
      if (declineBtn) {
        declineBtn.addEventListener("click", async () => {
          await rejectFriend(user.id);
          refreshActions(user, me, container);
        });
      }
    } else if (isPendingSent) {
      const cancelBtn = document.getElementById("cancel-friend-btn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", async () => {
          await cancelFriendRequest(user.id);
          refreshActions(user, me, container);
        });
      }
    } else {
      const addFriendBtn = document.getElementById("add-friend-btn");
      if (addFriendBtn) {
        addFriendBtn.addEventListener("click", async () => {
          await sendFriendRequest(user.id);
          refreshActions(user, me, container);
        });
      }
    }
  }, 0);

  return actions;
}

export async function refreshActions(
  user: any,
  me: any,
  container: HTMLElement
) {
  const [friends, pending, blocked] = await Promise.all([
    getFriends(),
    listPendingRequests(),
    getBlockedUsers(),
  ]);

  const oldActions = container.querySelector("#quick-actions");
  if (oldActions) {
    const newActions = await renderActions(
      user,
      friends,
      pending,
      blocked,
      me,
      container
    );
    oldActions.replaceWith(newActions);
  }

  const statsWrapper = container.querySelector("#stats-wrapper");
  if (statsWrapper) {
    statsWrapper.innerHTML = "";

    if (blocked.includes(user.id)) {
      const blockedMsg = document.createElement("div");
      blockedMsg.className =
        "w-full text-center text-pong-error text-lg font-semibold py-10";
      blockedMsg.innerHTML =
        '<i class="fa-solid fa-ban mr-2"></i>This member is blocked. Unblock to view stats and history.';
      statsWrapper.appendChild(blockedMsg);
    } else {
      statsWrapper.appendChild(PerformanceMetrics({ user }));
      statsWrapper.appendChild(MatchHistory({ user }));
    }
  }
}

export async function MemberProfile(id: number) {
  const me = getCurrentUser();
  const container = document.createElement("section");
  container.className = styles.pageLayoutDark;

  if (!me) {
    container.appendChild(Loader({ text: "Preparing your club profile..." }));
    return container;
  }

  const [user, friends, pending, blocked] = await Promise.all([
    getUserById(id),
    getFriends(),
    listPendingRequests(),
    getBlockedUsers(),
  ]);

  if (!user) {
    return Loader({ text: "Checking user profile..." });
  }

  const hasPerformanceData = user.matches_played > 0;

  const containerClassName = hasPerformanceData
    ? "w-full md:w-[90%] xl:w-[95%] mx-auto flex flex-col 2xl:flex-row gap-8 md:gap-12"
    : "w-full md:w-[90%] xl:w-[95%] mx-auto flex flex-col gap-8 xl:gap-12";

  const userDataClassName = hasPerformanceData
    ? "w-full 2xl:w-1/3 2xl:sticky 2xl:top-24 flex 2xl:self-start flex-col 2xl:flex-col items-center justify-center gap-6"
    : "w-full flex flex-col items-center justify-center gap-6";

  container.innerHTML = "";
  container.appendChild(NavBar());
  const wrapper = document.createElement("div");
  wrapper.className = "w-full relative";

  const main = document.createElement("main");
  main.className = styles.pageContent;

  main.appendChild(
    SecondaryHeader({
      title: `${getWelcomeTitle(user)} ${user.username}'s Profile`,
      subtitle: "Identity, matches & achievements of this club member.",
    })
  );

  const layout = document.createElement("div");
  layout.className = containerClassName;

  const left = document.createElement("div");
  left.className = userDataClassName;

  left.appendChild(MemberCard({ user, showUpdateOptions: false }));

  const actions = await renderActions(
    user,
    friends,
    pending,
    blocked,
    me,
    container
  );

  left.appendChild(actions);

  const right = document.createElement("div");
  right.className = "flex-1 flex flex-col gap-8 w-full";

  const isBlocked = blocked.includes(user.id);

  if (isBlocked) {
    const blockedMsg = document.createElement("div");
    blockedMsg.className =
      "w-full text-center text-pong-error text-lg font-semibold py-10";
    blockedMsg.innerHTML =
      '<i class="fa-solid fa-ban mr-2"></i>This member is blocked. Unblock to view stats and history.';
    right.appendChild(blockedMsg);
  } else if (!hasPerformanceData) {
    right.appendChild(
      NoPerformanceData({
        spanText: "This player hasn’t stepped onto the BHV court yet.",
        isMember: true,
      })
    );
  } else {
    right.appendChild(PerformanceMetrics({ user }));
    right.appendChild(MatchHistory({ user }));
  }

  layout.appendChild(left);
  layout.appendChild(right);

  main.appendChild(layout);
  wrapper.appendChild(main);
  container.appendChild(wrapper);

  return container;
}
