import { styles } from "@/styles/styles";
import { fontSizes } from "@/styles/fontSizes";

export function ChangePassword() {
  return (
    <div className={styles.cardOneStyle}>
      <h2
        className={`flex items-center gap-2 text-white ${fontSizes.smallTitleFontSize}`}
      >
        <span className="text-pong-accent">🔒</span>
        <span className="font-bold">Change Your Password</span>
      </h2>

      <p
        className={`${fontSizes.smallTextFontSize} text-white/80 leading-relaxed`}
      >
        Keep your club identity secure by updating your password regularly.
        Choose something strong and unique — a true champion’s defense.
      </p>

      <a
        href="/change_password"
        data-link
        className={styles.darkPrimaryBtn + "md:w-fit"}
      >
        Proceed to Update
      </a>

      <p className="text-pong-warning text-xs md:text-sm italic mt-3">
        Use a mix of letters, numbers, and symbols for maximum protection.
      </p>
    </div>
  );
}
