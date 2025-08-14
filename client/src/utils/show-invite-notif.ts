export function showInviteNotification(
  senderName: string,
  onAccept: () => void,
  onDecline: () => void
) {
  const existing = document.querySelector(".game-invite-notification");
  if (existing) existing.remove();

  const notif = document.createElement("div");
  notif.className =
    "fixed bottom-8 right-8 w-[320px] bg-[#1f1f2e] text-white rounded-xl shadow-lg z-50 overflow-hidden border border-[#2c2c3e] font-sans animate-slideIn game-invite-notification";

  notif.innerHTML = `
    <div class="bg-[#2a2a3d] px-4 py-3 border-b border-[#3a3a50]">
      <h3 class="text-lg font-bold text-pong-dark-primary tracking-wide">Match Invite</h3>
    </div>

    <div class="px-4 py-3 space-y-3">
      <p class="text-sm text-gray-300">
        <span class="font-semibold text-white">${senderName}</span> invited you to play a match.
      </p>

      <div class="flex gap-3">
        <button
          id="accept-invite"
          class="flex-1 bg-pong-success hover:bg-green-600 transition-all text-white text-sm font-semibold py-1.5 rounded-md shadow-md"
        >
          Accept
        </button>
        <button
          id="decline-invite"
          class="flex-1 bg-pong-error hover:bg-red-600 transition-all text-white text-sm font-semibold py-1.5 rounded-md shadow-md"
        >
          Decline
        </button>
      </div>
    </div>

    <div class="h-1 bg-pong-dark-primary relative overflow-hidden">
      <div id="progress-bar" class="absolute top-0 left-0 h-full bg-pong-accent transition-all"></div>
    </div>
  `;

  document.body.appendChild(notif);

  const acceptBtn = document.getElementById(
    "accept-invite"
  ) as HTMLButtonElement;
  const declineBtn = document.getElementById(
    "decline-invite"
  ) as HTMLButtonElement;
  const progressBar = notif.querySelector("#progress-bar") as HTMLDivElement;

  let progress = 0;
  const duration = 5000;
  const interval = 50;
  const step = (interval / duration) * 100;

  const progressInterval = setInterval(() => {
    progress += step;
    if (progressBar) progressBar.style.width = `${progress}%`;
  }, interval);

  const timeoutId = setTimeout(() => {
    notif.classList.add("animate-fadeDown");
    setTimeout(() => notif.remove(), 300);
  }, duration);

  const clearTimers = () => {
    clearTimeout(timeoutId);
    clearInterval(progressInterval);
  };

  acceptBtn.onclick = () => {
    clearTimers();
    notif.remove();
    onAccept();
  };

  declineBtn.onclick = () => {
    clearTimers();
    notif.remove();
    onDecline();
  };
}
