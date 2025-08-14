import { styles } from "@/styles/styles";
import { displayToast } from "@/utils/display-toast";
import { initGameThemeToggle } from "@/utils/game-theme-toggle";
import { navigateTo } from "@/utils/navigate-to-link";

interface GameStateLocal {
  paddleLeftY: number;
  paddelRightY: number;
  ballX: number;
  ballY: number;
  keypressd: string[];
  rightPlayerScore: number;
  leftPlayerScore: number;
  flagX: boolean;
  flagY: boolean;
  ballSpeed: number;
  count: number;
}

interface FlowFieldDependencies {
  rightPlayerScoreLocal: HTMLElement;
  leftPlayerScoreLocal: HTMLElement;
  gameTab: HTMLElement;
  result: HTMLElement;
  restart: HTMLElement;
  Players: string[];
  Winners: string[];
  prevMatch: HTMLElement;
  currentMatch: HTMLElement;
  nextMatch: HTMLElement;
  resultTab: HTMLElement;
  resultStat: HTMLElement;
  restartTournoi: HTMLElement;
  socketLocal: WebSocket;
  start: HTMLElement;
}

export function Tournaments() {
  setTimeout(() => {
    initGameThemeToggle();
    document.getElementById("controlsToggle")?.addEventListener("click", () => {
      const panel = document.getElementById("controlsGuide");
      panel?.classList.toggle("opacity-0");
      panel?.classList.toggle("pointer-events-none");
      panel?.classList.toggle("translate-y-[20px]");
    });
  }, 0);

  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  const canvasWidth = Math.min(1000, vw * 0.95);
  const canvasHeight = Math.min(600, vh * 0.7);

  const container = document.createElement("div");
  container.className = styles.gameContainer;
  container.id = "game-screen";
  container.dataset.theme = localStorage.getItem("gameTheme") || "dark";
  container.innerHTML = `
    <div class="absolute bottom-4 right-4 z-50">
		<button id="controlsToggle" class="flex items-center gap-2 bg-pong-dark-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-pong-sport-accent transition-all duration-300">
		<i class="fa-solid fa-gamepad"></i>
		Controls
		</button>
    </div>

    <div id="controlsGuide" class="absolute z-50 text-center bottom-16 right-4 w-72 rounded-xl shadow-xl p-4 space-y-3 border border-pong-dark-secondary opacity-0 translate-y-[20px] pointer-events-none transition-all duration-300">
		<h3 class="text-lg font-bold flex items-center gap-2">
		<i class="fa-solid fa-joystick"></i> Game Controls
		</h3>
		<div id="control" class="flex flex-col gap-2 text-sm">
			<div>
				<strong class="left">Left Player:</strong> 
				<span class="bg-blue-500/20 px-2 py-1 rounded">W</span> (Up), 
				<span class="bg-blue-500/20 px-2 py-1 rounded">S</span> (Down)
			</div>
			<div>
				<strong class="right">Right Player:</strong> 
				<span class="bg-yellow-400/20 px-2 py-1 rounded">↑</span> (Up), 
				<span class="bg-yellow-400/20 px-2 py-1 rounded">↓</span> (Down)
			</div>
		</div>
		<p class="text-xs text-pong-dark-muted mt-2">
		Use your keyboard to move your paddle and dominate the match!
		</p>
    </div>

    <button id="exit" class="${styles.gameExitBtn} group" title="Exit Lounge">
      <i class="fa-solid fa-arrow-left"></i>
      <span class="absolute text-xs bg-black/80 text-white px-2 py-0.5 rounded left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition">
        Leave Lounge
      </span>
    </button>
    <button id="game-theme-toggle" class="${styles.gameThemeBtn} group" title="Switch Theme">
      <i class="fa-solid fa-circle-half-stroke"></i>
    </button>
    <h1 id="title" class="${styles.gameTitle}">
      BHV <span class="text-pong-dark-accent font-orbitron">PONG</span>
    </h1>
	
    <div class="flex items-center justify-center flex-col w-full" style="min-height:${canvasHeight}px;">
      <div class="score flex justify-center gap-20 md:gap-60 w-full mb-4 transition-all duration-300">
        <span id="leftPlayerScoreLocal" class="text-3xl md:text-5xl font-semibold font-orbitron">0</span>
        <span id="rightPlayerScoreLocal" class="text-3xl md:text-5xl font-semibold font-orbitron">0</span>
      </div>
      <div class="flex justify-center w-full pb-8">
        <canvas class="${styles.gameCanvas}" id="canvas" width=${canvasWidth} height=${canvasHeight}></canvas>
      </div>
    </div>
    <div id="gameTab" class="${styles.gameTab} game-tab p-6 rounded-2xl border transition-all duration-300 shadow-xl space-y-4 hidden">
      <h2 id="result" class="text-3xl font-bold tracking-tight text-center">Victory Board</h2>
      <div class="flex flex-col gap-3 text-base md:text-lg text-center font-medium">
        <h3 id="currentMatch" class="py-2 px-4 rounded-lg shadow-md">Current Challenge</h3>
        <h3 id="prevMatch" class="py-2 px-4 rounded-lg shadow-md hidden">Previous Duel</h3>
        <h3 id="nextMatch" class="py-2 px-4 rounded-lg shadow-md hidden">Next Face-off</h3>
      </div>
      <div class="flex justify-center gap-4 mt-6">
        <button id="restart" class="hidden game-btn font-semibold py-3 px-8 rounded-xl text-md md:text-lg shadow-md tracking-wide transition-all duration-300 text-white bg-pong-sport-accent hover:bg-pong-sport-primary dark:bg-pong-dark-secondary dark:hover:bg-pong-dark-accent">Play</button>
        <button id="start" class="game-btn font-semibold py-3 px-8 rounded-xl text-md md:text-lg shadow-md tracking-wide transition-all duration-300 text-white bg-pong-sport-accent hover:bg-pong-sport-primary dark:bg-pong-dark-accent dark:hover:bg-pong-dark-secondary">Start Game</button>
      </div>
    </div>
    <div id="resultTab" class="game-tab h-80 w-150 bg-pong-dark-bg border-2 border-pong-dark-secondary rounded-2xl absolute top-1/2 left-1/2 translate-y-[-20%] translate-x-[-50%] z-20 hidden">
      <div class="flex flex-col items-center justify-center h-full px-20 gap-6">
        <h2 id="resultStat" class="text-2xl font-bold">Champion Crowned!</h2>
        <button id="restartTournoi" class="game-btn text-white font-bold py-3 px-8 rounded-xl text-lg md:text-xl shadow-md tracking-wide transition-all duration-300">Play Again</button>
      </div>
    </div>
    <div id="tourTab" class="${styles.gameTab} game-tab">
      <div id="selectTab" class="flex flex-col items-center justify-center h-full gap-6">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Choose Your Arena Size</h2>
        <div id="tournPlayerNumber" class="flex items-center justify-center gap-6">
          <button id="eight_players" class="game-btn text-white font-bold py-3 px-8 rounded-xl text-lg md:text-xl shadow-md tracking-wide transition-all duration-300">8 Players</button>
          <button id="four_Players" class="game-btn text-white font-bold py-3 px-8 rounded-xl text-lg md:text-xl shadow-md tracking-wide transition-all duration-300">4 Players</button>
        </div>
      </div>
      <div id="inputPlayers" class="h-full hidden">
        <div class="flex flex-col items-center justify-center gap-6">
          <h2 class="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-center">Enter Challenger Usernames</h2>
          <div class="flex items-center justify-center gap-6">
            <input type="text" id="playerIdField" placeholder="Username" class="focus:outline-none normal-case placeholder:capitalize text-md rounded-lg p-3 placeholder-pong-sport-muted" maxlength="8" />
            <button id="addPlayerBtn" class="capitalize game-btn text-white font-bold py-3 px-8 rounded-xl text-md shadow-md tracking-wide transition-all duration-300">Add Player</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const rightPlayerScoreLocal = container.querySelector(
    "#rightPlayerScoreLocal"
  ) as HTMLElement;
  const leftPlayerScoreLocal = container.querySelector(
    "#leftPlayerScoreLocal"
  ) as HTMLElement;
  const gameTab = container.querySelector("#gameTab") as HTMLElement;
  const result = container.querySelector("#result") as HTMLElement;
  const restart = container.querySelector("#restart") as HTMLElement;
  const players8 = container.querySelector("#eight_players") as HTMLElement;
  const players4 = container.querySelector("#four_Players") as HTMLElement;
  const selectTab = container.querySelector("#selectTab") as HTMLElement;
  const inputPlayers = container.querySelector("#inputPlayers") as HTMLElement;
  const playerIdField = container.querySelector(
    "#playerIdField"
  ) as HTMLInputElement;
  const addPlayerBtn = container.querySelector("#addPlayerBtn") as HTMLElement;
  const tourTab = container.querySelector("#tourTab") as HTMLElement;
  const prevMatch = container.querySelector("#prevMatch") as HTMLElement;
  const currentMatch = container.querySelector("#currentMatch") as HTMLElement;
  const nextMatch = container.querySelector("#nextMatch") as HTMLElement;
  const resultTab = container.querySelector("#resultTab") as HTMLElement;
  const resultStat = container.querySelector("#resultStat") as HTMLElement;
  const restartTournoi = container.querySelector(
    "#restartTournoi"
  ) as HTMLElement;
  const start = container.querySelector("#start") as HTMLElement;
  const exit = container.querySelector("#exit") as HTMLElement;

  let numberOfPlayers = 0;
  let socketLocal: WebSocket;
  const Players: string[] = [];
  const Winners: string[] = [];

  // --- Add these at the top-level of your Tournaments() function ---
  let restartTournoiListenerAdded = false;
  let restartListenerAdded = false;

  exit.addEventListener("click", () => {
    navigateTo("/arena");
  });

  window.addEventListener("resize", () => {
    const newVw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const newVh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    canvas.width = Math.min(1000, newVw * 0.95);
    canvas.height = Math.min(600, newVh * 0.7);
  });

  function init() {
    socketLocal = new WebSocket(`wss://${window.location.host}/game/ws`);
    const keys: { [key: string]: boolean } = {};

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      keys[event.key] = true;
    });
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      keys[event.key] = false;
    });

    const flow = new FlowFieldLocal(ctx, keys, {
      rightPlayerScoreLocal,
      leftPlayerScoreLocal,
      gameTab,
      result,
      restart,
      Players,
      Winners,
      prevMatch,
      currentMatch,
      nextMatch,
      resultTab,
      resultStat,
      restartTournoi,
      socketLocal,
      start,
    });

    players4.addEventListener("click", () => {
      selectTab.style.display = "none";
      inputPlayers.style.display = "block";
      numberOfPlayers = 4;
    });
    players8.addEventListener("click", () => {
      selectTab.style.display = "none";
      inputPlayers.style.display = "block";
      numberOfPlayers = 8;
    });

    addPlayerBtn.addEventListener("click", () => {
      const username = playerIdField.value.trim();

      if (!username) {
        displayToast("Username cannot be empty!", "error");
        playerIdField.value = "";
        playerIdField.focus();
        return;
      }
      if (!playerIdField.checkValidity()) {
        displayToast("Invalid username!", "error");
        playerIdField.value = "";
        playerIdField.focus();
        return;
      }
      if (!playerIdField.value.match(/^[a-zA-Z0-9]+$/)) {
        displayToast("Invalid username!", "error");
        playerIdField.value = "";
        playerIdField.focus();
        return;
      }
      if (Players.includes(username)) {
        displayToast("Player already exists!", "error");
        playerIdField.value = "";
        playerIdField.focus();
        return;
      }
      Players.push(username);
      playerIdField.value = "";

      let enteredList = document.getElementById(
        "entered-players-list"
      ) as HTMLUListElement;
      if (!enteredList) {
        enteredList = document.createElement("ul");
        enteredList.id = "entered-players-list";
        enteredList.className = "mt-4 mb-2 flex flex-wrap gap-3 justify-center";
        inputPlayers.appendChild(enteredList);
      }
      enteredList.innerHTML = Players.map(
        (name, idx) =>
          `<li class="entered-players px-3 py-1 rounded-lg font-semibold text-lg normal-case">${
            idx + 1
          }. ${name}</li>`
      ).join("");

      if (Players.length === numberOfPlayers) {
        inputPlayers.style.display = "none";
        tourTab.style.display = "none";
        gameTab.style.display = "flex";
        currentMatch.textContent = `${Players[0]} vs ${Players[1]}`;
        if (Players.length > 2) {
          nextMatch.textContent = `NEXT MATCH: ${Players[2]} vs ${Players[3]}`;
        }
        // Only add start event listener once
        if (!start.hasAttribute("data-listener")) {
          start.setAttribute("data-listener", "true");
          start.addEventListener("click", () => {
            start.style.display = "none";
            restart.style.display = "flex";
            gameTab.style.display = "none";
            flow.animate();
          });
        }
      }
    });

    socketLocal.onmessage = (event: MessageEvent) => {
      flow.updateGameState(event.data);
    };
    socketLocal.onclose = () => {
      //   console.log("[client] Disconnected from server");
    };
    socketLocal.onerror = (err: Event) => {
      // console.error("[client] WebSocket error:", err);
    };

    // --- Add these listeners only once ---
    if (!restartTournoiListenerAdded) {
      restartTournoiListenerAdded = true;
      restartTournoi.addEventListener("click", () => {
        navigateTo("/tournament");
      });
    }

    if (!restartListenerAdded) {
      restartListenerAdded = true;
      restart.addEventListener("click", () => {
        // Optionally, reset the game state for a rematch
        gameTab.style.display = "none";
        // You may want to reset scores or re-initialize the game here
        const newSocket = new WebSocket(
          `wss://${window.location.host}/game/ws`
        );
        flow.setSocketLocal(newSocket);
        newSocket.onmessage = (event: MessageEvent) => {
          flow.updateGameState(event.data);
        };
      });
    }
  }

  init();
  return container;
}

