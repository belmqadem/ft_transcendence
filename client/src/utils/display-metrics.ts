import { getUserHistory } from "@/services/get-user-history";
import { fontSizes } from "@/styles/fontSizes";
import { UserProfile, UserHistory } from "types/types";
import Chart from "chart.js/auto";

export async function displayPerformanceMetrics(user: UserProfile) {
  const metricsContainer = document.getElementById("performance-metrics");
  if (!metricsContainer) return;
  metricsContainer.innerHTML = "";

  let history: UserHistory[] = await getUserHistory(user.id);
  if (!history || history.length === 0) {
	metricsContainer.innerHTML = `<div class="text-center text-pong-dark-secondary py-4">No performance data available.</div>`;
	return;
  }

  const totalMatches = user.matches_played;
  const wins = user.matches_won;
  const losses = user.matches_lost;

  const avgDuration = (
    history.reduce((acc, h) => acc + h.game_duration, 0) / totalMatches
  ).toFixed(1);

  let pointsScored = 0;
  let pointsConceded = 0;
  history.forEach((h) => {
    h.game_end_result === "Won"
      ? ((pointsScored +=
          h.player_id === 1 ? h.left_player_score : h.right_player_score),
        (pointsConceded +=
          h.player_id === 1 ? h.right_player_score : h.left_player_score))
      : ((pointsScored +=
          h.player_id === 1 ? h.left_player_score : h.right_player_score),
        (pointsConceded +=
          h.player_id === 1 ? h.right_player_score : h.left_player_score));
  });

  const winRate = Math.round((wins / totalMatches) * 100);

  const recentMatches = history.slice(-5);
  const labels = recentMatches.map(
    (_, i) => `Match ${totalMatches - (recentMatches.length - 1 - i)}`
  );
  const scoredData = recentMatches.map((h) =>
    h.player_id === 1 ? h.left_player_score : h.right_player_score
  );
  const concededData = recentMatches.map((h) =>
    h.player_id === 1 ? h.right_player_score : h.left_player_score
  );

  const circleCircumference = 2 * Math.PI * 36;
  const dashOffset = circleCircumference * (1 - wins / totalMatches);

  metricsContainer.innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full">

      <div class="bg-pong-dark-custom border border-pong-dark-highlight/30 p-6 rounded-md shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]">
        <h3 class="${fontSizes.bodyFontSize} font-bold mb-4 text-pong-accent text-center tracking-wide">Win / Loss</h3>
        <div class="relative w-28 h-28">
          <svg class="transform -rotate-90 w-full h-full">
            <circle cx="50%" cy="50%" r="36" stroke="rgba(255,255,255,0.15)" stroke-width="8" fill="none"/>
            <circle id="win-circle" cx="50%" cy="50%" r="36"
              stroke="url(#grad)"
              stroke-width="8" fill="none"
              stroke-dasharray="${circleCircumference}"
              stroke-dashoffset="${circleCircumference}"
              stroke-linecap="round"
              style="transition: stroke-dashoffset 1.2s ease-out;"
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#22c55e"/>
                <stop offset="100%" stop-color="#26d767"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-bold text-white drop-shadow">${winRate}%</span>
          </div>
        </div>
        <p class="mt-3 text-sm text-white/70">${wins} Wins • ${losses} Losses</p>
      </div>

      <div class="bg-pong-dark-custom border border-pong-dark-highlight/30 p-6 rounded-md shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]">
        <h3 class="${fontSizes.bodyFontSize} font-bold mb-4 text-pong-accent text-center tracking-wide">Avg Match Duration</h3>
        <div class="text-3xl md:text-5xl font-bold text-pong-dark-primary drop-shadow-lg">${avgDuration}s</div>
        <p class="mt-2 text-gray-300 text-sm">Per Match</p>
      </div>

      <div class="bg-pong-dark-custom border border-pong-dark-highlight/30 p-6 rounded-md shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]">
        <h3 class="${fontSizes.bodyFontSize} font-bold mb-4 text-pong-accent text-center tracking-wide">Points Scored vs Conceded</h3>
        <div class="w-full space-y-4">
          <div>
            <div class="flex justify-between text-xs text-white/60 mb-1">
              <span>Scored</span>
              <span>${pointsScored}</span>
            </div>
            <div class="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
              <div class="h-2 bg-pong-success rounded-full bar-scored" style="width:0%; transition: width 1s ease-in-out;"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs text-white/60 mb-1">
              <span>Conceded</span>
              <span>${pointsConceded}</span>
            </div>
            <div class="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
              <div class="h-2 bg-pong-error rounded-full bar-conceded" style="width:0%; transition: width 1s ease-in-out;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-pong-dark-custom border border-pong-dark-highlight/30 p-6 rounded-md shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-[1.02] lg:col-span-3">
        <h3 class="${fontSizes.bodyFontSize} font-bold mb-4 text-pong-accent text-center tracking-wide">Last 5 Matches</h3>
        <canvas id="mini-bar-chart" class="w-full h-40"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    const winCircle = document.getElementById(
      "win-circle"
    ) as SVGCircleElement | null;
    if (winCircle) {
      winCircle.style.strokeDashoffset = String(dashOffset);
    }
    const totalPoints = pointsScored + pointsConceded;
    const scoredBar = metricsContainer.querySelector(
      ".bar-scored"
    ) as HTMLDivElement;
    const concededBar = metricsContainer.querySelector(
      ".bar-conceded"
    ) as HTMLDivElement;
    if (scoredBar && concededBar && totalPoints > 0) {
      scoredBar.style.width = `${(pointsScored / totalPoints) * 100}%`;
      concededBar.style.width = `${(pointsConceded / totalPoints) * 100}%`;
    }
  }, 100);

  const ctx = document.getElementById("mini-bar-chart") as HTMLCanvasElement;
  if (ctx) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Scored",
            data: scoredData,
            backgroundColor: "#22c55e",
            borderRadius: 4,
          },
          {
            label: "Conceded",
            data: concededData,
            backgroundColor: "#ef4444",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#fff" } },
        },
        scales: {
          x: {
            ticks: { color: "#ccc" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
          y: {
            ticks: { color: "#ccc" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
        },
      },
    });
  }
}
