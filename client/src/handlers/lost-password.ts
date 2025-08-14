import { displayToast } from "@/utils/display-toast";
import { LostPasswordRes } from "@/utils/response-messages";

export function handleLostPassword() {
  const form = document.getElementById("lost-password-form") as HTMLFormElement;
  const otpForm = document.getElementById(
    "lost-pass-otp-form"
  ) as HTMLFormElement;
  const otpEmailInput = document.getElementById(
    "reset-pass-email"
  ) as HTMLInputElement;
  if (!form || !otpForm || !otpEmailInput) return;

  const savedEmail = localStorage.getItem("otpEmailInput");
  if (savedEmail) otpEmailInput.value = savedEmail;

  otpEmailInput.addEventListener("input", () => {
    localStorage.setItem("otpEmailInput", otpEmailInput.value);
  });

  form.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>("#submit-btn");
    const spinner = form.querySelector<HTMLSpanElement>("#spinner");
    const btnLabel = form.querySelector<HTMLSpanElement>("#btn-label");

    if (!submitBtn || !spinner || !btnLabel) return;

    const btnLabelText = btnLabel.textContent;
    const feedbackDelay = 900;

    const email = otpEmailInput.value.trim();
    if (!email) {
      otpEmailInput.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      otpEmailInput.focus();
      displayToast(
        "That doesn’t look like a valid email. Check the format and try again.",
        "error"
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    spinner.classList.remove("hidden");
    btnLabel.textContent = "sending email...";

    try {
      const response = await fetch("/auth/lost-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem("otpEmailInput");

        setTimeout(() => {
          displayToast(LostPasswordRes.CODE_SENT, "success");
          otpEmailInput.value = "";
          form.classList.add("hidden");
          otpForm.classList.remove("hidden");
          otpForm.classList.add("flex");
          otpForm.querySelector("input")?.focus();
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
            LostPasswordRes[result?.code] ||
            "Error during lost password request. Please try again.";
          displayToast(errorMsg, "error");
        }, feedbackDelay);
      }
    } catch (err) {
      displayToast(LostPasswordRes.INTERNAL_SERVER_ERROR, "error");
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
