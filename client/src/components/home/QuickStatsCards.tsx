import { fontSizes } from "@/styles/fontSizes";
import { UserProfile } from "types/types";

function Card(props: {
  value: number | string;
  label: string;
  textColor: string;
  bgColor: string;
}) {
  return (
    <div
      className={`${props.bgColor} rounded-lg shadow-md px-4 py-2 flex flex-col items-center transform hover:scale-[1.02] transition-all duration-300`}
    >
      <span
        className={`${props.textColor} ${fontSizes.bodyFontSize} font-bold`}
      >
        {props.value}
      </span>
      <span
        className={`text-pong-dark-primary mt-1 font-medium ${fontSizes.smallTextFontSize}`}
      >
        {props.label}
      </span>
    </div>
  );
}

export function QuickStatsCards(props: { user: UserProfile }) {
  const { user } = props;

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 w-full max-w-5xl mx-auto">
      <Card
        value={user.matches_played}
        label="Matches"
        textColor="text-pong-dark-secondary"
        bgColor="bg-pong-dark-highlight/10"
      />
      <Card
        value={user.matches_won}
        label="Wins"
        textColor="text-pong-success"
        bgColor="bg-green-600/20"
      />
      <Card
        value={user.matches_lost}
        label="Losses"
        textColor="text-pong-error"
        bgColor="bg-red-600/20"
      />
    </div>
  );
}
