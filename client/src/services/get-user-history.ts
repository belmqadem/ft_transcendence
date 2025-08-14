import { UserHistory } from "types/types";

export async function getUserHistory(userId: number): Promise<UserHistory[]> {
  try {
    const response = await fetch("/game/user-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      // console.error("Error fetching user history:", data);
      return [];
    }
    return data;
  } catch (error) {
    // console.error("Error fetching user history:", error);
    return [];
  }
}
