export async function getRoomId(userId: number): Promise<string | null> {
  try {
    const res = await fetch("/game/getRoomId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (!res.ok) return null;
    return data.roomData;
  } catch (error) {
    // console.error("Error fetching room ID:", error);
    return null;
  }
}
