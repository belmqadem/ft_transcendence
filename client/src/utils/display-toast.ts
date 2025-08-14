export function displayToast(
  message: string,
  type: "success" | "error" | "warning"
) {
  const existingToast = document.getElementById("global-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "global-toast";

  toast.className = `
    fixed top-6 left-1/2 transform -translate-x-1/2 z-50
    px-6 py-4 sm:px-8 sm:py-5
    min-w-[250px] max-w-sm w-fit
    rounded-2xl border shadow-xl backdrop-blur-md
    flex flex-col items-center gap-2
    text-white animate-toast-slide-down
    ${
      type === "success"
        ? "bg-pong-success/90 border-pong-success/40"
        : type === "error"
        ? "bg-pong-error/90 border-pong-error/40"
        : "bg-pong-warning/90 border-pong-warning/40"
    }
  `;

  const icon = document.createElement("i");
  icon.className = `fa-solid ${
    type === "success"
      ? "fa-circle-check"
      : type === "error"
      ? "fa-circle-xmark"
      : "fa-triangle-exclamation"
  } text-xl mb-[0.25rem] text-white`;

  const msg = document.createElement("span");
  msg.className =
    "text-sm sm:text-base font-semibold text-center tracking-wide leading-snug";
  msg.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(msg);

  const duration = type === "success" ? 2200 : 2600;

  const progress = document.createElement("div");
  progress.className =
    "h-1 w-full bg-white/20 rounded-b-xl mt-1 overflow-hidden";
  const bar = document.createElement("div");
  bar.className =
    "h-full bg-white transition-[width] ease-linear duration-1000 w-full";
  bar.style.transition = `width ${duration}ms linear`;
  progress.appendChild(bar);
  toast.appendChild(progress);

  setTimeout(() => {
    bar.style.width = "0%";
  }, 20);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -20px)";
    toast.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, duration);
}
