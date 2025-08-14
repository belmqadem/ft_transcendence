import { fontSizes } from "@/styles/fontSizes";
import { startRecentActivityListener } from "@/services/recent-activity-service";

export function RecentActivityFeed(): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className =
    "bg-pong-secondary/10 rounded-lg py-6 px-4 md:p-10 w-full max-w-5xl mx-auto border border-pong-dark-secondary/10";

  const title = document.createElement("h2");
  title.className = `flex items-center gap-3 text-pong-dark-primary font-bold mb-6 tracking-tight ${fontSizes.smallTitleFontSize}`;

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-clock-rotate-left text-pong-dark-accent";

  const text = document.createElement("span");
  text.textContent = "Recent Activity";

  title.appendChild(icon);
  title.appendChild(text);

  wrapper.appendChild(title);

  const ul = document.createElement("ul");
  ul.id = "recent-activity-list";
  ul.className = `space-y-6 ${fontSizes.bodyFontSize} max-h-[340px] overflow-y-auto pr-2`;

  wrapper.appendChild(ul);

  return wrapper;
}
