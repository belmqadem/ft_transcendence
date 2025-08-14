import { getAvatarUrl } from "@/utils/get-avatar-url";
import { UserProfile } from "types/types";

export async function getUserById(id: number): Promise<UserProfile | null> {
  try {
    const response = await fetch(`/profile/user/${id}`, {
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();

    const user = data.data.profile;
    user.avatar_url = getAvatarUrl(user);
    return user;
  } catch {
    // console.error(`Error fetching user with ID ${id}:`);
    return null;
  }
}
