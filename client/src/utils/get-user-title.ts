export function getUserTitle(rank: number): string {
  if (rank <= 5) {
    return "Club Champion";
  } else if (rank <= 10) {
    return "Elite Contender";
  } else if (rank <= 20) {
    return "Veteran Player";
  } else {
    return "Challenger";
  }
}
