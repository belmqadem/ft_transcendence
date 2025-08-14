export function initGameThemeToggle() {
  const toggleBtn = document.getElementById("game-theme-toggle");
  const container = document.getElementById("game-screen");

  if (!toggleBtn || !container) return;

  const setIcon = () => {
    const isDark = container.dataset.theme === "dark";
    toggleBtn.innerHTML = isDark
      ? '<i class="fa-solid fa-moon"></i><span class="absolute text-xs bg-black/80 text-white px-2 py-0.5 rounded left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition">Switch Mood</span>'
      : '<i class="fa-solid fa-sun"></i><span class="absolute text-xs bg-black/80 text-white px-2 py-0.5 rounded left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition">Switch Mood</span>';
  };

  setIcon();

  toggleBtn.addEventListener("click", (e: Event) => {
    e.preventDefault();

    const isDark = container.dataset.theme === "dark";
    container.dataset.theme = isDark ? "light" : "dark";

    localStorage.setItem("gameTheme", container.dataset.theme);
    
	setIcon();
  });
}
