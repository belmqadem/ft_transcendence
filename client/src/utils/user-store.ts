import { UserProfile } from "types/types";
import { getAvatarUrl } from "./get-avatar-url";

let currentUser: UserProfile | null = null;

export function setCurrentUser(apiResponse: any) {
  if (apiResponse && apiResponse.data && apiResponse.data.profile) {
    currentUser = apiResponse.data.profile;
    if (currentUser) {
      currentUser.avatar_url = getAvatarUrl(currentUser);
    }
  }
}

export function getCurrentUser(): UserProfile | null {
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
}
