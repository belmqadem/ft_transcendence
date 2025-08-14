import { handleChangeEmail } from "@/handlers/change-email";
import { styles } from "@/styles/styles";
import { NavBar } from "@/components/layout/NavBar";
import { fontSizes } from "@/styles/fontSizes";

export function ChangeEmail() {
  setTimeout(() => {
    handleChangeEmail();
  }, 0);

  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <div className={styles.darkForm}>
            <h2
              className={`${fontSizes.smallTitleFontSize} font-bold text-pong-accent mb-4`}
            >
              Update Email
            </h2>
            <p
              className={`${fontSizes.smallTextFontSize} text-pong-secondary/80 text-center mb-6`}
            >
              Enter your new email address below. You’ll receive a confirmation
              email if required.
            </p>

            <form id="change-email-form" className="w-full flex flex-col gap-2">
              <input
                type="text"
                name="email"
                id="email"
                className={styles.inputFieldDark + " mb-0"}
                placeholder="Enter your new email"
                autoComplete="off"
                autoFocus
              />
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
                <i className="fa-solid fa-envelope-circle-check mr-2"></i>
                <span id="btn-label">Update Email</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
