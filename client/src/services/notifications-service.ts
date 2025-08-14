import { Notification } from "types/types";
import { navigateTo } from "@/utils/navigate-to-link";
import { displayToast } from "@/utils/display-toast";
import { getUserById } from "@/services/get-user-by-id";
import { showInviteNotification } from "@/utils/show-invite-notif";
import { acceptInvite } from "@/services/accept-invite";
import { getWelcomeTitle } from "@/components/home/Hero";

let ws: WebSocket | null = null;
let unseenCount = 0;
const seenIds = new Set<number>(
  JSON.parse(sessionStorage.getItem("seenNotifs") || "[]")
);

function saveSeen() {
  sessionStorage.setItem("seenNotifs", JSON.stringify(Array.from(seenIds)));
}

const received = new Set<number>(
  JSON.parse(sessionStorage.getItem("receivedNotifs") || "[]")
);
function saveReceived() {
  sessionStorage.setItem(
    "receivedNotifs",
    JSON.stringify(Array.from(received))
  );
}

// pending groups tracker for MESSAGE_RECEIVED notifications
const pendingMessageGroups = new Map<
  number,
  {
    notifications: Notification[];
    timeout: number | null;
  }
>();

function updateCounter() {
  const badge = document.getElementById("notif-badge") as HTMLSpanElement;
  if (badge) {
    badge.textContent = unseenCount > 0 ? String(unseenCount) : "0";
    if (unseenCount > 0) {
      badge.classList.remove("text-black", "bg-pong-dark-primary");
      badge.classList.add("text-white", "bg-pong-accent");
    } else {
      badge.classList.add("text-black", "bg-pong-dark-primary");
      badge.classList.remove("text-white", "bg-pong-accent");
    }
  }
  window.dispatchEvent(
    new CustomEvent("notification-count", { detail: unseenCount })
  );
}

async function processPendingMessageGroup(senderId: number) {
  const groupData = pendingMessageGroups.get(senderId);
  if (!groupData || groupData.notifications.length === 0) return;

  const notifList = document.getElementById("notif-list");
  if (!notifList) return;

  if (groupData.timeout) {
    clearTimeout(groupData.timeout);
  }

  const existingGroup = document.getElementById(`msg-group-${senderId}`);

  if (existingGroup) {
    const badge = existingGroup.querySelector(".msg-count") as HTMLSpanElement;
    if (badge) {
      const currentCount = parseInt(badge.textContent || "0");
      const newCount = currentCount + groupData.notifications.length;
      badge.textContent = String(newCount);
    }

    const existingIds = JSON.parse(existingGroup.dataset.groupedIds || "[]");
    const newIds = groupData.notifications.map((n) => n.notification_id);
    existingGroup.dataset.groupedIds = JSON.stringify([
      ...existingIds,
      ...newIds,
    ]);
  } else {
    const firstNotif = groupData.notifications[0];
    const allIds = groupData.notifications.map((n) => n.notification_id);
    const groupedElement = await renderGroupedMessageNotification(
      firstNotif,
      groupData.notifications.length,
      allIds
    );
    notifList.prepend(groupedElement);
  }

  pendingMessageGroups.delete(senderId);

  while (notifList.children.length > 20) {
    notifList.removeChild(notifList.lastChild!);
  }
}

