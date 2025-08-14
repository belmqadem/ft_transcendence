import { hydrateFriends } from "@/handlers/hydrate-friends";
import { displayToast } from "@/utils/display-toast";
import { FriendRemoveRes } from "@/utils/response-messages";

export async function removeFriend(memberId: number): Promise<boolean> {
  try {
    const res = await fetch(`/friends/${memberId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = FriendRemoveRes[data.code] || "Failed to remove friend.";
      displayToast(msg, "error");
      return false;
    }
    displayToast(FriendRemoveRes.FRIEND_REMOVED, "success");
    await hydrateFriends();
    return true;
  } catch {
    displayToast(FriendRemoveRes.INTERNAL_SERVER_ERROR, "error");
    return false;
  }
}
