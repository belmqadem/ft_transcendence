import { displayToast } from "@/utils/display-toast";
import { FriendRequestRes } from "@/utils/response-messages";

export async function sendFriendRequest(addresseeId: number): Promise<void> {
  try {
    const res = await fetch("/friends/request", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresseeId }),
    });

    const data = await res.json();

    if (res.ok) {
      displayToast(FriendRequestRes.FRIEND_REQUEST_SENT, "success");
    } else {
      const msg =
        FriendRequestRes[data?.code] ||
        "Error sending friend request. Please try again.";
      displayToast(msg, "error");
    }
  } catch {
    displayToast(FriendRequestRes.INTERNAL_SERVER_ERROR, "error");
  }
}
