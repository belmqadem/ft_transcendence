export async function getAllUsers() {
  try {
    const res = await fetch("/profile/all", {
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      // console.error("Failed to fetch users");
      return [];
    }

    return data.data.profiles;
  } catch {
    // console.error("Error fetching all users");
    return [];
  }
}
