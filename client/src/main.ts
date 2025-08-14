import "./styles/all.min.css";
import "./styles/normalize.css";
import "./styles/main.css";
import { router } from "./router";
import { TopBar } from "@/components/layout/TopBar";

function setupSPA(): void {
  document.addEventListener("click", async (e: Event) => {
    const target = e.target as HTMLElement;
    const link = target.closest("[data-link]") as HTMLAnchorElement | null;

    if (link) {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href && href !== window.location.pathname) {
        history.pushState(null, "", href);
        await router(); // Re-render the app with the new route
      }
    }
  });
}

setupSPA();

document.addEventListener("DOMContentLoaded", async () => {
  const topBarContainer = document.getElementById("top-bar");
  if (topBarContainer) {
    topBarContainer.appendChild(TopBar());
  }

  await router();
  window.addEventListener("popstate", router);
});
