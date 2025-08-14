export async function getFriends(): Promise<number[]> {
  try {
    const res = await fetch("/friends/", {
      credentials: "include",
    });

    if (!res.ok) return [];

    const data = await res.json();
    const friendIds = data.data.friends.map(
      (f: { friend_id: number }) => f.friend_id
    );
    return friendIds;
  } catch {
    return [];
  }
}
