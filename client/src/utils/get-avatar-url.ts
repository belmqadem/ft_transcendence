import { UserProfile } from "types/types";
import MaleAvatar from "@/assets/male-avatar.png";
import FemaleAvatar from "@/assets/female-avatar.png";

export function getAvatarUrl(user: UserProfile): string {
  if (!user.avatar_url || user.avatar_url === "") {
    return user.gender === "M" ? MaleAvatar : FemaleAvatar;
  }
  if (user.avatar_url.startsWith("http") || user.avatar_url.startsWith("/")) {
    return user.avatar_url;
  }
  return `/profile/avatar/${user.avatar_url}`;
}
