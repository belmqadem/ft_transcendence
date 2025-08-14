import { NavBar } from "@/components/layout/NavBar";
import { SecondaryHeader } from "@/components/common/SecondaryHeader";
import { styles } from "@/styles/styles";
import { fontSizes } from "@/styles/fontSizes";
import { BlockedList } from "@/components/settings/BlockedList";
import { hydrateBlocked } from "@/handlers/hydrate-blocked";

export function Blocked() {
  setTimeout(() => {
    hydrateBlocked();
  }, 0);
  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <SecondaryHeader
            title="Silenced Opponents"
            subtitle="Below are the players you've muted — peace and focus are yours on the court."
          />

          <div className={styles.cardOneStyle}>
            <h2
              className={`flex items-center gap-2 text-white ${fontSizes.smallTitleFontSize}`}
            >
              <span className="text-pong-accent">⛔</span>
              <span className="font-bold">Muted Members</span>
            </h2>
            <p
              className={`${fontSizes.smallTextFontSize} text-white/80 leading-relaxed`}
            >
              You've silenced these players — they won't disturb your flow in
              chat or matches.
            </p>

            <BlockedList />
          </div>
        </main>
      </div>
    </section>
  );
}
