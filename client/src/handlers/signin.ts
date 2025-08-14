import { displayToast } from "@/utils/display-toast";
import { navigateTo } from "@/utils/navigate-to-link";
import { LoginRes } from "@/utils/response-messages";

export function handleSignIn() {
  const signInForm = document.getElementById("signin-form") as HTMLFormElement;
  const loginInput = document.getElementById("login") as HTMLInputElement;

  if (!loginInput || !signInForm) return;

  const savedLogin = localStorage.getItem("loginInput");
  if (savedLogin) loginInput.value = savedLogin;

  loginInput.addEventListener("input", () => {
    localStorage.setItem("loginInput", loginInput.value);
  });

  signInForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const submitBtn =
      signInForm.querySelector<HTMLButtonElement>("#submit-btn");
    const spinner = signInForm.querySelector<HTMLSpanElement>("#spinner");
    const btnLabel = signInForm.querySelector<HTMLSpanElement>("#btn-label");
    const passwordInput =
      signInForm.querySelector<HTMLInputElement>("#password");

    if (!submitBtn || !spinner || !btnLabel || !passwordInput) return;

    const btnLabelText = btnLabel.textContent;
    const feedbackDelay = 900;
    const redirectDelay = 1500;

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login) {
      loginInput.focus();
      return;
    }
    if (!password) {
      passwordInput.focus();
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
    const payload = isEmail
      ? { email: login, password }
      : { username: login, password };

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    spinner.classList.remove("hidden");
    btnLabel.textContent = "entering...";

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200) {
        localStorage.removeItem("loginInput");

        setTimeout(() => {
          displayToast(LoginRes.USER_LOGGED_IN, "success");

          setTimeout(() => {
            navigateTo("/salon");
          }, redirectDelay);
        }, feedbackDelay);
      } else if (response.status === 429) {
        setTimeout(() => {
          displayToast(
            "Easy, champ! Let’s give it a second to catch up.",
            "error"
          );
        }, feedbackDelay);
      } else if (response.ok && result.statusCode === 206) {
        localStorage.removeItem("loginInput");

        sessionStorage.setItem("2faMode", result.data?.twoFaType);

        setTimeout(() => {
          displayToast(LoginRes.TWOFA_REQUIRED, "warning");

          setTimeout(() => {
            navigateTo("/verify_login");
          }, redirectDelay);
        }, feedbackDelay);
      } else {
        setTimeout(() => {
          const errorMsg =
            LoginRes[result?.code] || "Error during login. Please try again.";
          displayToast(errorMsg, "error");
        }, feedbackDelay);
      }
    } catch (err) {
      displayToast(LoginRes.INTERNAL_SERVER_ERROR, "error");
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.setAttribute("aria-busy", "false");
        spinner.classList.add("hidden");
        btnLabel.textContent = btnLabelText;
      }, feedbackDelay + 300);
    }
  });
}
