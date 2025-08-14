import { Change2FaStateRes } from "@/utils/response-messages";
import { displayToast } from "@/utils/display-toast";

export async function setPrimaryMethod(
  method: "app" | "email",
  onUpdate?: () => void
): Promise<void> {
  try {
    const res = await fetch("/2fa/primary", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method }),
    });
    const data = await res.json();
    const msg = Change2FaStateRes[data.code] || "Primary method updated";
    displayToast(msg, res.ok ? "success" : "error");
    if (onUpdate) onUpdate();
  } catch {
    displayToast(Change2FaStateRes.INTERNAL_SERVER_ERROR, "error");
  }
}
