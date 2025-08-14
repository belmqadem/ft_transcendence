import { fontSizes } from "@/styles/fontSizes";

export function AllMembersList() {
  return (
    <ul
      id="all-members-list"
      className={`space-y-6 ${fontSizes.bodyFontSize} max-h-[500px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar py-1`}
    >
      <li className="text-pong-dark-secondary text-center">Loading...</li>
    </ul>
  );
}
