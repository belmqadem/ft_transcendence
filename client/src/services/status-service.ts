import { displayToast } from "@/utils/display-toast";

let ws: WebSocket | null = null;
let onlineStatusMap: Record<number, boolean> = {};

export function getUserStatus(userId: number): boolean {
  return onlineStatusMap[userId] || false;
}

export function startStatusListener(): void {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(`wss://${window.location.host}/profile/statuses`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.userStatuses) {
        onlineStatusMap = {};
        data.userStatuses.forEach(
          (u: { userId: number; isOnline: boolean }) => {
            onlineStatusMap[u.userId] = u.isOnline;
          }
        );

        window.dispatchEvent(new Event("status-updated"));
      }
    } catch {}
  };

  ws.onerror = () => {
    // console.error("Error in status service WebSocket");
  };

  ws.onclose = () => {
    ws = null;
  };
}

export function stopStatusListener(): void {
  if (ws) {
    ws.close();
    ws = null;
  }
}
