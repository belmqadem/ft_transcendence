import { fontSizes } from "@/styles/fontSizes";
import { styles } from "@/styles/styles";

export function NoPerformanceData(props: {
  spanText: string;
  isMember?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center text-pong-dark-secondary ${fontSizes.bodyFontSize} leading-relaxed bg-transparent p-6 rounded-xl shadow-lg border border-pong-dark-accent/30 backdrop-blur-sm`}
    >
      <i className="fa-solid fa-table-tennis-paddle-ball text-pong-accent text-4xl animate-bounce"></i>

      <span className="font-semibold text-pong-accent">
        No match history yet
      </span>

      <span className="text-pong-dark-secondary max-w-lg">
        {props.spanText}
      </span>

      <a
        href="/arena"
        data-link
        className={`${styles.darkPrimaryBtn} animate-myPulse ${
          props.isMember ? "hidden" : ""
        }`}
      >
        <i className="fa-solid fa-bolt"></i> Challenge a Member Now
      </a>
    </div>
  );
}
