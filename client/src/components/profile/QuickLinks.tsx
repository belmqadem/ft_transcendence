import { fontSizes } from "@/styles/fontSizes";

export function QuickLinks() {
  return (
    <div className="w-full max-w-2xl">
      <ul className="flex flex-col gap-3">
        <li>
          <a
            href="/chamber"
            data-link
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg ${fontSizes.buttonFontSize}
              bg-pong-dark-primary/30 hover:bg-pong-accent/20
              text-white font-medium transition-all duration-200
            `}
          >
            <i className="fa-solid fa-gauge text-pong-accent"></i>
            <span>Club Dashboard</span>
          </a>
        </li>
        <li>
          <a
            href="/arena"
            data-link
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg ${fontSizes.buttonFontSize}
              bg-pong-dark-primary/30 hover:bg-pong-accent/20
              text-white font-medium transition-all duration-200
            `}
          >
            <i className="fa-solid fa-gamepad text-pong-accent"></i>
            <span>Enter The Arena</span>
          </a>
        </li>
        <li>
          <a
            href="/lounge"
            data-link
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg ${fontSizes.buttonFontSize}
              bg-pong-dark-primary/30 hover:bg-pong-accent/20
              text-white font-medium transition-all duration-200
            `}
          >
            <i className="fa-solid fa-comments text-pong-accent"></i>
            <span>Club Lounge</span>
          </a>
        </li>
        <li>
          <a
            href="/security"
            data-link
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg ${fontSizes.buttonFontSize}
              bg-pong-dark-primary/30 hover:bg-pong-accent/20
              text-white font-medium transition-all duration-200
            `}
          >
            <i className="fa-solid fa-user-gear text-pong-accent"></i>
            <span>Account Security</span>
          </a>
        </li>
        <li>
          <a
            href="/muted_players"
            data-link
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg ${fontSizes.buttonFontSize}
              bg-pong-dark-primary/30 hover:bg-pong-accent/20
              text-white font-medium transition-all duration-200
            `}
          >
            <i className="fa-solid fa-ban text-pong-accent"></i>
            <span>Muted Players</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
