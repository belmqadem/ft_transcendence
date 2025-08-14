import { getUserById } from "@/services/get-user-by-id";
import { getUserHistory } from "@/services/get-user-history";
import { fontSizes } from "@/styles/fontSizes";
import { UserHistory, UserProfile } from "types/types";
import Chart from "chart.js/auto";
import { getWelcomeTitle } from "@/components/home/Hero";
import { getUserTitle } from "@/utils/get-user-title";
import { getAvatarUrl } from "@/utils/get-avatar-url";
import { navigateTo } from "@/utils/navigate-to-link";

export async function loadMatchHistory(user: UserProfile) {
  const matchHistoryList = document.getElementById(
    "match-history-list"
  ) as HTMLUListElement;
  if (!matchHistoryList) return;

  matchHistoryList.innerHTML = "";

  let history: UserHistory[] = await getUserHistory(user.id);

//   console.log("history: ", history);

  if (!history || history.length === 0) {
    const li = document.createElement("li");
    li.className = `text-pong-dark-secondary ${fontSizes.bodyFontSize}`;
    li.textContent = "No match history available.";
    matchHistoryList.appendChild(li);
    return;
  }

  for (const match of history) {
    const isWin = match.game_end_result === "Won";
    const enemyScore =
      match.player_id === 1
        ? match.right_player_score
        : match.left_player_score;
    const myScore =
      match.player_id === 1
        ? match.left_player_score
        : match.right_player_score;
    const myHits =
      match.player_id === 1
        ? match.left_player_ball_hit
        : match.right_player_ball_hit;
    const enemyHits =
      match.player_id === 1
        ? match.right_player_ball_hit
        : match.left_player_ball_hit;

    const enemyUser = await getUserById(match.enemy_id);
    if (!enemyUser) return;

    const listItem = document.createElement("li");
    listItem.className = `
		group border border-pong-dark-secondary/30 
		rounded-md p-5 m-4 shadow-md bg-gradient-to-br 
		from-pong-dark-highlight/20 to-pong-dark-highlight/5 
		transition hover:border-pong-accent/50 hover:shadow-lg hover:scale-[1.02]
		flex flex-col gap-3
  	`;

    const header = document.createElement("div");
    header.className = "flex justify-between items-center";

    const resultBadge = document.createElement("span");
    resultBadge.textContent = isWin ? "🏆 Won" : "❌ Lost";
    resultBadge.className = `px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow ${
      isWin ? "bg-pong-success text-white" : "bg-pong-error text-white"
    }`;

    const duration = document.createElement("span");
    duration.textContent = `⏱ ${match.game_duration} seconds`;
    duration.className = "text-sm text-pong-dark-secondary";

    header.appendChild(resultBadge);
    header.appendChild(duration);

    const scoreLine = document.createElement("p");
    scoreLine.className = "text-xl font-bold text-white tracking-tight";
    scoreLine.textContent = `${myScore} - ${enemyScore}`;

    const enemy = document.createElement("div");
    enemy.className =
      "flex items-center gap-4 mt-2 cursor-pointer group/opp w-fit";

    const enemyAvatar = document.createElement("img");
    if (enemyUser) enemyAvatar.src = getAvatarUrl(enemyUser);
    enemyAvatar.alt = enemyUser?.username || "Unknown";
    enemyAvatar.className = `
		w-10 h-10 rounded-full object-cover border-2 border-pong-accent/40
		shadow-sm transition-transform duration-300 group-hover/opp:scale-110
	`;

    const enemyInfo = document.createElement("div");
    enemyInfo.className = "flex flex-col";

    const enemyName = document.createElement("span");
    enemyName.className =
      "text-sm text-white font-semibold flex items-center gap-2";
    enemyName.innerHTML = `<i class="fa-solid fa-user text-pong-accent"></i> ${getWelcomeTitle(
      enemyUser
    )} ${enemyUser?.username || "Unknown"} (Level ${enemyUser?.level || 0})`;

    const enemyTitle = document.createElement("span");
    enemyTitle.className = "text-xs text-pong-dark-secondary";
    enemyTitle.textContent = getUserTitle(enemyUser?.rank || 0);

    enemyInfo.appendChild(enemyName);
    enemyInfo.appendChild(enemyTitle);

    enemy.appendChild(enemyAvatar);
    enemy.appendChild(enemyInfo);

    enemy.addEventListener("click", (e) =>
      navigateTo(`/members/${match.enemy_id}`)
    );

    const chartButton = document.createElement("button");
    chartButton.textContent = "View Details";
    chartButton.className = `
      mt-2 self-end px-4 py-2 bg-pong-accent hover:bg-pong-dark-accent
      text-white rounded-lg text-sm font-semibold shadow
      transition hover:scale-105
    `;

    chartButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const oldModal = document.getElementById("match-history-modal");
      if (oldModal) oldModal.remove();

      const modal = document.createElement("div");
      modal.id = "match-history-modal";
      modal.className =
        "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm";

      modal.innerHTML = `
  		<div class="relative bg-gradient-to-br from-[#1d1f27]/80 to-[#2c2e36]/80 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 flex flex-col items-center border border-white/10 backdrop-blur-2xl">
    		<button id="close-history-modal" class="absolute top-4 right-4 text-2xl text-pong-accent hover:text-pong-error transition transform hover:scale-110" title="Close">
    		  <i class="fa-solid fa-xmark"></i>
    		</button>

		    <h2 class="text-2xl font-bold mb-6 text-pong-accent tracking-wide">Match Details</h2>

		    <div class="bg-black/30 rounded-xl px-6 py-4 w-full max-w-md mb-6 flex flex-col items-center shadow-lg border border-white/10">
      		  <div class="flex items-center gap-6 mb-4">
                <div class="flex flex-col items-center">
          		  <img src="${getAvatarUrl(
                  user
                )}" class="w-14 h-14 rounded-full border-2 border-pong-accent/60 shadow" />
          		  <span class="mt-1 text-xs text-gray-300">You</span>
        		</div>
        		<span class="text-xl font-bold text-white">vs</span>
        		<div class="flex flex-col items-center">
          		  <img src="${getAvatarUrl(
                  enemyUser
                )}" class="w-14 h-14 rounded-full border-2 border-pong-accent/60 shadow" />
          		  <span class="mt-1 text-xs text-gray-300">${
                  enemyUser?.username || "Opponent"
                }</span>
        		</div>
    		  </div>
      		  <p class="text-4xl font-bold text-white drop-shadow-md mb-2">${myScore} - ${enemyScore}</p>
      		  <p class="text-white font-semibold text-center">${
              isWin
                ? "🏆 You secured the victory!"
                : "❌ Tough luck, you lost this time."
            }
			  </p>
    		</div>

    		<p class="text-pong-dark-secondary text-center mb-6 max-w-md leading-relaxed">
    		  Below is the breakdown of <span class="text-white font-medium">ball hits</span>, showing how active each player was throughout the match.
    		</p>

    		<div class="w-full bg-black/40 rounded-xl border border-white/10 p-5 shadow-lg">
    		  <canvas id="chart-${match.id}" class="w-full h-44"></canvas>
    		</div>

    		<p class="mt-5 text-sm text-gray-400 text-center">
    		  Ball hits reflect the number of times each player successfully hit the ball during the match.
    		</p>
  		</div>
	`;

      document.body.appendChild(modal);

      modal
        .querySelector("#close-history-modal")
        ?.addEventListener("click", () => {
          modal.remove();
        });

      setTimeout(() => {
        const canvas = document.getElementById(
          `chart-${match.id}`
        ) as HTMLCanvasElement;
        if (!canvas) return;

        new Chart(canvas, {
          type: "bar",
          data: {
            labels: ["You", "Opponent"],
            datasets: [
              {
                label: "Ball Hits",
                data: [myHits, enemyHits],
                backgroundColor: ["#C45E37", "#C44537"],
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx: { parsed: { y: number } }) =>
                    `${ctx.parsed.y} hits`,
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#fff" },
                grid: { display: false },
              },
              y: {
                ticks: { color: "#fff" },
                grid: { color: "rgba(255,255,255,0.1)" },
              },
            },
            animation: {
              duration: 1000,
            },
          },
        });
      }, 50);
    });

    listItem.appendChild(header);
    listItem.appendChild(scoreLine);
    listItem.appendChild(enemy);
    listItem.appendChild(chartButton);

    matchHistoryList.appendChild(listItem);
  }
}
