import { handleLostPassword } from "@/handlers/lost-password";
import { verifyOtpCode } from "@/handlers/verify-otp-code";
import { Footer } from "@/components/layout/Footer";
import { InputField } from "@/components/common/InputField";
import { styles } from "@/styles/styles";
import { Overlay } from "@/components/layout/Overlay";
import { OtpInput } from "@/components/common/OtpInput";
import { fontSizes } from "@/styles/fontSizes";
import { SubmitBtn } from "@/components/common/SubmitBtn";

export function LostPassword() {
  setTimeout(() => {
    handleLostPassword();
    verifyOtpCode();
  }, 0);

  return (
    <section className={styles.pageLayoutLight}>
      <Overlay />
      <div className={`${styles.customSectionStyles} animate-fadeInUp`}>
        <h1 className={styles.titleDark}>lost your paddle?</h1>
        <p className={`${styles.subtitleParagraphDark} my-4`}>
          no worries, champion — enter your email and we’ll rally a code your
          way to reset it.
        </p>

        <div className="flex justify-center mb-4">
          <i className="fa-solid fa-table-tennis-paddle-ball text-pong-accent text-xl md:text-2xl animate-bounce" />
        </div>

        <form id="lost-password-form" className={styles.secForm}>
          <InputField
            type="text"
            name="email"
            id="reset-pass-email"
            placeholder="your registered email"
            autofocus={true}
          />
          <SubmitBtn btnIcon="fa-envelope" btnLabel="send me the code" />
        </form>

        <form id="lost-pass-otp-form" className={`${styles.secForm} hidden`}>
          <label
            htmlFor="otp"
            className={`${fontSizes.bodyFontSize} text-pong-primary font-semibold`}
          >
            paste the code we just served you
          </label>
          <OtpInput id="lost-pass-otp" />
          <SubmitBtn btnIcon="fa-check-double" btnLabel="verify code" />
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
        <p className="text-xs md:text-sm text-pong-primary/70 mt-4">
          didn't receive the serve? check your spam or promotions lounge.
        </p>
      </div>
      <Footer />
    </section>
  );
}
