import { NavBar } from "@/components/layout/NavBar";
import { styles } from "@/styles/styles";
import { deleteAccount } from "@/handlers/delete-account";
import { SecondaryHeader } from "@/components/common/SecondaryHeader";
import { fontSizes } from "@/styles/fontSizes";

export function DeleteAccount() {
  setTimeout(() => {
    deleteAccount();
  }, 0);

  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main
          className={`${styles.pageContent} flex flex-col items-center gap-10`}
        >
          <SecondaryHeader
            title="Farewell, Champion"
            subtitle="Every journey has an end—even in the club of legends. Your
              departure marks the end of a chapter."
          />

          <div className="flex flex-col gap-8 w-full max-w-5xl items-center px-8 md:px-10">
            <p
              className={`text-center text-pong-dark-secondary font-medium ${fontSizes.bodyFontSize} leading-relaxed max-w-xl`}
            >
              Share a final note with the club. Your words will remain in the
              memories of those who played alongside you.
            </p>

            <textarea
              name="farewell"
              id="farewell-message"
              placeholder="Write your farewell message here..."
              className={`
                w-full max-w-xl h-48 p-5 rounded-lg bg-pong-dark-highlight/10
                text-white placeholder-pong-dark-primary/40 shadow-md border border-white/10
                focus:outline-none focus:ring-2 focus:ring-pong-accent transition ${fontSizes.bodyFontSize}
              `}
              autoFocus
            ></textarea>

            <div className="bg-pong-error/10 border border-pong-error/30 rounded-lg p-6 w-full max-w-xl text-center space-y-4 shadow-md">
              <p className="text-pong-error font-bold flex items-center justify-center gap-2 text-lg">
                <i className="fa-solid fa-triangle-exclamation"></i>
                This action is permanent
              </p>
              <ul className="text-pong-dark-primary/80 text-base list-disc list-inside space-y-1">
                <li>Your profile will be deleted</li>
                <li>Match history and stats will be erased</li>
                <li>You will lose access to the BHV Club</li>
              </ul>
            </div>

            <button
              type="button"
              id="submit-btn"
              aria-busy="false"
              className={`
                relative w-full max-w-xl px-6 py-3 rounded-lg font-bold ${fontSizes.buttonFontSize}
                bg-gradient-to-r from-red-600 to-pong-error text-white shadow-lg
                hover:from-pong-error hover:to-red-600 transform hover:scale-105
                transition-all duration-300
              `}
            >
              <span
                id="spinner"
                className="hidden absolute left-4 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              ></span>
              <i className="fa-solid fa-door-open mr-2"></i>
              <span id="btn-label">Leave the Club Forever</span>
            </button>
          </div>
        </main>
      </div>
    </section>
  );
}
