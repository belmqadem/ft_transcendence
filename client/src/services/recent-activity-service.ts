import { getWelcomeTitle } from "@/components/home/Hero";
import { fontSizes } from "@/styles/fontSizes";
import { styles } from "@/styles/styles";
import { getUserTitle } from "@/utils/get-user-title";
import { GameActivity, UserProfile } from "types/types";
import { getUserById } from "./get-user-by-id";

let ws: WebSocket | null = null;

function createUserHoverCard(user: UserProfile): HTMLDivElement {
  const card = document.createElement("div");
  card.className =
    "absolute z-50 bg-pong-dark-bg rounded-lg shadow-lg p-4 w-48 text-sm hidden md:group-hover:block animate-fadeInUp";

  card.innerHTML = `
	<div class="flex items-center gap-2 mb-2">
	  <img src="${user.avatar_url}" alt="${user.username}"
		   class="w-10 h-10 rounded-full object-cover" />
	  <div>
		<p class="font-semibold text-pong-dark-primary">
		  ${getWelcomeTitle(user)} ${user.username}
		</p>
		<p class="text-pong-dark-highlight text-xs">Ranked #${user.rank}</p>
	  </div>
	</div>
	<p class="text-pong-gold text-xs">${getUserTitle(user.rank)}</p>
  `;
  return card;
}

function createUserLink(user: UserProfile): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "relative inline-block group";

  const link = document.createElement("a");
  link.href = `/members/${user.id}`;
  link.setAttribute("data-link", "");
  link.className =
    "text-pong-dark-secondary font-semibold hover:underline transition";
  link.textContent = user.username;

  const card = createUserHoverCard(user);
  wrapper.appendChild(link);
  wrapper.appendChild(card);

  return wrapper;
}

function WinActivity(
  user: UserProfile,
  targetUser: UserProfile,
  activity: GameActivity
): HTMLLIElement {
  const li = document.createElement("li");
  li.className = `${styles.listStyle} flex items-center justify-between`;

  const leftDiv = document.createElement("div");
  leftDiv.className = "flex items-start gap-2";
  leftDiv.innerHTML = `<i class="fas fa-trophy text-pong-success mt-1"></i>`;

  const textDiv = document.createElement("div");
  textDiv.appendChild(createUserLink(user));
  textDiv.insertAdjacentHTML(
    "beforeend",
    `<span class="text-pong-dark-primary"> won a match against </span>`
  );
  textDiv.appendChild(createUserLink(targetUser));
  leftDiv.appendChild(textDiv);

  const scoreDiv = document.createElement("div");
  scoreDiv.className = `text-pong-dark-secondary font-semibold ${fontSizes.smallTextFontSize}`;

  const userScore =
    activity.playerId === 1
      ? activity.leftPlayerScore
      : activity.rightPlayerScore;

  const enemyScore =
    activity.playerId === 1
      ? activity.rightPlayerScore
      : activity.leftPlayerScore;

  scoreDiv.textContent = `${userScore} - ${enemyScore}`;

  li.appendChild(leftDiv);
  li.appendChild(scoreDiv);

  return li;
}

function LossActivity(
  user: UserProfile,
  targetUser: UserProfile,
  activity: GameActivity
): HTMLLIElement {
  const li = document.createElement("li");
  li.className = `${styles.listStyle} flex items-center justify-between`;

  const leftDiv = document.createElement("div");
  leftDiv.className = "flex items-start gap-2";
  leftDiv.innerHTML = `<i class="fas fa-skull-crossbones text-pong-error mt-1"></i>`;

  const textDiv = document.createElement("div");
  textDiv.appendChild(createUserLink(user));
  textDiv.insertAdjacentHTML(
    "beforeend",
    `<span class="text-pong-dark-primary"> lost a match to </span>`
  );
  textDiv.appendChild(createUserLink(targetUser));
  leftDiv.appendChild(textDiv);

  const scoreDiv = document.createElement("div");
  scoreDiv.className = `text-pong-dark-secondary font-semibold ${fontSizes.smallTextFontSize}`;

  const userScore =
    activity.playerId === 1
      ? activity.leftPlayerScore
      : activity.rightPlayerScore;

  const enemyScore =
    activity.playerId === 1
      ? activity.rightPlayerScore
      : activity.leftPlayerScore;

  scoreDiv.textContent = `${userScore} - ${enemyScore}`;

  li.appendChild(leftDiv);
  li.appendChild(scoreDiv);

  return li;
}

async function renderActivity(
  activity: GameActivity
): Promise<HTMLLIElement | null> {
  if (!activity.userId || !activity.enemyId || !activity.gameEndResult)
    return null;

  const user = await getUserById(activity.userId);
  const targetUser = await getUserById(activity.enemyId);

  if (!user || !targetUser) return null;

  switch (activity.gameEndResult) {
    case "Won":
      return WinActivity(user, targetUser, activity);
    case "Lost":
      return LossActivity(user, targetUser, activity);
    default:
      return null;
  }
}

export async function startRecentActivityListener(): Promise<void> {
  ws = new WebSocket(`wss://${window.location.host}/game/recent-activity`);

  const ul = document.getElementById("recent-activity-list");

  function readStoredActivities(): GameActivity[] {
    const raw = sessionStorage.getItem("recent-activity");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveStoredActivities(activities: GameActivity[]) {
    const CAP = 20;
    const sliced = activities.slice(-CAP);
    sessionStorage.setItem("recent-activity", JSON.stringify(sliced));
  }

  const initialActivities = readStoredActivities();
  if (initialActivities.length === 0) {
    if (ul) {
      ul.innerHTML = `<li class="text-pong-dark-secondary text-center">No matches have been played in the BHV Club yet — be the first to serve!</li>`;
    }
  } else {
    if (ul) {
      ul.innerHTML = "";
    }
    for (const activity of initialActivities) {
      try {
        const elem = await renderActivity(activity);
        if (elem && ul) ul.prepend(elem);
      } catch (err) {
        // console.error("Failed to render stored activity:", err);
      }
    }
  }

  ws.onmessage = async (event: MessageEvent) => {
    let incoming: GameActivity[];
    try {
      incoming = JSON.parse(event.data);
    } catch {
      return;
    }

    if (incoming.length === 0) return;

    const stored = readStoredActivities();

    const toAppend: GameActivity[] = [];
    for (const act of incoming) {
      toAppend.push(act);
    }

    if (toAppend.length === 0) return;

    const merged = toAppend.concat(stored).slice(0, 20);
    saveStoredActivities(merged);

    for (const activity of toAppend) {
      const elem = await renderActivity(activity);
      if (elem && ul) ul.prepend(elem);
    }

    if (ul) {
      while (ul.children.length > 20) {
        ul.removeChild(ul.lastChild!);
      }
    }
  };

  ws.onerror = (error) => {
    if (ul) {
      ul.innerHTML = `<li class="text-pong-error text-center">Unable to load activity feed.</li>`;
    }
  };

  ws.onclose = () => {
    ws = null;
  };
}

export function stopRecentActivityListener() {
  if (ws) {
    ws.close();
    ws = null;
  }
}
