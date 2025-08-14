import { fontSizes } from "@/styles/fontSizes";
import { UserProfile } from "types/types";
import { styles } from "@/styles/styles";
import { hydrateTopThree } from "@/handlers/hydrate-top-three";

function getTagline(rank: number): string | undefined {
  if (rank === 1) {
    return "The Champion of Champions!";
  } else if (rank <= 10) {
    return "You're close to greatness — keep pushing!";
  } else {
    return "Your journey has just begun...";
  }
}

export function LeaderboardPreview(props: { user: UserProfile }) {
  setTimeout(() => {
    hydrateTopThree(user);
  }, 0);

  const { user } = props;

  return (
    <div className="bg-pong-secondary/10 rounded-lg shadow-md p-6 md:p-10 w-full max-w-5xl mx-auto border border-pong-dark-secondary/10">
      <h2
        className={`
          flex items-center gap-3
          text-pong-dark-primary font-bold mb-6 tracking-tight 
          ${fontSizes.smallTitleFontSize}
        `}
      >
        <i className="fa-solid fa-trophy text-pong-dark-accent"></i>
        <span>BHV Club’s Elite</span>
      </h2>

      <ol
        id="top-three-list"
        className={`space-y-3 ${fontSizes.bodyFontSize}`}
      ></ol>

      <div className="flex items-center justify-between mt-8 gap-4">
        <div className="bg-pong-dark-bg/50 rounded-xl px-4 py-3 border border-white/10 text-white/70">
          <span className="block text-xs md:text-sm">
            {getTagline(user.rank)}
          </span>
        </div>

        <a href="/chamber" className={styles.darkPrimaryBtn} data-link>
          View Full Rankings
        </a>
      </div>
    </div>
  );
}