// --- Render Single Notification ---
async function renderNotification(notif: Notification) {
  const li = document.createElement("li");
  li.className = `
    text-sm text-left text-white p-3 rounded-md shadow-lg border border-pong-dark-primary/40
    bg-pong-dark-bg hover:bg-pong-dark-primary/10 transition-all duration-200 cursor-pointer
  `;
  li.setAttribute("data-id", String(notif.notification_id));
  li.setAttribute("data-sender", String(notif.sender_id));

  let route = "";
  let label = "";
  const sender = await getUserById(notif.sender_id || 0);
  if (!sender) {
    return li;
  }

  switch (notif.type) {
    case "FRIEND_REQUEST_SENT":
      label = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-user-plus text-pong-accent text-base"></i>
          <span>
            <span class="text-pong-accent font-semibold">${getWelcomeTitle(
              sender
            )} ${sender.username}</span> served you a friend request.
          </span>
        </div>
      `;
      route = `/members`;
      break;

    case "FRIEND_REQUEST_ACCEPTED":
      label = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-user-check text-pong-success text-base"></i>
          <span>
            <span class="text-pong-success font-semibold">${getWelcomeTitle(
              sender
            )} ${
        sender.username
      }</span> returned your serve and is now your friend!
          </span>
        </div>
      `;
      route = `/members/${notif.sender_id}`;
      break;

    case "MESSAGE_RECEIVED":
      label = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-message text-pong-accent text-base"></i>
          <span>
            <span class="font-semibold text-pong-accent">${getWelcomeTitle(
              sender
            )} ${
        sender.username
      }</span> lobbed you a new message — time to return it!
          </span>
        </div>
      `;
      route = `/lounge/${notif.sender_id}`;
      break;

    case "INVITE_SENT":
      label = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-gamepad text-pong-accent text-base"></i>
          <span>
            <span class="text-pong-accent font-semibold">${getWelcomeTitle(
              sender
            )} ${
        sender.username
      }</span> challenged you to a match — ready to play?
          </span>
        </div>
      `;
      setTimeout(() => {
        showInviteNotification(
          sender?.username || "Unknown",
          async () => {
            await acceptInvite(
              notif.roomId || "",
              notif.sender_id || 0,
              notif.recipient_id || 0
            );
            markNotificationsAsRead([notif.notification_id]);
            li.remove();
            navigateTo(`/remote?roomId=${notif.roomId}`);
          },
          () => {
            markNotificationsAsRead([notif.notification_id]);
            li.remove();
            displayToast("Invitation declined — match cancelled.", "warning");
          }
        );
      }, 0);
      route = `/members/${notif.sender_id}`;
      break;

    case "PLAY_AGAIN":
      label = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-gamepad text-pong-accent text-base"></i>
          <span>
            <span class="text-pong-accent font-semibold">${getWelcomeTitle(
              sender
            )} ${sender.username}</span> want to play again
          </span>
        </div>
      `;
      setTimeout(() => {
        displayToast(
          "Your opponent's ready for a rematch — time to rally!",
          "success"
        );
        markNotificationsAsRead([notif.notification_id]);
      }, 0);
      route = `/members/${notif.sender_id}`;
      break;

    case "INVITE_ACCEPTED":
      displayToast("Match confirmed — preparing the arena...", "success");
      document.getElementById("remote-invite-modal")?.remove();
      setTimeout(() => {
        navigateTo(`/remote?roomId=${notif.roomId}`);
        markNotificationsAsRead([notif.notification_id]);
        li.remove();
      }, 1200);
      break;

    default:
      label = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-bell text-pong-accent text-base"></i>
          <span>New notification received.</span>
        </div>
      `;
      break;
  }

  li.innerHTML = label;

  li.onclick = () => {
    const ids = [notif.notification_id];

    if (ids.length > 0) {
      markNotificationsAsRead(ids);
      unseenCount = Math.max(0, unseenCount - ids.length);
      updateCounter();
    }

    // Store route before DOM manipulation
    const routeToNavigate = route;

    // Remove the clicked notification immediately
    const notifList = document.getElementById("notif-list");
    if (notifList && notifList.contains(li)) {
      try {
        notifList.removeChild(li);
      } catch {}
    }

    // Navigate after DOM update to ensure DOM changes are processed
    if (routeToNavigate) {
      requestAnimationFrame(() => {
        navigateTo(routeToNavigate);
      });
    }
  };

  return li;
}

