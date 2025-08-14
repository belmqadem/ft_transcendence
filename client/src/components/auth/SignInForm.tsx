import { InputField } from "../common/InputField";
import { SubmitBtn } from "../common/SubmitBtn";
import { RemoteLink } from "./RemoteLink";
import { styles } from "@/styles/styles";
import { fontSizes } from "@/styles/fontSizes";
import { handleSignIn } from "@/handlers/signin";
import { showPasswordToggle } from "@/utils/show-password-toggle";

export function SignInForm() {
  const showPasswordIconId = "signin-show-pass";
  const passwordId = "password";

  setTimeout(() => {
    showPasswordToggle(showPasswordIconId, passwordId);
    handleSignIn();
  }, 0);

  return (
    <form id="signin-form" className={styles.mainForm}>
      <InputField
        type="text"
        name="login"
        id="login"
        placeholder="member ID or email"
        autofocus={true}
      />
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

      <div className="flex justify-between items-center w-full text-sm text-pong-primary/70 mt-[-0.5rem]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="accent-pong-accent focus:ring-pong-primary"
          />
          keep me signed in
        </label>
        <a
          href="/password_reset"
          className="underline underline-offset-1 hover:text-pong-accent hover:underline-offset-2 transition-all duration-300"
          data-link
        >
          forgot credentials?
        </a>
      </div>

      <SubmitBtn btnIcon="fa-door-open" btnLabel="enter the lounge" />

      <p
        className={`${fontSizes.inputFontSize} w-full font-medium text-pong-primary/80`}
      >
        not a member yet?{" "}
        <a href="register" className={styles.customFormLink} data-link>
          apply for a paddle.
        </a>
      </p>

      <RemoteLink />

      <p className="text-xs text-center text-pong-primary/70 italic">
        by signing in, you return to the arena — ready to rally, rise, and
        respect the code of champions.
      </p>
    </form>
  );
}
