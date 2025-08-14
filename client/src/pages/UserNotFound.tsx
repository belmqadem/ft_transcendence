import { NavBar } from "@/components/layout/NavBar";
import { styles } from "@/styles/styles";

export function UserNotFound() {
  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <div className="flex flex-col items-center justify-center text-center text-white py-16 px-6 space-y-4">
            <i className="fa-solid fa-user-xmark text-5xl text-pong-error"></i>
            <h2 className="text-2xl md:text-3xl font-bold text-pong-error">
              Member Not Found
            </h2>
            <p className="text-sm md:text-base text-pong-dark-primary max-w-md">
              Alas! The player you seek does not dwell in this hall. Perhaps
              they’ve chosen anonymity, or vanished into the shadows of unranked
              history.
            </p>
            <a href="/salon" data-link className={`${styles.darkPrimaryBtn}`}>
              <i className="fa-solid fa-arrow-left"></i> Return to Salon
            </a>
          </div>
        </main>
      </div>
    </section>
  );
}
