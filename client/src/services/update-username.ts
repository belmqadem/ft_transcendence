export function updateUsername(
  userId: number,
  username: string
): Promise<Response> {
  return fetch(`/profile/user/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
}
