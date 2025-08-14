import { displayToast } from "@/utils/display-toast";
import { navigateTo } from "@/utils/navigate-to-link";
import { UpdatePasswordRes } from "@/utils/response-messages";

export function handleResetPassword() {
  const form = document.getElementById(
    "update-password-form"
  ) as HTMLFormElement;

  if (!form) return;

  form.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>("#submit-btn");
    const spinner = form.querySelector<HTMLSpanElement>("#spinner");
    const btnLabel = form.querySelector<HTMLSpanElement>("#btn-label");
    const passwordInput = form.querySelector<HTMLInputElement>("#new-password");
    const confirmPasswordInput = form.querySelector<HTMLInputElement>(
      "#confirm-new-password"
    );

    if (
      !submitBtn ||
      !spinner ||
      !btnLabel ||
      !passwordInput ||
      !confirmPasswordInput
    ) {
      return;
    }

    const btnLabelText = btnLabel.textContent;
    const feedbackDelay = 900;
    const redirectDelay = 1500;

    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!password) {
      passwordInput.focus();
      return;
    }
    if (!confirmPassword) {
      confirmPasswordInput.focus();
      return;
    }
    if (password !== confirmPassword) {
      displayToast(UpdatePasswordRes.UNMATCHED_PASSWORDS, "error");
      confirmPasswordInput.value = "";
      passwordInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    spinner.classList.remove("hidden");
    btnLabel.textContent = "updating...";

    try {
      const response = await fetch("/auth/update-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setTimeout(() => {
          displayToast(UpdatePasswordRes.USER_LOGGED_IN, "success");
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
            UpdatePasswordRes[result?.code] ||
            "Error during password update. Please try again.";
          displayToast(errorMsg, "error");
        }, feedbackDelay);
      }
    } catch (err) {
      displayToast(UpdatePasswordRes.INTERNAL_SERVER_ERROR, "error");
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
