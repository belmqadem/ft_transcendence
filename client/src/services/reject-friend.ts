import { displayToast } from "@/utils/display-toast";
import { FriendRejectRes } from "@/utils/response-messages";

export async function rejectFriend(requesterId: number): Promise<boolean> {
  try {
    const res = await fetch("/friends/reject", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requesterId }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg =
        FriendRejectRes[data.code] || "Failed to reject friend request.";
      displayToast(msg, "error");
      return false;
    }

    displayToast(FriendRejectRes.FRIEND_REQUEST_REJECTED, "success");
    return true;
  } catch {
    displayToast(FriendRejectRes.INTERNAL_SERVER_ERROR, "error");
    return false;
  }
}