// --- Render Grouped Message Notification ---
async function renderGroupedMessageNotification(
  notif: Notification,
  count: number,
  groupedIds: number[]
) {
  const li = document.createElement("li");
  li.className = `
    text-sm text-white p-3 rounded-md shadow-lg border border-pong-dark-primary/40
    bg-pong-dark-bg hover:bg-pong-dark-primary/10 transition-all duration-200 cursor-pointer flex items-center justify-between
  `;
  li.id = `msg-group-${notif.sender_id}`;
  li.setAttribute("data-sender", String(notif.sender_id));
  li.dataset.groupedIds = JSON.stringify(groupedIds);

  const sender = await getUserById(notif.sender_id || 0);

  li.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-message text-pong-accent text-base"></i>
      <span>
        New messages from <span class="font-semibold text-pong-accent">${sender?.username}</span>.
      </span>
    </div>
    <span class="msg-count bg-pong-accent text-black font-bold px-2 py-0.5 rounded-full ml-4">${count}</span>
  `;

  li.onclick = () => {
    const ids = JSON.parse(li.dataset.groupedIds || "[]");
    markNotificationsAsRead(ids);
    unseenCount = Math.max(0, unseenCount - ids.length);
    updateCounter();

    // Store the sender_id before DOM manipulation
    const senderIdToNavigate = notif.sender_id;

    // Remove only the clicked grouped notification
    const notifList = document.getElementById("notif-list");
    if (notifList && notifList.contains(li)) {
      try {
        notifList.removeChild(li);
      } catch (e) {
        // Element might have been removed already
        // console.warn("Element already removed from DOM");
      }
    }

    // Navigate after DOM update using requestAnimationFrame
    requestAnimationFrame(() => {
      navigateTo(`/lounge/${senderIdToNavigate}`);
    });
  };

  return li;
}

// --- Start Notification Listener ---
export function startNotificationListener() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    // console.warn("[notif] WebSocket connection is already open");
    return;
  }

  ws = new WebSocket("/notifications");

  ws.onmessage = async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      // Handle unread count update
      if (data.type === "UNREAD_COUNT") {
        unseenCount = data.count;
        updateCounter();

        // Mark the received notification IDs as processed
        if (data.notification_ids) {
          data.notification_ids.forEach((id: number) => {
            received.add(id);
          });
          saveReceived();
        }

        return;
      }

      // Handle friend request cancellation
      if (data.type === "FRIEND_REQUEST_CANCELED") {
        const notifList = document.getElementById("notif-list");
        if (notifList) {
          Array.from(notifList.children).forEach((li) => {
            if (
              li instanceof HTMLElement &&
              li.innerHTML.includes("fa-user-plus") &&
              li.getAttribute("data-sender") === String(data.sender_id)
            ) {
              li.remove();
              unseenCount = Math.max(0, unseenCount - 1);
              updateCounter();
            }
          });
        }
        return;
      }

      if (data.type === "INVITE_SENT") {
        const notifList = document.getElementById("notif-list");
        if (notifList) {
          const toMarkRead: number[] = [];
          Array.from(notifList.children).forEach((li) => {
            if (
              li instanceof HTMLElement &&
              li.getAttribute("data-sender") === String(data.sender_id) &&
              li.innerHTML.includes("fa-gamepad")
            ) {
              const prevId = li.getAttribute("data-id");
              if (prevId) {
                toMarkRead.push(Number(prevId));
              }
              li.remove();
            }
          });

          if (toMarkRead.length > 0) {
            markNotificationsAsRead(toMarkRead);
            unseenCount = Math.max(0, unseenCount - toMarkRead.length);
            updateCounter();
          }

          notifList.prepend(await renderNotification(data));
          while (notifList.children.length > 20) {
            notifList.removeChild(notifList.lastChild!);
          }
        }
        return;
      }

      // Increment unseen count only for *new* notification IDs
      if (data.notification_id && !received.has(data.notification_id)) {
        unseenCount++;
        updateCounter();
        received.add(data.notification_id);
        saveReceived();
      }

      // Handle rendering notifications
      if (data.notification_id) {
        const notifList = document.getElementById("notif-list");
        if (notifList) {
          if (data.type === "MESSAGE_RECEIVED") {
            const senderId = data.sender_id;

            // Check if there's already a pending group for this sender
            if (pendingMessageGroups.has(senderId)) {
              const groupData = pendingMessageGroups.get(senderId)!;
              if (groupData.timeout) {
                clearTimeout(groupData.timeout);
              }
              groupData.notifications.push(data);
            } else {
              // Create new pending group
              pendingMessageGroups.set(senderId, {
                notifications: [data],
                timeout: null,
              });
            }

            // Set a timeout to process the group
            const groupData = pendingMessageGroups.get(senderId)!;
            groupData.timeout = setTimeout(() => {
              processPendingMessageGroup(senderId);
            }, 50);
          } else {
            notifList.prepend(await renderNotification(data));

            while (notifList.children.length > 20) {
              notifList.removeChild(notifList.lastChild!);
            }
          }
        }
      }
    } catch (err) {
      displayToast(
        "The club's lights are out at the moment. Try again shortly.",
        "error"
      );
      // console.error("[Notif] Error handling notification:", err);
    }
  };

  ws.onclose = () => {
    ws = null;
    // Clear any pending message groups when connection closes
    pendingMessageGroups.forEach((groupData) => {
      if (groupData.timeout) {
        clearTimeout(groupData.timeout);
      }
    });
    pendingMessageGroups.clear();
  };
}

// --- Stop Notification Listener ---
export function stopNotificationListener() {
  if (ws) {
    ws.close();
    ws = null;
  }

  // Clear pending message groups
  pendingMessageGroups.forEach((groupData) => {
    if (groupData.timeout) {
      clearTimeout(groupData.timeout);
    }
  });
  pendingMessageGroups.clear();

  sessionStorage.removeItem("seenNotifs");
  unseenCount = 0;
  updateCounter();
  seenIds.clear();
  window.dispatchEvent(new CustomEvent("notification-count", { detail: 0 }));
}

// --- Clear All Notifications ---
export function clearAllNotifications() {
  const notifList = document.getElementById("notif-list");
  if (notifList) {
    // Get all notification IDs from current displayed notifications
    const allNotifIds: number[] = [];
    Array.from(notifList.children).forEach((li) => {
      if (li instanceof HTMLElement) {
        const notifId = li.getAttribute("data-id");
        if (notifId) {
          allNotifIds.push(parseInt(notifId));
        }
        if (li.id.startsWith("msg-group-")) {
          const groupedIdsStr = li.getAttribute("data-grouped-ids");
          if (groupedIdsStr) {
            try {
              const groupedIds = JSON.parse(groupedIdsStr);
              allNotifIds.push(...groupedIds);
            } catch (e) {
              // console.warn("[Notif] Failed to parse grouped IDs");
            }
          }
        }
      }
    });

    notifList.innerHTML = "";

    // Mark all notifications as read if we have any
    if (allNotifIds.length > 0) {
      markNotificationsAsRead(allNotifIds);
    }
  }

  // Clear any pending message groups
  pendingMessageGroups.forEach((groupData) => {
    if (groupData.timeout) {
      clearTimeout(groupData.timeout);
    }
  });
  pendingMessageGroups.clear();

  unseenCount = 0;
  updateCounter();
  seenIds.clear();
  saveSeen();
  window.dispatchEvent(new CustomEvent("notification-count", { detail: 0 }));
}

// --- Mark Notifications As Read ---
export function markNotificationsAsRead(ids: (number | null | undefined)[]) {
  const cleanIds = ids.filter((id): id is number => typeof id === "number");
  if (cleanIds.length === 0) return;

  if (ws && ws.readyState === WebSocket.OPEN) {
    cleanIds.forEach((id) => seenIds.add(id));
    saveSeen();

    ws.send(
      JSON.stringify({
        type: "NOTIFICATION_READ",
        notification_ids: cleanIds,
      })
    );
  }
}
