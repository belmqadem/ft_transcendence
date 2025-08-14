import { fontSizes } from "@/styles/fontSizes";
import { UserProfile } from "types/types";
import { loadMatchHistory } from "@/handlers/load-match-history";

export function MatchHistory(props: { user: UserProfile }) {
  setTimeout(() => {
    loadMatchHistory(props.user);
  }, 0);

  return (
    <div
      className="
        bg-pong-dark-custom
        border border-pong-dark-highlight/30 
        rounded-lg shadow-xl 
        p-6 md:p-10 
        w-full
        backdrop-blur-md
      "
    >
      <h2
        className={`
          flex items-center gap-3
          text-pong-dark-primary font-bold mb-6 tracking-tight 
          ${fontSizes.smallTitleFontSize}
        `}
      >
        <i className="fa-solid fa-scroll text-pong-dark-accent"></i>
        Chronicles of Play
      </h2>

      <ul
        id="match-history-list"
        className={`
          ${fontSizes.bodyFontSize} 
          max-h-[600px] overflow-y-auto pr-2 md:pr-4
		  custom-scrollbar
        `}
      ></ul>
    </div>
  );
}
