import { handleResetPassword } from "@/handlers/reset-password";
import { Footer } from "@/components/layout/Footer";
import { styles } from "@/styles/styles";
import { Overlay } from "@/components/layout/Overlay";
import { SubmitBtn } from "@/components/common/SubmitBtn";
import { fontSizes } from "@/styles/fontSizes";
import { showPasswordToggle } from "@/utils/show-password-toggle";

export function ResetPassword() {
  const passwordId = "new-password";
  const showPasswordIconId = "update-show-pass";
  const confirmPasswordId = "confirm-new-password";
  const showConfirmPasswordIconId = "update-show-confirm-pass";

  setTimeout(() => {
    showPasswordToggle(showPasswordIconId, passwordId);
    showPasswordToggle(showConfirmPasswordIconId, confirmPasswordId);
    handleResetPassword();
  }, 0);

  return (
    <section className={styles.pageLayoutLight}>
      <Overlay />
      <div className={`${styles.customSectionStyles} animate-fadeInUp`}>
        <h1 className={styles.titleDark}>one final serve, champion.</h1>
        <p className={`${styles.subtitleParagraphDark} my-4`}>
          set your new password to secure your spot in the club.
        </p>

        <div className="flex justify-center mb-4">
          <i className="fa-solid fa-table-tennis-paddle-ball text-pong-accent text-xl md:text-2xl animate-bounce" />
        </div>

        <form id="update-password-form" className={styles.secForm}>
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
            <i
              className={styles.showPassIcon}
              id={showConfirmPasswordIconId}
            ></i>
          </div>
          <SubmitBtn btnIcon="fa-lock" btnLabel="lock it in" />
        </form>

        <p
          className={`${fontSizes.buttonFontSize} w-full my-4 font-medium text-pong-primary/80`}
        >
          remembered your paddle?{" "}
          <a href="/login" className={styles.customFormLink} data-link>
            return to the club entrance
          </a>
        </p>

        <p className="w-full border-t border-pong-accent/10 my-6"></p>
        <p className="text-xs md:text-sm text-pong-primary/70">
          this is how champions protect their legacy.{" "}
        </p>
      </div>
      <Footer />
    </section>
  );
}
