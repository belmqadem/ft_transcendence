export function showPasswordToggle(showPassId: string, passId: string) {
  const showPass = document.getElementById(showPassId) as HTMLElement;
  const passwordInput = document.getElementById(passId) as HTMLInputElement;
  if (!showPass || !passwordInput) return;

  showPass.addEventListener("click", () => {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
    showPass.classList.toggle("fa-eye");
  });
}
