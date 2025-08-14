import { styles } from "@/styles/styles";
import { setup2FA } from "@/services/setup-2fa";
import { setPrimaryMethod } from "@/services/set-primary-method";
import { enable2FA } from "@/services/enable-2fa";
import { disable2FA } from "@/services/disable-2fa";
import { check2FA } from "@/services/check-2fa";
import { fontSizes } from "@/styles/fontSizes";
import { TwoFAMethod } from "types/types";

export function update2FAUI(methods: TwoFAMethod[]) {
  ["app", "email"].forEach((type) => {
    const setupBtn = document.getElementById(`${type}-setup-btn`);
    const toggleEnableBtn = document.getElementById(`${type}-toggle-enable`);
    const setPrimaryBtn = document.getElementById(`${type}-set-primary`);
    const statusLabel = document.getElementById(`${type}-status-label`);
    const primaryLabel = document.getElementById(`${type}-primary-label`);
    const dotsMenuBtn = document.getElementById(`${type}-dots-menu-btn`);

    if (
      !setupBtn ||
      !toggleEnableBtn ||
      !setPrimaryBtn ||
      !statusLabel ||
      !primaryLabel ||
      !dotsMenuBtn
    )
      return;

    const method = methods.find((m) => m.type === type);
    if (!method) {
      // Method not set up : show only Setup
      setupBtn.classList.remove("hidden");
      toggleEnableBtn.classList.add("hidden");
      setPrimaryBtn.classList.add("hidden");
      statusLabel.classList.add("hidden");
      primaryLabel.classList.add("hidden");
      dotsMenuBtn.classList.add("hidden");
      return;
    }

    // Method exists: show dots menu
    setupBtn.classList.add("hidden");
    toggleEnableBtn.classList.remove("hidden");
    setPrimaryBtn.classList.remove("hidden");
    statusLabel.classList.remove("hidden");
    dotsMenuBtn.classList.remove("hidden");

    if (method.enabled) {
      statusLabel.textContent = "Enabled";
      statusLabel.className =
        "mb-2 ml-2 md:mb-0 px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700";
      toggleEnableBtn.textContent = "Disable";
      if (method.is_primary) {
        primaryLabel.classList.remove("hidden");
        primaryLabel.textContent = "Primary";
        primaryLabel.className =
          "mb-2 ml-2 md:mb-0 px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700";
      } else {
        primaryLabel.classList.add("hidden");
      }
    } else {
      statusLabel.textContent = "Disabled";
      statusLabel.className =
        "mb-2 ml-2 md:mb-0 px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700";
      toggleEnableBtn.textContent = "Enable";
      primaryLabel.classList.add("hidden");
    }
  });
}

function attach2FAListeners(type: "app" | "email") {
  const isApp = type === "app";
  const setupBtn = document.getElementById(
    `${type}-setup-btn`
  ) as HTMLButtonElement;
  const verifySection = document.getElementById(`${type}-verify-section`);
  const otpInput = document.getElementById(`${type}-otp`) as HTMLInputElement;
  const verifyBtn = document.getElementById(
    `${type}-verify-btn`
  ) as HTMLButtonElement;
  const setPrimaryBtn = document.getElementById(
    `${type}-set-primary`
  ) as HTMLButtonElement;
  const toggleEnableBtn = document.getElementById(
    `${type}-toggle-enable`
  ) as HTMLButtonElement;
  const qrImg = isApp
    ? (document.getElementById("app-qr") as HTMLImageElement)
    : null;

  if (setupBtn && !setupBtn.dataset.listener) {
    setupBtn.addEventListener("click", () => {
      setup2FA(type);
      verifySection?.classList.remove("hidden");
      setupBtn.classList.add("hidden");
      if (isApp && qrImg) qrImg.classList.remove("hidden");
      otpInput.focus();
    });
    setupBtn.dataset.listener = "true";
  }

  if (verifyBtn && !verifyBtn.dataset.listener) {
    verifyBtn.addEventListener("click", () => {
      if (!otpInput.value) return;
      otpInput.value,
        type,
        () => {
          verifySection?.classList.add("hidden");
          if (isApp && qrImg) qrImg.classList.add("hidden");
        };
    });
    verifyBtn.dataset.listener = "true";
  }

  if (setPrimaryBtn && !setPrimaryBtn.dataset.listener) {
    setPrimaryBtn.addEventListener("click", async () => {
      await setPrimaryMethod(type, () => {
        check2FA().then(update2FAUI);
      });
    });
    setPrimaryBtn.dataset.listener = "true";
  }

  if (toggleEnableBtn && !toggleEnableBtn.dataset.listener) {
    toggleEnableBtn.addEventListener("click", async () => {
      if (toggleEnableBtn.textContent === "Disable") {
        await disable2FA(type, () => check2FA().then(update2FAUI));
      } else {
        await enable2FA(type, () => check2FA().then(update2FAUI));
      }
    });
    toggleEnableBtn.dataset.listener = "true";
  }

  const dotsBtn = document.getElementById(`${type}-dots-menu-btn`);
  const dotsMenu = document.getElementById(`${type}-dots-menu`);

  if (dotsBtn && dotsMenu && !dotsBtn.dataset.listener) {
    dotsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dotsMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (!dotsMenu.contains(e.target as Node) && e.target !== dotsBtn) {
        dotsMenu.classList.add("hidden");
      }
    });
    dotsBtn.dataset.listener = "true";
  }
}

