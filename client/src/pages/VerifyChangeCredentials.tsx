import { styles } from "@/styles/styles";
import { handleVerifyCredentials } from "@/handlers/verify-update-credentials";

import { fontSizes } from "@/styles/fontSizes";

export function VerifyChangeCredentials() {
  setTimeout(() => {
    handleVerifyCredentials();
  }, 0);

  const twofaMode = sessionStorage.getItem("2faModeUpdate");

  const isAppMode = twofaMode === "app";
  const instructionText = isAppMode
    ? "Open your 2FA app and enter the 6-digit code to confirm your update."
    : "Enter the one-time code we just sent to your email to verify the change.";

  return (
    <section className={styles.pageLayoutDark}>
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <div className={styles.darkForm}>
            <h2
              className={`${fontSizes.smallTitleFontSize} font-bold text-pong-accent mb-2`}
            >
              Confirm Changes
            </h2>
            <p
              className={`${fontSizes.smallTextFontSize} text-pong-secondary/80 text-center mb-6`}
            >
              {instructionText}
            </p>

            <form id="verify-otp-form" className="w-full flex flex-col gap-4">
              <input
                type="text"
                name="otp"
                id="otp"
                inputMode="numeric"
                maxLength={6}
                className="w-full bg-pong-dark-bg/80 text-pong-dark-primary placeholder:text-pong-dark-primary/50 px-4 py-3 rounded-xl border-2 border-pong-accent/30 focus:outline-none focus:border-pong-accent focus:ring-2 focus:ring-pong-accent transition-all placeholder:capitalize"
                placeholder="Enter 6-digit code"
                autoComplete="off"
              />

              <button
                type="submit"
                className={styles.darkSubmitBtn}
                id="submit-btn"
              >
                <i className="fa-solid fa-key mr-2"></i>
                Verify & Continue
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
