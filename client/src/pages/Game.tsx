import { NavBar } from "@/components/layout/NavBar";
import { styles } from "@/styles/styles";
import { fontSizes } from "@/styles/fontSizes";
import { SecondaryHeader } from "@/components/common/SecondaryHeader";
import { navigateTo } from "@/utils/navigate-to-link";
import { showInviteModal } from "@/utils/show-invite-modal";
import { getCurrentUser } from "@/utils/user-store";
import { Loader } from "@/components/common/Loader";

export function Game() {
  const me = getCurrentUser();
  if (!me) {
    return <Loader text="Loading your game options..." />;
  }

  const gameModes = [
    {
      title: "1 vs 1 — Lounge Duel",
      text: "Challenge a friend beside you in an elegant local match. Pure skill, no lag — just legacy.",
      href: "/duel",
    },
    {
      title: "Tournament — Club Cup",
      text: "Gather champions in-house. Compete in a local bracket to earn eternal bragging rights in the lounge.",
      href: "/tournament",
    },
    {
      title: "1 vs 1 — Remote Arena",
      text: "Face a rival across the network. Ping-pong from across the globe, prestige from your own paddle.",
      href: "/remote",
    },
  ];

  setTimeout(() => {
    const playBtn = document.querySelectorAll(".game-mode-btn");
    playBtn.forEach((btn, index) => {
      if (index === 2) {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          showInviteModal(me);
        });
      } else {
        btn.addEventListener("click", () => {
          navigateTo(gameModes[index].href);
        });
      }
    });
  }, 0);

  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <SecondaryHeader
            title="Choose Your Game Mode"
            subtitle="Pick your playstyle and step into the arena of champions."
          />

          <div className="game-modes hidden lg:grid w-full max-w-7xl mx-auto grid-cols-3 rounded-lg overflow-hidden min-h-[570px] border border-collapse border-pong-dark-accent/20">
            {gameModes.map((mode, index) => (
              <div
                key={index}
                className="
        			relative flex flex-col items-center justify-center text-center px-8 py-16
        			bg-gradient-to-br from-black/70 via-pong-dark-custom/30 to-pong-accent/5
        			border-x border-pong-dark-highlight/20
        			hover:scale-[1.04] hover:-translate-y-1
					first:hover:translate-x-1 last:hover:-translate-x-1
        			transition-transform duration-500 ease-in-out cursor-pointer
        			first:border-l-0 last:border-r-0
      			"
              >
                <div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-500 bg-pong-accent blur-2xl"></div>

                <div
                  className="
        			relative flex flex-col items-center justify-between gap-6 px-8 py-8
        			rounded-3xl shadow-xl
        			bg-gradient-to-br from-black/70 via-pong-dark-custom/40 to-pong-accent/10
        			backdrop-blur-md
					border border-collapse border-pong-dark-accent/20
        			w-full h-full
        			transition-all duration-500 ease-in-out
      			"
                >
                  <h2
                    className={`${fontSizes.smallTitleFontSize} font-bold text-white drop-shadow-lg tracking-tight`}
                  >
                    {mode.title}
                  </h2>

                  <p
                    className={`${fontSizes.bodyFontSize} text-white/80 leading-relaxed mt-2 mb-4`}
                  >
                    {mode.text}
                  </p>

                  <button
                    className="
				  		game-mode-btn
            	  		group relative flex items-center justify-center
            	  		w-16 h-16 sm:w-20 sm:h-20 rounded-full
            	  		bg-pong-accent hover:bg-pong-dark-accent
            	  		shadow-lg shadow-pong-accent/40
            	  		transition-all duration-300 ease-in-out
            	  		active:scale-95 focus:outline-none
          			"
                    aria-label="Start Game"
                  >
                    <i
                      className={`${fontSizes.bodyFontSize} fa-solid fa-play text-white ml-[1px] group-hover:scale-110 transition-transform duration-300`}
                    />
                    <span
                      className="
           		  		absolute -bottom-10 text-xs text-white/80
           		  		bg-black/70 px-2 py-1 rounded
           		  		opacity-0 group-hover:opacity-100
           		  		transition-all duration-300 ease-in-out
           		  		pointer-events-none
           			  "
                    >
                      Play Now
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:hidden w-full flex flex-col items-center justify-center min-h-[40vh]">
            <div className="bg-pong-dark-custom/80 border border-pong-accent/30 rounded-2xl shadow-lg px-6 py-10 max-w-sm mx-auto text-center">
              <i className="fa-solid fa-mobile-screen text-3xl text-pong-accent mb-4"></i>
              <h2
                className={`${fontSizes.smallTitleFontSize} font-bold text-white mb-2`}
              >
                Not Available on Mobile
              </h2>
              <p
                className={`text-pong-dark-secondary ${fontSizes.bodyFontSize}`}
              >
                Game modes are only available on desktop or tablet devices.
                <br />
                Please use a larger screen to play.
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
