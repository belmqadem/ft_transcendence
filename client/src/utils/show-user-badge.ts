import ClubChampion from "@/assets/club-champion.png";
import EliteContender from "@/assets/elite-contender.png";
import VeteranPlayer from "@/assets/veteran-player.png";
import Challenger from "@/assets/challenger.png";

export function showUserBadge(rank: number): string {
  if (rank <= 5) {
    return ClubChampion as string;
  } else if (rank <= 10) {
    return EliteContender as string;
  } else if (rank <= 20) {
    return VeteranPlayer as string;
  } else {
    return Challenger as string;
  }
}
