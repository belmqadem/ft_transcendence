import { styles } from "@/styles/styles";

export function SubmitBtn(props: { btnIcon: string; btnLabel: string }) {
  const { btnIcon, btnLabel } = props;
  return (
    <button
      type="submit"
      id="submit-btn"
      className={styles.lightPrimaryBtn}
      aria-busy="false"
    >
      <span
        id="spinner"
        className="hidden absolute left-4 w-4 h-4 border-2 border-white border-t-pong-accent rounded-full animate-spin"
        aria-hidden="true"
      ></span>
      <i
        className={`fa-solid ${btnIcon} ${styles.lightPrimaryBtnIcon}`}
        aria-hidden="true"
      ></i>
      <span id="btn-label">{btnLabel}</span>
    </button>
  );
}
