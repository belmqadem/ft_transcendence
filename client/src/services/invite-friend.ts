import { displayToast } from "@/utils/display-toast";

export async function inviteFriend(receiverId: number): Promise<Response> {
  try {
    const res = await fetch("/game/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ receiverId }),
    });

    if (res.ok) {
      displayToast("Challenge issued successfully", "success");
    } else {
      displayToast(
        "Failed to issue the challenge. Try again, warrior!",
        "error"
      );
    }
    return res;
  } catch {
    displayToast("Connection lost. Challenge could not be sent.", "error");
    throw new Error("Connection lost");
  }
}
