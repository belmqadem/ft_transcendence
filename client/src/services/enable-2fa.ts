import { Change2FaStateRes } from "@/utils/response-messages";
import { displayToast } from "@/utils/display-toast";

export async function enable2FA(
  method: "app" | "email",
  onUpdate?: () => void
) {
  try {
    const res = await fetch("/2fa/enable", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method }),
    });
    const data = await res.json();
    displayToast(
      Change2FaStateRes[data.code] || "2FA enabled",
      res.ok ? "success" : "error"
    );
    if (onUpdate) onUpdate();
  } catch {
    displayToast("Enable 2FA error", "error");
  }
}
