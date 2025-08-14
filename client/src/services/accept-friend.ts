import { displayToast } from "@/utils/display-toast";
import { FriendAcceptRes } from "@/utils/response-messages";

export async function acceptFriend(requesterId: number): Promise<boolean> {
  try {
    const res = await fetch("/friends/accept", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requesterId }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg =
        FriendAcceptRes[data.code] || "Failed to accept friend request.";
      displayToast(msg, "error");
      return false;
    }
    displayToast(FriendAcceptRes.FRIEND_REQUEST_ACCEPTED, "success");
    return true;
  } catch {
    displayToast(FriendAcceptRes.INTERNAL_SERVER_ERROR, "error");
    return false;
  }
}