class FlowFieldLocal {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private keys: { [key: string]: boolean };
  private gameState: GameStateLocal;
  private canvasWidth: number;
  private canvasHeight: number;
  private deps: FlowFieldDependencies;
  private ballPulse: number = 0;

  public setSocketLocal(socket: WebSocket) {
    this.deps.socketLocal = socket;
  }

  constructor(
    ctx: CanvasRenderingContext2D,
    keys: { [key: string]: boolean },
    dependencies: FlowFieldDependencies
  ) {
    this.width = 10;
    this.height = 100;
    this.canvasWidth = 1000;
    this.canvasHeight = 600;
    this.ctx = ctx;
    this.keys = keys;
    this.deps = dependencies;
    this.gameState = {
      paddleLeftY: 240,
      paddelRightY: 240,
      ballX: 500,
      ballY: 300,
      keypressd: [],
      rightPlayerScore: 0,
      leftPlayerScore: 0,
      flagX: false,
      flagY: false,
      ballSpeed: 5,
      count: 0,
    };
  }

  private draw(): void {
    const isDark =
      document.getElementById("game-screen")?.dataset.theme === "dark";
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw middle separator line (dashed)
    this.ctx.save();
    this.ctx.strokeStyle = isDark ? "#00B894" : "#FFD700";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([18, 18]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth / 2, 0);
    this.ctx.lineTo(this.canvasWidth / 2, this.canvasHeight);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.ctx.restore();

    // Draw paddles
    this.ctx.fillStyle = isDark ? "#00B894" : "#FFD700";
    this.ctx.fillRect(10, this.gameState.paddleLeftY, this.width, this.height);
    this.ctx.strokeRect(
      10,
      this.gameState.paddleLeftY,
      this.width,
      this.height
    );

    this.ctx.fillStyle = isDark ? "#00B894" : "#FFD700";
    this.ctx.fillRect(
      980,
      this.gameState.paddelRightY,
      this.width,
      this.height
    );
    this.ctx.strokeRect(
      980,
      this.gameState.paddelRightY,
      this.width,
      this.height
    );

    // Draw ball
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(
      this.gameState.ballX,
      this.gameState.ballY,
      13,
      0,
      Math.PI * 2
    );
    this.ctx.shadowColor = isDark ? "#FFD700" : "#00B894";
    this.ctx.shadowBlur = 24;
    this.ctx.fillStyle = isDark ? "#FFD700" : "#00B894";
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = isDark ? "#fff" : "#23272f";
    this.ctx.stroke();
    this.ctx.restore();
    this.ballPulse += 0.08;
    this.ctx.globalAlpha = 0.25 + 0.15 * Math.sin(this.ballPulse);
    this.ctx.beginPath();
    this.ctx.arc(
      this.gameState.ballX,
      this.gameState.ballY,
      13 + 10 + 5 * Math.abs(Math.sin(this.ballPulse)),
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = isDark ? "#FFD700" : "#00B894";
    this.ctx.fill();
    this.ctx.globalAlpha = 1;

    // --- Display usernames in corners ---
    if (this.deps.Players && this.deps.Players.length >= 2) {
      this.ctx.save();
      this.ctx.font = "bold 22px Orbitron, sans-serif";
      this.ctx.fillStyle = isDark ? "#FFF" : "#000";
      this.ctx.textAlign = "left";
      this.ctx.fillText(this.deps.Players[0], 20, 40);

      this.ctx.textAlign = "right";
      this.ctx.fillText(this.deps.Players[1], this.canvasWidth - 20, 40);
      this.ctx.restore();
    }
  }

  private keysFunction(): void {
    if (
      this.keys["w"] &&
      !this.gameState.keypressd.includes("w") &&
      this.gameState.paddleLeftY > 0
    ) {
      this.gameState.keypressd.push("w");
    }
    if (
      this.keys["s"] &&
      !this.gameState.keypressd.includes("s") &&
      this.gameState.paddleLeftY < this.canvasHeight - this.height
    ) {
      this.gameState.keypressd.push("s");
    }
    if (
      this.keys["ArrowUp"] &&
      !this.gameState.keypressd.includes("ArrowUp") &&
      this.gameState.paddelRightY > 0
    ) {
      this.gameState.keypressd.push("ArrowUp");
    }
    if (
      this.keys["ArrowDown"] &&
      !this.gameState.keypressd.includes("ArrowDown") &&
      this.gameState.paddelRightY < this.canvasHeight - this.height
    ) {
      this.gameState.keypressd.push("ArrowDown");
    }
  }

  private setInitialStat() {
    if (this.deps.result.textContent === `Winner: ${this.deps.Players[1]}`) {
      this.deps.Winners.push(this.deps.Players[1]);
    } else if (
      this.deps.result.textContent === `Winner: ${this.deps.Players[0]}`
    ) {
      this.deps.Winners.push(this.deps.Players[0]);
    }

    this.deps.Players.splice(0, 2);

    if (this.deps.Players.length < 1) {
      this.deps.Players = [...this.deps.Winners];
      this.deps.Winners = [];

      if (this.deps.Players.length === 1) {
        this.deps.gameTab.style.display = "none";
        this.deps.resultTab.style.display = "flex";
        this.deps.resultStat.textContent = `🏆 Tournament winner is: ${this.deps.Players[0]} 🏆`;
        this._tournamentDone = true;
        return;
      }
    }

    // Always update/hide match labels appropriately
    if (this.deps.Players.length >= 2) {
      this.deps.currentMatch.textContent = `${this.deps.Players[0]} vs ${this.deps.Players[1]}`;
      this.deps.currentMatch.style.display = "block";
      if (this.deps.Players.length >= 4) {
        this.deps.nextMatch.textContent = `NEXT MATCH: ${this.deps.Players[2]} vs ${this.deps.Players[3]}`;
        this.deps.nextMatch.style.display = "block";
      } else {
        this.deps.nextMatch.textContent = "";
        this.deps.nextMatch.style.display = "none";
      }
    } else {
      this.deps.currentMatch.style.display = "none";
      this.deps.nextMatch.style.display = "none";
    }

    this.resetGameState();
    this.deps.gameTab.style.display = "flex";
    this.deps.socketLocal.close();
  }

  // Add a private property to control the animation loop:
  private _tournamentDone: boolean = false;

  private resetGameState() {
    this.gameState = {
      paddleLeftY: 240,
      paddelRightY: 240,
      ballX: 500,
      ballY: 300,
      keypressd: [],
      rightPlayerScore: 0,
      leftPlayerScore: 0,
      flagX: false,
      flagY: false,
      ballSpeed: 5,
      count: 0,
    };
  }

  public updateGameState(data: string): void {
    try {
      this.gameState = JSON.parse(data);
      this.deps.rightPlayerScoreLocal.textContent =
        this.gameState.rightPlayerScore.toString();
      this.deps.leftPlayerScoreLocal.textContent =
        this.gameState.leftPlayerScore.toString();

      if (this.gameState.rightPlayerScore === 5) {
        this.deps.result.textContent = `Winner: ${this.deps.Players[1]}`;
        this.setInitialStat();
      } else if (this.gameState.leftPlayerScore === 5) {
        this.deps.result.textContent = `Winner: ${this.deps.Players[0]}`;
        this.setInitialStat();
      }
    } catch (err) {
      // console.error("Error updating game state:", err);
    }
  }

  private ballPositionUpdate(): void {
    if (this.deps.socketLocal.readyState === WebSocket.OPEN) {
      this.deps.socketLocal.send(JSON.stringify(this.gameState));
    }
  }

  // Update the animate() method:
  public animate(): void {
    if (this._tournamentDone) return; // Stop animation if tournament is done
    this.draw();
    this.keysFunction();
    this.ballPositionUpdate();
    requestAnimationFrame(this.animate.bind(this));
  }
}
