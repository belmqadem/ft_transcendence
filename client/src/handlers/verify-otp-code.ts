import { displayToast } from "@/utils/display-toast";
import { navigateTo } from "@/utils/navigate-to-link";
import { TokenErrorRes, VerifyCodeRes } from "@/utils/response-messages";

export function verifyOtpCode() {
  const otpForm = document.getElementById(
    "lost-pass-otp-form"
  ) as HTMLFormElement;
  if (!otpForm) return;

  const otpInputs = otpForm.querySelectorAll<HTMLInputElement>(
    "#lost-pass-otp input"
  );

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (
        input.value.match(/^\d$/) &&
        input.value.length === 1 &&
        index < otpInputs.length - 1
      ) {
        otpInputs[index + 1].focus();
      }

      if (!/^\d$/.test(input.value)) {
        input.value = "";
      }

      const otpCode = Array.from(otpInputs)
        .map((input) => input.value.trim())
        .join("");

      if (otpCode.length === 6) {
        otpForm.requestSubmit();
      }
    });

    input.addEventListener("paste", (e: ClipboardEvent) => {
      const pasted = e.clipboardData?.getData("text") ?? "";
      const digits = pasted.replace(/\D/g, "").slice(0, otpInputs.length);

      digits.split("").forEach((digit, i) => {
        if (otpInputs[i]) {
          otpInputs[i].value = digit;
        }
      });

      if (otpInputs[digits.length - 1]) {
        otpInputs[digits.length - 1].focus();
      }

      if (digits.length === 6) {
        otpForm.requestSubmit();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        const focusedInput = document.activeElement as HTMLInputElement;
        const focusedIndex = Array.from(otpInputs).indexOf(focusedInput);

        if (focusedIndex > 0 && focusedInput.value === "") {
          otpInputs[focusedIndex - 1].focus();
        }
      }
    });
  });

  otpForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const submitBtn = otpForm.querySelector<HTMLButtonElement>("#submit-btn");
    const spinner = otpForm.querySelector<HTMLSpanElement>("#spinner");
    const btnLabel = otpForm.querySelector<HTMLSpanElement>("#btn-label");

    if (!submitBtn || !spinner || !btnLabel) return;

    const btnLabelText = btnLabel.textContent;
    const feedbackDelay = 900;
    const redirectDelay = 1500;

    const otpCode = Array.from(otpInputs)
      .map((input) => input.value.trim())
      .join("");

    if (otpCode.length !== 6) {
      displayToast("Please enter a valid 6-digit code.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    spinner.classList.remove("hidden");
    btnLabel.textContent = "verifying...";

    try {
      const response = await fetch("/auth/verify-code", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setTimeout(() => {
          displayToast(VerifyCodeRes.CODE_VERIFIED, "success");

          setTimeout(() => {
            navigateTo("/password_update");
          }, redirectDelay);
        }, feedbackDelay);
      } else if (response.status === 429) {
        setTimeout(() => {
          displayToast(
            "Easy, champ! Let’s give it a second to catch up.",
            "error"
          );
          otpInputs.forEach((input) => {
            input.value = "";
          });
          otpInputs[0].focus();
        }, feedbackDelay);
      } else {
        setTimeout(() => {
          const errorMsg =
            (response.status === 401
              ? TokenErrorRes[result?.code]
              : VerifyCodeRes[result?.code]) ||
            "Error during OTP verification. Please try again.";
          displayToast(errorMsg, "error");
          otpInputs.forEach((input) => {
            input.value = "";
          });
          otpInputs[0].focus();
        }, feedbackDelay);
      }
    } catch (err) {
      displayToast(VerifyCodeRes.INTERNAL_SERVER_ERROR, "error");
      otpInputs.forEach((input) => {
        input.value = "";
      });
      otpInputs[0].focus();
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