function TwoFaMode(type: "app" | "email") {
  const isApp = type === "app";

  setTimeout(() => attach2FAListeners(type), 0);

  return (
    <div className="relative">
      <div className="absolute top-4 right-3 z-20">
        <div className="relative">
          <button
            id={`${type}-dots-menu-btn`}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pong-accent/20 transition"
            tabIndex={0}
            aria-label="More actions"
            type="button"
          >
            <i className="fa-solid fa-ellipsis-vertical text-xl text-white"></i>
          </button>
          <div
            id={`${type}-dots-menu`}
            className="hidden absolute right-0 mt-2 w-44 bg-pong-dark-custom rounded-md shadow-lg z-10 py-2 border border-pong-accent/20"
          >
            <button
              id={`${type}-toggle-enable`}
              className="flex w-full items-center gap-2 px-4 py-2 text-pong-dark-primary hover:bg-pong-accent/10 transition rounded-t"
              type="button"
            >
              <i className="fa-solid fa-shield-halved text-pong-accent"></i>
              <span className="font-semibold">Enable/Disable</span>
            </button>
            <button
              id={`${type}-set-primary`}
              className="flex w-full items-center gap-2 px-4 py-2 text-pong-dark-primary hover:bg-pong-accent/10 transition rounded-b"
              type="button"
            >
              <i className="fa-solid fa-star text-yellow-500"></i>
              <span className="font-semibold">Set as Primary</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border border-pong-accent/30 rounded-md px-6 py-6 bg-gradient-to-br from-pong-dark-custom/40 to-pong-accent/5 shadow-lg">
        <div className="flex items-start gap-4 text-white w-full md:w-auto">
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 px-2 rounded-full bg-pong-accent/20 shadow-inner">
            <i
              className={`fa-solid ${
                isApp ? "fa-shield-halved" : "fa-envelope-circle-check"
              } ${
                isApp ? "text-pong-accent" : "text-pong-secondary"
              } text-lg md:text-xl`}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:gap-x-2">
              <span
                className={`font-bold ${fontSizes.bodyFontSize} tracking-wide`}
              >
                {isApp ? "Authenticator App" : "Email OTP"}
              </span>
              <div className="flex gap-2 mt-2 md:mt-0">
                <span
                  id={`${type}-status-label`}
                  className="px-2 py-1 text-xs font-bold rounded-full"
                ></span>
                <span
                  id={`${type}-primary-label`}
                  className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700"
                ></span>
              </div>
            </div>
            <span
              className={`block text-pong-secondary/80 ${fontSizes.smallTextFontSize} md:mt-3`}
            >
              {isApp
                ? "Use an authenticator app for maximum security."
                : "Receive one-time codes by email for easy access."}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center mt-4 md:mt-0">
          <button id={`${type}-setup-btn`} className={styles.darkPrimaryBtn}>
            <i className="fa-solid fa-plus mr-2"></i>
            Setup
          </button>
        </div>
      </div>

      <div
        id={`${type}-verify-section`}
        className="hidden w-full mt-4 flex flex-col items-center"
      >
        <div className={styles.darkForm}>
          <span
            className={`font-bold text-pong-accent ${fontSizes.bodyFontSize} mb-2 flex items-center gap-2`}
          >
            <i className="fa-solid fa-key"></i>
            Verify {isApp ? "Authenticator App" : "Email OTP"}
          </span>
          <span
            className={`text-pong-secondary/80 ${fontSizes.smallTextFontSize} mb-4 text-center`}
          >
            Enter the 6-digit code{" "}
            {isApp ? "from your app" : "sent to your email"} to complete setup.
          </span>
          {isApp ? (
            <img
              id="app-qr"
              alt="QR Code"
              className="hidden mx-auto mb-4 w-24 md:w-32 xl:w-40 h-24 md:h-32 xl:h-40 rounded-lg shadow"
            />
          ) : (
            <br className="hidden" />
          )}
          <input
            id={`${type}-otp`}
            type="text"
            maxLength={6}
            inputMode="numeric"
            className={
              styles.inputFieldDark +
              "tracking-widest placeholder:tracking-normal"
            }
            placeholder="Enter 6-digit code"
            autoComplete="off"
          />

          <button
            id={`${type}-verify-btn`}
            className={`${styles.darkSubmitBtn} w-full`}
          >
            <i className="fa-solid fa-check mr-2"></i>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}

export function TwoFa() {
  setTimeout(() => {
    check2FA().then((methods) => {
      update2FAUI(methods);
      attach2FAListeners("app");
      attach2FAListeners("email");
    });
  }, 0);

  return (
    <div className={styles.cardOneStyle}>
      <h2
        className={`flex items-center gap-2 text-white ${fontSizes.smallTitleFontSize}`}
      >
        <span className="text-pong-accent">🛡️</span>
        <span className="font-bold">Secure Your Club Access</span>
      </h2>
      <p
        className={`${fontSizes.smallTextFontSize} text-white/80 leading-relaxed`}
      >
        Add a second layer of protection to your profile with two-factor
        authentication.
      </p>

      <div className="flex flex-col gap-4">
        {TwoFaMode("app")}
        {TwoFaMode("email")}
      </div>

      <p className="text-pong-warning text-xs md:text-sm italic mt-2">
        2FA helps prevent unauthorized access, even if your password is
        compromised.
      </p>
    </div>
  );
}
