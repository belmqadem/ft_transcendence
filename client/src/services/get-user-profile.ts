import { authFetch } from "@/services/auth-fetch";
import { setCurrentUser } from "@/utils/user-store";

export async function getUserProfile() {
  try {
    const res = await authFetch("/auth/me");
    if (!res.ok) return null;

    const result = await res.json();
    const id = result.data?.id;
    if (!id) return null;

    const profileRes = await authFetch(`/profile/user/${id}`);
    if (!profileRes.ok) return null;

    const profile = await profileRes.json();

    return profile;
  } catch {
    // console.error("Error fetching user profile");
    return null;
  }
}
