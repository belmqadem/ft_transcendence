import { InputField } from "../common/InputField";
import { RemoteLink } from "./RemoteLink";
import { styles } from "@/styles/styles";
import { fontSizes } from "@/styles/fontSizes";
import { SubmitBtn } from "../common/SubmitBtn";
import { handleSignUp } from "@/handlers/signup";
import { showPasswordToggle } from "@/utils/show-password-toggle";

export function SignUpForm() {
  const passwordId = "password";
  const showPasswordIconId = "signup-show-pass";
  const confirmPasswordId = "confirm-password";
  const showConfirmPasswordIconId = "signup-show-confirm-pass";

  setTimeout(() => {
    showPasswordToggle(showPasswordIconId, passwordId);
    showPasswordToggle(showConfirmPasswordIconId, confirmPasswordId);
    handleSignUp();

    const titleInput = document.getElementById("title") as HTMLInputElement;
    const genderSelect = document.getElementById(
      "gender-options"
    ) as HTMLDivElement | null;
    const male = document.getElementById("gender-male") as HTMLParagraphElement;
    const female = document.getElementById(
      "gender-female"
    ) as HTMLParagraphElement;
    const options = [male, female];

    let focusedIndex = -1;
    let selectedIndex = -1;

    function updateSelectedOption(index: number) {
      options.forEach((opt, idx) => {
        if (idx === index) {
          opt.setAttribute("aria-selected", "true");
          opt.classList.add("bg-pong-accent/40", "font-bold");
        } else {
          opt.setAttribute("aria-selected", "false");
          opt.classList.remove("bg-pong-accent/40", "font-bold");
        }
      });
      selectedIndex = index;
    }

    function openOptions() {
      genderSelect?.classList.remove("hidden");
      titleInput.setAttribute("aria-expanded", "true");
      focusedIndex = selectedIndex >= 0 ? selectedIndex : 0;
      options[focusedIndex].focus();
      updateSelectedOption(focusedIndex);
    }

    function closeOptions() {
      genderSelect?.classList.add("hidden");
      titleInput.setAttribute("aria-expanded", "false");
      focusedIndex = -1;
    }

    titleInput.addEventListener("click", (e) => {
      e.stopPropagation();
      if (genderSelect?.classList.contains("hidden")) {
        openOptions();
      } else {
        closeOptions();
      }
    });

    titleInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openOptions();
      }
    });

    options.forEach((opt, idx) => {
      opt.addEventListener("click", () => {
        titleInput.value = opt.textContent || "";
        updateSelectedOption(idx);
        closeOptions();
        titleInput.focus();
      });
      opt.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          focusedIndex = (idx + 1) % options.length;
          options[focusedIndex].focus();
          updateSelectedOption(focusedIndex);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          focusedIndex = (idx - 1 + options.length) % options.length;
          options[focusedIndex].focus();
          updateSelectedOption(focusedIndex);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          titleInput.value = opt.textContent || "";
          updateSelectedOption(idx);
          closeOptions();
          titleInput.focus();
        } else if (e.key === "Escape") {
          closeOptions();
          titleInput.focus();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (
        !genderSelect?.contains(e.target as Node) &&
        e.target !== titleInput
      ) {
        closeOptions();
      }
    });

    if (titleInput.value) {
      const idx = options.findIndex(
        (opt) => opt.textContent === titleInput.value
      );
      if (idx >= 0) updateSelectedOption(idx);
    }
  }, 0);

  return (
    <form id="signup-form" className={styles.mainForm}>
      <InputField
        type="text"
        name="username"
        id="username"
        placeholder="choose your noble name"
        autofocus={true}
      />
      <InputField
        type="text"
        name="email"
        id="email"
        placeholder="your correspondence address"
      />

      <div className="relative w-full">
        <input
          type="text"
          name="title"
          id="title"
          placeholder="select your title of elegance"
          autoComplete="off"
          className={`${styles.InputFieldOne} cursor-pointer`}
          readOnly
          tabIndex={0}
        />
        <div
          id="gender-options"
          role="listbox"
          tabIndex={-1}
          className={`hidden ${fontSizes.inputFontSize} text-left absolute z-50 top-14 left-0 w-full bg-pong-secondary rounded-xl shadow-inner border border-pong-primary/10 flex flex-col text-pong-primary overflow-hidden transition-all duration-200 ease-in-out`}
        >
          <p
            id="gender-male"
            role="option"
            aria-selected="false"
            className="outline-none px-5 py-3.5 hover:bg-pong-accent/20 focus:bg-pong-accent/30 cursor-pointer transition-colors duration-150 ease-in-out"
            tabIndex={0}
          >
            Gentleman
          </p>
          <p
            id="gender-female"
            role="option"
            aria-selected="false"
            className="outline-none px-5 py-3.5 hover:bg-pong-accent/20 focus:bg-pong-accent/30 cursor-pointer transition-colors duration-150 ease-in-out"
            tabIndex={0}
          >
            Lady
          </p>
        </div>
        <div className="pointer-events-none absolute top-1/2 right-3 px-2 transform -translate-y-1/2 text-pong-primary/80">
          <i className="fa-solid fa-chevron-down text-sm"></i>
        </div>
      </div>

      <div className="relative w-full">
        <input
          type="password"
          name="password"
          id={passwordId}
          placeholder="secret code"
          autoComplete="off"
          className={styles.InputFieldOne}
          maxLength={30}
        />
        <i className={styles.showPassIcon} id={showPasswordIconId}></i>
      </div>
      <div className="relative w-full">
        <input
          type="password"
          name="password"
          id={confirmPasswordId}
          placeholder="secret code"
          autoComplete="off"
          className={styles.InputFieldOne}
          maxLength={30}
        />
        <i className={styles.showPassIcon} id={showConfirmPasswordIconId}></i>
      </div>

      <SubmitBtn
        btnIcon="fa-champagne-glasses"
        btnLabel="register your racket"
      />

      <p
        className={`${fontSizes.inputFontSize} w-full font-medium text-pong-primary/80`}
      >
        already a member of the hall?{" "}
        <a href="login" className={styles.customFormLink} data-link>
          enter the lounge.
        </a>
      </p>

      <RemoteLink />

      <p className="text-xs text-center text-pong-primary/70 italic">
        by joining, you swear on honor to compete fairly and uphold the spirit
        of ping pong.
      </p>
    </form>
  );
}
