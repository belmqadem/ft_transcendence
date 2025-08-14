import { styles } from "@/styles/styles";

import ClubChampion from "@/assets/club-champion.png";
import EliteContender from "@/assets/elite-contender.png";
import VeteranPlayer from "@/assets/veteran-player.png";
import Challenger from "@/assets/challenger.png";

export function RankBadge(props: { rank: number }) {
  if (props.rank <= 5) {
    return (
      <span className={`${styles.badgeStyle} relative group`}>
        <i className="fa-solid fa-crown text-yellow-400"></i> Club Champion
        <div className={styles.badgeHoverCard}>
          <img
            src={ClubChampion}
            alt="Club Champion"
            className={styles.badgeHoverCardImage}
          />
        </div>
      </span>
    );
  } else if (props.rank <= 10) {
    return (
      <span
        className={`${styles.badgeStyle} transition-opacity duration-500 ease-out hover:opacity-80`}
      >
        <i className="fa-solid fa-trophy text-orange-400"></i> Elite Contender
        <div className={styles.badgeHoverCard}>
          <img
            src={EliteContender}
            alt="Elite Contender"
            className={styles.badgeHoverCardImage}
          />
        </div>
      </span>
    );
  } else if (props.rank <= 20) {
    return (
      <span
        className={`${styles.badgeStyle} transition-opacity duration-500 ease-out hover:opacity-80`}
      >
        <i className="fa-solid fa-medal text-purple-400"></i> Veteran Player
        <div className={styles.badgeHoverCard}>
          <img
            src={VeteranPlayer}
            alt="Veteran Player"
            className={styles.badgeHoverCardImage}
          />
        </div>
      </span>
    );
  } else {
    return (
      <span
        className={`${styles.badgeStyle} transition-opacity duration-500 ease-out hover:opacity-80`}
      >
        <i className="fa-solid fa-user-shield text-pong-secondary"></i>{" "}
        Challenger
        <div className={styles.badgeHoverCard}>
          <img
            src={Challenger}
            alt="Challenger"
            className={styles.badgeHoverCardImage}
          />
        </div>
      </span>
    );
  }
}
