import { displayToast } from "@/utils/display-toast";
import { hydrateFriends } from "@/handlers/hydrate-friends";
import { FriendBlockRes } from "@/utils/response-messages";

export async function blockFriend(id: number): Promise<void> {
  try {
    const res = await fetch(`/block/${id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      displayToast(
        FriendBlockRes[data.code] ||
          "Failed to block friend. Please try again.",
        "error"
      );
    } else {
      displayToast(FriendBlockRes.BLOCK_SUCCESS, "success");
      await hydrateFriends();
    }
  } catch {
    displayToast(FriendBlockRes.INTERNAL_SERVER_ERROR, "error");
  }
}
