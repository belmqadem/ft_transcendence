import { displayToast } from "@/utils/display-toast";

export async function cancelFriendRequest(requesterId: number): Promise<void> {
  try {
    const res = await fetch("/friends/reject", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requesterId }),
    });

    if (!res.ok) {
      displayToast(
        "Error canceling friend request. Please try again.",
        "error"
      );
    }
  } catch {
    displayToast(
      "The club’s lights are out at the moment. Try again shortly.",
      "error"
    );
  }
}
