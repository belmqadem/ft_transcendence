import { styles } from "@/styles/styles";
import { clearAllNotifications } from "@/services/notifications-service";
import { handleSearchMembers } from "@/handlers/search-members";

export function TopBar() {
  setTimeout(() => {
    const badge = document.getElementById("notif-badge") as HTMLSpanElement;
    if (!badge) return;

    function updateBadge(e: CustomEvent) {
      const count = Number(e.detail);
      badge.textContent = count > 0 ? String(count) : "0";
      if (count > 0) {
        badge.classList.remove("text-black", "bg-pong-dark-primary");
        badge.classList.add("text-white", "bg-pong-accent");
      } else {
        badge.classList.add("text-black", "bg-pong-dark-primary");
        badge.classList.remove("text-white", "bg-pong-accent");
      }

      const clearAllBtn = document.getElementById("clear-all-notifs");
      if (clearAllBtn) {
        clearAllBtn.style.display = count > 0 ? "block" : "none";
      }
    }

    window.addEventListener("notification-count", updateBadge as EventListener);

    const notifContainer = document.getElementById("notif-container");
    const btn = document.getElementById("bell-btn") as HTMLButtonElement;
    if (!notifContainer || !btn) return;

    const clearAllBtn = document.getElementById(
      "clear-all-notifs"
    ) as HTMLButtonElement;
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        clearAllNotifications();
      });

      const notifList = document.getElementById("notif-list");
      if (notifList && notifList.children.length === 0) {
        clearAllBtn.style.display = "none";
      }
    }

    btn.addEventListener("click", () => {
      notifContainer.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (
        !btn.contains(e.target as Node) &&
        !notifContainer.contains(e.target as Node)
      ) {
        notifContainer.classList.add("hidden");
      }
    });

    const searchBar = document.getElementById("search-bar") as HTMLInputElement;
    const closeIcon = document.getElementById(
      "search-close-icon"
    ) as HTMLButtonElement;
    if (searchBar) {
      searchBar.addEventListener("input", () => {
        handleSearchMembers(searchBar.value);
        if (searchBar.value.trim()) {
          closeIcon.style.display = "flex";
        } else {
          closeIcon.style.display = "none";
        }
      });
      searchBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          handleSearchMembers(searchBar.value);
        }
      });
    }
    if (closeIcon) {
      closeIcon.addEventListener("click", () => {
        searchBar.value = "";
        closeIcon.style.display = "none";
        const oldList = document.getElementById("search-results");
        if (oldList) oldList.remove();
        searchBar.focus();
      });
      closeIcon.style.display = "none";
    }
  }, 0);

  return (
    <header className={styles.navBarStyle}>
      <div className="relative w-full max-w-md ml-14 md:ml-0">
        <input
          type="text"
          id="search-bar"
          placeholder="Find A Racket Companion..."
          className={styles.searchBarStyle}
          maxLength={15}
          autoComplete="off"
        />
        <button
          id="search-close-icon"
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-pong-dark-primary/30 hover:bg-pong-dark-accent/40 text-pong-dark-secondary hover:text-white transition-all duration-200"
        //   style={{ display: "none" }}
          tabIndex={-1}
          aria-label="Clear search"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div className="flex items-center gap-8">
        <button
          id="bell-btn"
          className="relative text-xl text-pong-dark-primary hover:text-pong-dark-accent"
          aria-label="Show notifications"
        >
          <i className="fa-regular fa-bell"></i>
          <span
            id="notif-badge"
            className="absolute -top-1 -right-2 bg-pong-dark-primary text-black text-xs rounded-full px-2 py-0.5 transition-all duration-300"
          >
            0
          </span>
          <div
            id="notif-container"
            className="animate-fadeInUp absolute bg-pong-dark-bg text-pong-dark-primary w-[300px] md:w-[430px] lg:w-[480px] max-h-[480px] hidden right-0 shadow-2xl rounded-xl p-4 mt-2 z-50 border border-pong-dark-highlight/30"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg lg:text-xl text-pong-secondary flex items-center gap-2">
                <i className="fa-regular fa-bell"></i> Club Updates
              </h3>
              <button
                id="clear-all-notifs"
                type="button"
                className="px-3 py-1 rounded bg-pong-dark-accent text-white hover:bg-pong-accent text-xs"
                aria-label="Clear all notifications"
              >
                Clear All
              </button>
            </div>
            <ul
              id="notif-list"
              className="list-none px-1 m-0 space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar"
            ></ul>
          </div>
        </button>
        <button className="text-xl text-pong-dark-primary hover:text-pong-dark-accent">
          <a href="/my_profile" data-link>
            <i className="fa-regular fa-user"></i>
          </a>
        </button>
      </div>
    </header>
  );
}
