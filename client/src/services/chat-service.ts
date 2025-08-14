import { MessageSent } from "types/types";
import { displayToast } from "@/utils/display-toast";

let ws: WebSocket | null = null;

export function startChatListener(onMessage: (msg: MessageSent) => void) {
  ws = new WebSocket("/chat");

  ws.onmessage = (event: MessageEvent) => {
    try {
      const message: MessageSent = JSON.parse(event.data);
      onMessage(message);
    } catch (err) {
      displayToast(
        "The club’s lights are out at the moment. Try again shortly.",
        "error"
      );
    }
  };

  ws.onerror = () => {
    displayToast(
      "The club’s lights are out at the moment. Try again shortly.",
      "error"
    );
  };

  ws.onclose = () => {
    ws = null;
  };
}

export function stopChatListener() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

export function sendChatMessage(msg: MessageSent) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        ...msg,
      })
    );
  } else {
    displayToast("Chat connection not established.", "error");
  }
}
