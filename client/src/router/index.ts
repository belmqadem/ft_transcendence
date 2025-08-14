import { Welcome } from "@/pages/Welcome";
import { Signin } from "@/pages/Signin";
import { Signup } from "@/pages/Signup";
import { LostPassword } from "@/pages/LostPassword";
import { ResetPassword } from "@/pages/ResetPassword";
import { VerifyLogin } from "@/pages/VerifyLogin";
import { Home } from "@/pages/Home";
import { Game } from "@/pages/Game";
import { Dashboard } from "@/pages/Dashboard";
import { Members } from "@/pages/Members";
import { Chat } from "@/pages/Chat";
import { Lounge } from "@/pages/Lounge";
import { Profile } from "@/pages/Profile";
import { MemberProfile } from "@/pages/MemberProfile";
import { Security } from "@/pages/Security";
import { Blocked } from "@/pages/Blocked";
import { DeleteAccount } from "@/pages/DeleteAccount";
import { Logout } from "@/pages/Logout";
import { ChangePassword } from "@/pages/ChangePassword";
import { ChangeEmail } from "@/pages/ChangeEmail";
import { VerifyChangeCredentials } from "@/pages/VerifyChangeCredentials";
import { LocalGame } from "@/components/game/LocalGame";
import { closeRemoteWebSocket, RemoteGame } from "@/components/game/RemoteGame";
import { Tournaments } from "@/components/game/Tournaments";
import { getUserProfile } from "@/services/get-user-profile";
import { startNotificationListener } from "@/services/notifications-service";
import { stopDashboardListener } from "@/services/dashboard-service";
import { startStatusListener } from "@/services/status-service";
import { getCurrentUser, setCurrentUser } from "@/utils/user-store";
import { navigateTo } from "@/utils/navigate-to-link";
import { TopBar } from "@/components/layout/TopBar";
import { UserNotFound } from "@/pages/UserNotFound";

const routes: Record<string, (id?: number) => HTMLElement> = {
  welcome: Welcome,
  login: Signin,
  register: Signup,
  password_reset: LostPassword,
  password_update: ResetPassword,
  verify_login: VerifyLogin,
  salon: Home,
  arena: Game,
  chamber: Dashboard,
  lounge: Lounge,
  members: Members,
  duel: LocalGame,
  remote: RemoteGame,
  tournament: Tournaments,
  my_profile: Profile,
  security: Security,
  change_password: ChangePassword,
  change_email: ChangeEmail,
  verification: VerifyChangeCredentials,
  muted_players: Blocked,
  wipe_account: DeleteAccount,
  checkout: Logout,
};

// Public pages that don't require authentication
const publicRoutes: string[] = [
  "welcome",
  "login",
  "register",
  "password_reset",
  "password_update",
  "verify_login",
];

// Check if a user is authenticated
async function isAuthenticated(): Promise<boolean> {
  const profile = await getUserProfile();
  if (profile) {
    setCurrentUser(profile);
    return true;
  }
  return false;
}

// Router function to handle navigation and rendering
export async function router(): Promise<void> {
  const appContent = document.getElementById("app-content") as HTMLDivElement;
  const topBarContainer = document.getElementById("top-bar") as HTMLDivElement;
  if (!appContent || !topBarContainer) return;

  let path = location.pathname.slice(1);
  let routeParams: {
    chatRoom?: number;
    memberId?: number;
    remoteRoomId?: string;
  } = {};

  // Parse dynamic routes
  const chatMatch = path.match(/^lounge\/(\d+)$/);
  if (chatMatch) {
    routeParams.chatRoom = Number(chatMatch[1]);
    path = "lounge";
  }

  const profileMatch = path.match(/^members\/(\d+)$/);
  if (profileMatch) {
    routeParams.memberId = Number(profileMatch[1]);
    path = "members";
  }

  // Handle remote game with room ID
  const remoteMatch = path.match(/^remote(?:\/(.+))?$/);
  if (remoteMatch) {
    routeParams.remoteRoomId = remoteMatch[1];
    path = "remote";
  }

  const isPublic = publicRoutes.includes(path);
  const isCheckoutRoute = path === "checkout";
  const render = routes[path];

  let authed = false;
  if (!isPublic) {
    authed = await isAuthenticated();
    if (authed) {
      startNotificationListener();
      setTimeout(startStatusListener, 1000);
    } else {
      if (location.pathname !== "/welcome") {
        history.replaceState(null, "", "/welcome");
        await router();
        return;
      }
    }
  } else {
    const profile = await getUserProfile();
    if (profile && location.pathname !== "/checkout") {
      history.replaceState(null, "", "/salon");
      await router();
      return;
    }
  }

  // Handle unknown routes
  if (!render) {
    const fallbackRoute = isPublic ? "/welcome" : "/salon";
    if (location.pathname !== fallbackRoute) {
      history.replaceState(null, "", fallbackRoute);
      await router();
      return;
    }
    // console.error(`Route not found: ${path}`);
    return;
  }

  // Handle TopBar visibility
  if (!isPublic && !isCheckoutRoute) {
    if (!topBarContainer.hasChildNodes()) {
      topBarContainer.appendChild(TopBar());
    }
  } else {
    topBarContainer.innerHTML = "";
  }

  // Clear existing app content
  while (appContent.firstChild) {
    appContent.removeChild(appContent.firstChild);
  }

  // Render the appropriate component based on route and parameters
  try {
    let componentToRender: HTMLElement;

    if (path === "lounge" && routeParams.chatRoom) {
      componentToRender = await Chat(routeParams.chatRoom);
    } else if (path === "members" && routeParams.memberId) {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === routeParams.memberId) {
        navigateTo("/my_profile");
        return;
      }
      const memberProfileElem = await MemberProfile(routeParams.memberId);
      componentToRender = memberProfileElem || UserNotFound();
    } else if (path === "remote" && routeParams.remoteRoomId) {
      componentToRender = render(undefined);
    } else {
      componentToRender = render();
    }

    appContent.appendChild(componentToRender);
  } catch (error) {
    // console.error("Error rendering component:", error);
    appContent.appendChild(document.createTextNode("Error loading page"));
  }

  if (path !== "chamber") {
    stopDashboardListener();
  }

  if (path !== "remote") {
    closeRemoteWebSocket();
  }
}
