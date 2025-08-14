import { styles } from "@/styles/styles";

export function NavBar() {
  // === NAV ITEMS ===
  const navItems = [
    { path: "/salon", icon: "fa-house", label: "salon" },
    { path: "/arena", icon: "fa-table-tennis-paddle-ball", label: "arena" },
    { path: "/chamber", icon: "fa-ranking-star", label: "chamber" },
    { path: "/lounge", icon: "fa-message", label: "lounge" },
    { path: "/members", icon: "fa-user-group", label: "members" },
  ];

  // === HOVER ZONE ===
  let hoverZone = document.getElementById(
    "hover-zone"
  ) as HTMLDivElement | null;
  if (!hoverZone) {
    hoverZone = document.createElement("div");
    hoverZone.id = "hover-zone";
    hoverZone.className = "hidden md:block fixed top-0 left-0 h-full w-4 z-40";
    document.body.appendChild(hoverZone);
  }

  // === TOGGLE BUTTON ===
  let toggleBtn = document.getElementById(
    "nav-toggle-btn"
  ) as HTMLButtonElement | null;
  if (!toggleBtn) {
    toggleBtn = document.createElement("button");
    toggleBtn.id = "nav-toggle-btn";
    toggleBtn.className = styles.navToggleBtn;
    toggleBtn.setAttribute("aria-label", "Toggle navigation");
    toggleBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    document.body.appendChild(toggleBtn);
  }

  // === BACKDROP ===
  let backdrop = document.getElementById(
    "nav-backdrop"
  ) as HTMLDivElement | null;
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "nav-backdrop";
    backdrop.className = styles.backdrop;
    document.body.appendChild(backdrop);
  }

  // === NAV CONTAINER ===
  const oldNav = document.getElementById("navbar");
  if (oldNav) oldNav.remove();

  const nav = document.createElement("nav");
  nav.id = "navbar";
  nav.className = styles.navBarContainer;

  // === UL NAV ITEMS ===
  const ul = document.createElement("ul");
  ul.className =
    "flex flex-col gap-6 md:gap-8 md:items-center w-full mt-12 md:mt-0";

  navItems.forEach(({ path, icon, label }) => {
    const isActive = location.pathname === path;
    const li = document.createElement("li");
    li.className = "w-full";

    const a = document.createElement("a");
    a.href = path;
    a.setAttribute("data-link", "true");
    a.className = `
      ${styles.navLink}
      ${
        isActive
          ? "bg-pong-dark-accent/30 text-white"
          : "text-pong-dark-primary"
      }
    `;
    a.innerHTML = `
      <i class="fa-solid ${icon} text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110
        ${
          isActive
            ? "text-pong-dark-accent"
            : "text-pong-dark-primary group-hover:text-white md:group-hover:text-pong-dark-accent"
        }
      "></i>
      <span class="
        ${
          isActive
            ? "text-white"
            : "text-pong-dark-primary group-hover:text-white md:group-hover:text-pong-dark-accent"
        }
        transition-colors duration-300
      ">${label}</span>
    `;

    li.appendChild(a);
    ul.appendChild(li);

    a.addEventListener("click", () => {
      if (window.innerWidth < 768) closeMenu();
    });
  });

  // === SETTINGS DROPDOWN ===
  const settingsLi = document.createElement("li");
  settingsLi.className = "w-full relative";

  const settingsBtn = document.createElement("button");
  settingsBtn.type = "button";
  settingsBtn.setAttribute("aria-haspopup", "true");
  settingsBtn.setAttribute("aria-expanded", "false");
  settingsBtn.className = styles.navSettingsBtn;
  settingsBtn.innerHTML = `
    <i class="fa-solid fa-gear text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110"></i>
    <span class="transition-colors duration-300">mechanics</span>
    <i class="fa-solid fa-chevron-down ml-auto text-sm opacity-70 md:hidden transition-transform duration-200" id="settings-arrow"></i>
  `;

  // Settings items
  const settingsItems = [
    { label: "Access Keys", path: "/security", icon: "fa-lock" },
    { label: "Muted Players", path: "/muted_players", icon: "fa-user-slash" },
    { label: "Wipe Account", path: "/wipe_account", icon: "fa-trash" },
  ];

  // === Dropdown menu ===
  const settingsDropdown = document.createElement("ul");
  settingsDropdown.className = styles.navSettingsDropdown;

  settingsItems.forEach(({ label, path, icon }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = path;
    link.setAttribute("data-link", "true");
    link.className = `
      flex items-center gap-3 px-4 py-2 rounded-lg 
      text-pong-dark-primary hover:bg-pong-dark-accent/30 hover:text-white transition
      focus:outline-none focus:bg-pong-dark-accent/40
    `;
    link.innerHTML = `
      <i class="fa-solid ${icon} w-5 text-sm"></i>
      <span>${label}</span>
    `;
    item.appendChild(link);
    settingsDropdown.appendChild(item);

    link.addEventListener("click", () => {
      settingsDropdown.classList.add("hidden");
      settingsBtn.setAttribute("aria-expanded", "false");
      document.getElementById("settings-arrow")?.classList.remove("rotate-180");
      if (window.innerWidth < 768) closeMenu();
    });
  });

  // === Dropdown logic ===
  let dropdownOpen = false;
  const arrowIcon = settingsBtn.querySelector("#settings-arrow");

  function openDropdown() {
    settingsDropdown.classList.remove("hidden");
    settingsBtn.setAttribute("aria-expanded", "true");
    arrowIcon?.classList.add("rotate-180");
    dropdownOpen = true;
  }
  function closeDropdown() {
    settingsDropdown.classList.add("hidden");
    settingsBtn.setAttribute("aria-expanded", "false");
    arrowIcon?.classList.remove("rotate-180");
    dropdownOpen = false;
  }

  settingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownOpen ? closeDropdown() : openDropdown();
  });

  // Close dropdown on outside click
  document.addEventListener("mousedown", (e) => {
    if (
      dropdownOpen &&
      !settingsDropdown.contains(e.target as Node) &&
      !settingsBtn.contains(e.target as Node)
    ) {
      closeDropdown();
    }
  });

  settingsLi.appendChild(settingsBtn);
  settingsLi.appendChild(settingsDropdown);
  ul.appendChild(settingsLi);

  // Keyboard accessibility
  settingsBtn.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
    if (e.key === "ArrowDown" && !dropdownOpen) openDropdown();
  });

  // === EXIT LINK ===
  const exitLi = document.createElement("li");
  exitLi.className = "w-full";
  const exitLink = document.createElement("a");
  exitLink.href = "/checkout";
  exitLink.setAttribute("data-link", "true");
  exitLink.className = styles.navLink;
  exitLink.innerHTML = `
    <i class="fa-solid fa-arrow-right-from-bracket text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110"></i>
    <span class="transition-colors duration-300">checkout</span>
  `;
  exitLi.appendChild(exitLink);
  ul.appendChild(exitLi);

  nav.appendChild(ul);

  // === MENU LOGIC ===
  let menuOpen = false;

  const openMenu = () => {
    nav.classList.remove("-translate-x-full");
    backdrop.classList.add("opacity-100", "pointer-events-auto");
    menuOpen = true;
    toggleBtn!.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  };

  const closeMenu = () => {
    nav.classList.add("-translate-x-full");
    backdrop.classList.remove("opacity-100", "pointer-events-auto");
    menuOpen = false;
    toggleBtn!.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    closeDropdown();
  };

  toggleBtn.onclick = () => {
    menuOpen ? closeMenu() : openMenu();
  };

  backdrop.onclick = closeMenu;

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      nav.classList.remove("-translate-x-full");
      backdrop.classList.remove("opacity-100", "pointer-events-auto");
      menuOpen = false;
      toggleBtn!.innerHTML = `<i class="fa-solid fa-bars"></i>`;
      closeDropdown();
    } else if (!menuOpen) {
      nav.classList.add("-translate-x-full");
      closeDropdown();
    }
  };
  window.addEventListener("resize", handleResize);
  handleResize();

  return nav;
}
