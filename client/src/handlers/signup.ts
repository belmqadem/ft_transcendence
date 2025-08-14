import { displayToast } from "@/utils/display-toast";
import { navigateTo } from "@/utils/navigate-to-link";
import { RegisterRes } from "@/utils/response-messages";
import { UserRegister } from "types/types";

export function handleSignUp() {
  const signupForm = document.getElementById("signup-form") as HTMLFormElement;
  const usernameInput = document.getElementById("username") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;

  if (!signupForm || !usernameInput || !emailInput) return;

  const savedUsername = localStorage.getItem("usernameInput");
  const savedEmail = localStorage.getItem("emailInput");
  if (savedUsername) usernameInput.value = savedUsername;
  if (savedEmail) emailInput.value = savedEmail;

  usernameInput.addEventListener("input", () => {
    localStorage.setItem("usernameInput", usernameInput.value);
  });
  emailInput.addEventListener("input", () => {
    localStorage.setItem("emailInput", emailInput.value);
  });

  signupForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const submitBtn =
      signupForm.querySelector<HTMLButtonElement>("#submit-btn");
    const spinner = signupForm.querySelector<HTMLSpanElement>("#spinner");
    const btnLabel = signupForm.querySelector<HTMLSpanElement>("#btn-label");
    const genderInput = signupForm.querySelector<HTMLInputElement>("#title");
    const passwordInput =
      signupForm.querySelector<HTMLInputElement>("#password");
    const confirmPasswordInput =
      signupForm.querySelector<HTMLInputElement>("#confirm-password");

    if (
      !submitBtn ||
      !spinner ||
      !btnLabel ||
      !genderInput ||
      !passwordInput ||
      !confirmPasswordInput
    )
      return;

    const btnLabelText = btnLabel.textContent;
    const feedbackDelay = 900;
    const redirectDelay = 1500;

    const userInfos: UserRegister = {
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      gender:
        genderInput.value === "Gentleman"
          ? "M"
          : genderInput.value === "Lady"
          ? "F"
          : "",
      password: passwordInput.value.trim(),
      confirmPassword: confirmPasswordInput.value.trim(),
    };

    const { username, email, gender, password, confirmPassword } = userInfos;

    if (!username) {
      usernameInput.focus();
      return;
    }
    if (!email) {
      emailInput.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfos.email)) {
      emailInput.focus();
      displayToast(
        "That doesn’t look like a valid email. Check the format and try again.",
        "error"
      );
      return;
    }
    if (!gender) {
      genderInput.focus();
      return;
    }
    if (!password) {
      passwordInput.focus();
      return;
    }
    if (!confirmPassword) {
      confirmPasswordInput.focus();
      return;
    }
    if (password !== confirmPassword) {
      confirmPasswordInput.focus();
      confirmPasswordInput.value = "";
      displayToast(RegisterRes.UNMATCHED_PASSWORDS, "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    spinner.classList.remove("hidden");
    btnLabel.textContent = "registering...";

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfos),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem("usernameInput");
        localStorage.removeItem("emailInput");

        setTimeout(() => {
          displayToast(RegisterRes.USER_REGISTERED, "success");
          setTimeout(() => {
            navigateTo("/login");
          }, redirectDelay);
        }, feedbackDelay);
      } else if (response.status === 429) {
        setTimeout(() => {
          displayToast(
            "Easy, champ! Let’s give it a second to catch up.",
            "error"
          );
        }, feedbackDelay);
      } else {
        setTimeout(() => {
          const errorMsg =
            RegisterRes[result?.code] ||
            "Error during registration. Please try again.";
          displayToast(errorMsg, "error");
        }, feedbackDelay);
      }
    } catch (err) {
      displayToast(RegisterRes.INTERNAL_SERVER_ERROR, "error");
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
