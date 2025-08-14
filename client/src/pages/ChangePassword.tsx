import { handleChangePassword } from "@/handlers/change-password";
import { styles } from "@/styles/styles";
import { fontSizes } from "@/styles/fontSizes";
import { NavBar } from "@/components/layout/NavBar";
import { showPasswordToggle } from "@/utils/show-password-toggle";

export function ChangePassword() {
  const currentPasswordId = "old-password";
  const newPasswordId = "new-password";
  const confirmNewPasswordId = "confirm-new-password";
  const showPasswordIconId = "show-password-icon";
  const showNewPasswordIconId = "show-new-password-icon";
  const showConfirmPasswordIconId = "show-confirm-password-icon";

  setTimeout(() => {
    showPasswordToggle(showPasswordIconId, currentPasswordId);
    showPasswordToggle(showNewPasswordIconId, newPasswordId);
    showPasswordToggle(showConfirmPasswordIconId, confirmNewPasswordId);
    handleChangePassword();
  }, 0);

  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <div className={styles.darkForm}>
            <h2
              className={`${fontSizes.titleFontSize} text-center font-bold text-pong-accent mb-4`}
            >
              Update Your Password
            </h2>
            <p
              className={`${fontSizes.smallTextFontSize} text-pong-secondary/80 text-center mb-6`}
            >
              For your security, please enter your current password and choose a
              new one. Make sure your new password is strong and unique.
            </p>

            <form
              id="change-password-form"
              className="w-full flex flex-col gap-4"
            >
              <div className="relative w-ful">
                <input
                  type="password"
                  name="old-password"
                  id={currentPasswordId}
                  className={styles.inputFieldDark + " mb-0 h-full"}
                  placeholder="Current password"
                  autoComplete="off"
                  maxLength={30}
                  autofocus
                />
                <i className={styles.showPassIcon} id={showPasswordIconId}></i>
              </div>
              <div className="relative w-full">
                <input
                  type="password"
                  name="new-password"
                  id={newPasswordId}
                  className={styles.inputFieldDark + " mb-0 h-full"}
                  placeholder="New password"
                  autoComplete="off"
                  maxLength={30}
                />
                <i
                  className={styles.showPassIcon}
                  id={showNewPasswordIconId}
                ></i>
              </div>
              <div className="relative w-full">
                <input
                  type="password"
                  name="confirm-new-password"
                  id={confirmNewPasswordId}
                  className={styles.inputFieldDark + " mb-0 h-full"}
                  placeholder="Confirm new password"
                  autoComplete="off"
                  maxLength={30}
                />
                <i
                  className={styles.showPassIcon}
                  id={showConfirmPasswordIconId}
                ></i>
              </div>
              <button
                type="submit"
                className={styles.darkSubmitBtn}
                id="submit-btn"
                aria-busy="false"
              >
                <span
                  id="spinner"
                  className="hidden absolute left-4 w-4 h-4 border-2 border-white border-t-pong-accent rounded-full animate-spin"
                  aria-hidden="true"
                ></span>
                <i className="fa-solid fa-key mr-2" aria-hidden="true"></i>
                <span id="btn-label">Update Password</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
