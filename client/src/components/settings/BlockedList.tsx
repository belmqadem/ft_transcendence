import { fontSizes } from "@/styles/fontSizes";

export function BlockedList() {
  return (
    <ul
      id="muted-list"
      className={`space-y-6 ${fontSizes.bodyFontSize} max-h-[500px] overflow-y-auto pr-3 md:pr-6 custom-scrollbar py-2`}
    >
      <li className="text-pong-dark-secondary text-center">Loading...</li>
    </ul>
  );
}
