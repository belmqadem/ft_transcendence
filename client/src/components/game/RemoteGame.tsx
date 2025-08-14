import { navigateTo } from "@/utils/navigate-to-link";
import { getCurrentUser } from "@/utils/user-store";
import { UserProfile } from "types/types";
import { initGameThemeToggle } from "@/utils/game-theme-toggle";
import { styles } from "@/styles/styles";
import { inviteFriend } from "@/services/invite-friend";

let socket: WebSocket | null = null;

// let countdownCounter = false;
export function RemoteGame() {
  setTimeout(() => {
    initGameThemeToggle();
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

  // Create a container element for the game
  const container = document.createElement("div");
  container.className = styles.gameContainer;
  container.id = "game-screen";
  container.dataset.theme = localStorage.getItem("gameTheme") || "dark";

  // Add your game HTML structure
  container.innerHTML = `
  	<button id="exit" class="${styles.gameExitBtn} group" title="Leave Lounge">
      <i class="fa-solid fa-arrow-left"></i>
	  <span class="absolute text-xs bg-black/80 text-white px-2 py-0.5 rounded left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition">
        Leave Lounge
      </span>
  	</button>
  	<button id="game-theme-toggle" class="${styles.gameThemeBtn} group" title="Switch Mood">
      <i class="fa-solid fa-circle-half-stroke"></i>
  	</button>

  	<h1 id="title" class="${styles.gameTitle}">
      BHV <span class="text-pong-dark-accent font-orbitron">PONG</span>
  	</h1>
    <h2 class="text-center font-orbitron text-2xl my-8 font-bold" id="playerSide"></h2>

	<div class="flex items-center justify-center flex-col w-full" style="min-height:${canvasHeight}px;">
      <div class="score flex justify-center gap-20 md:gap-60 w-full mb-4 transition-all duration-300">
		<span id="leftPlayerScoreRemote" class="text-3xl md:text-5xl font-semibold font-orbitron">0</span>
		<span id="rightPlayerScoreRemote" class="text-3xl md:text-5xl font-semibold font-orbitron">0</span>
	  </div>

      <div class="flex justify-center w-full pb-8">
		<canvas class="${styles.gameCanvas}"
        		id="canvas"
        		width=${canvasWidth}
        		height=${canvasHeight}>
      	</canvas>
      </div>
  	</div>

    <div id="controls-guide" class="flex flex-col items-center justify-center mt-4 z-50">
      <h3 class="text-lg font-bold mb-2">Controls</h3>
      <ul class="text-base space-y-1 font-orbitron">
        <li><strong>W</strong>: Move Paddle Up</li>
        <li><strong>S</strong>: Move Paddle Down</li>
      </ul>
    </div>

    <div id="gameTab" class="game-tab ${styles.gameTab} hidden">
      <div class="flex flex-col items-center justify-center h-full px-20 py-4">
        <h1 class="text-5xl font-bold text-pong-dark-secondary">GAME OVER</h1>
        <h1 id="result" class="text-2xl mt-2 text-amber-50">WON</h1>
        <button id="restartButton" class="game-btn text-white mt-6 font-bold py-3 px-8 rounded-xl text-lg md:text-xl shadow-md tracking-wide transition-all duration-300">PLAY AGAIN</button>
      </div>
    </div>
    <div id="disconnected" class="game-tab ${styles.gameTab} hidden">
      <div class="flex flex-col items-center justify-center h-full px-20 py-4">
        <h1 class="text-5xl font-bold text-pong-dark-secondary">GAME OVER</h1>
        <h1 id="disconnected" class="text-2xl mt-2"> DISCONNECTED</h1>
      </div>
    </div>
  `;

  // Initialize game elements
  const canvas = container.querySelector("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const rightPlayerScore = container.querySelector(
    "#rightPlayerScoreRemote"
  ) as HTMLElement;
  const leftPlayerScore = container.querySelector(
    "#leftPlayerScoreRemote"
  ) as HTMLElement;
  const restartButton = container.querySelector(
    "#restartButton"
  ) as HTMLButtonElement;
  const result = container.querySelector("#result") as HTMLElement;
  const gameTabe = container.querySelector("#gameTab") as HTMLElement;
  const disconnectedResult = container.querySelector(
    "#disconnected"
  ) as HTMLElement;
  const exit = container.querySelector("#exit") as HTMLElement;
  const playerSide = container.querySelector("#playerSide") as HTMLElement;

  // Utility functions
  const userInfo = getCurrentUser();

  const getRoomIdByUserId = async (userId: number) => {
    return fetch("/game/getRoomId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId }), // send { userId: someNumber }
    })
      .then((response) => {
        if (!response.ok) {
          // Handle HTTP errors (like 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON body
      })
      .then((data) => {
        // data will be the JSON response from your Fastify route
        // e.g. { message: "Room found", roomData: "room-123" }
        return data.roomData; // return the roomData string
      })
      .catch((err) => {
        // // console.error("Fetch error:", err);
        return null; // or handle error how you want
      });
  };

  // Initialize the game
  async function init() {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      {
        // console.log(
        //   "WebSocket is already active. Closing the existing connection."
        // );
        // closeRemoteWebSocket();
        return;
      }
    }

    const userName: string = userInfo?.username ?? "username";
    const roomdIdentif = await getRoomIdByUserId(userInfo?.id ?? 0);

    socket = new WebSocket(
      `wss://${window.location.host}/game/remoteGame?token=${userInfo?.id}&roomId=${roomdIdentif}`
    );

    exit.addEventListener("click", () => {
      socket?.close();
      navigateTo("/arena");
    });
    let keys: Record<string, boolean> = {};
    window.addEventListener("keydown", (key: KeyboardEvent) => {
      keys[key.key] = true;
    });

    window.addEventListener("keyup", (key: KeyboardEvent) => {
      keys[key.key] = false;
    });

    const flow = new FlowField(ctx, keys, {
      rightPlayerScore,
      leftPlayerScore,
      restartButton,
      result,
      gameTabe,
      disconnectedResult,
      exit,
      playerSide,
      socket,
      userName,
      roomdIdentif,
    });

    socket.onopen = () => {
      //   console.log(
      //     "Connecting to WebSocket for remote game with roomId:",
      //     roomdIdentif
      //   );
    };

    socket.onclose = () => {
      //   console.log("Remote game WebSocket connection closed.");
    };

    socket.onerror = (err) => {
      // console.error("[client] WebSocket error:", err);
    };

    socket.onmessage = (event: MessageEvent) => {
      // Handle both ArrayBuffer and string data
      if (event.data instanceof ArrayBuffer) {
        flow.updateGameState(event.data);
      } else if (typeof event.data === "string") {
        // Handle string messages (like "disconnected.", etc.)
        if (
          event.data === "disconnected." ||
          event.data.includes("disconnected")
        ) {
          disconnectedResult.style.display = "block";
          return;
        }
        flow.updateGameState(event.data);
      } else {
        // Handle Blob data (convert to ArrayBuffer)
        if (event.data instanceof Blob) {
          event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
            flow.updateGameState(buffer);
          });
        }
      }
    };

    flow.animate();
  }

  // Start the game when the container is added to DOM
  init();

  return container;
}
let flag_one: boolean = true;
let flag_two: boolean = true;
let flag_update: boolean = true;

// Interfaces
interface GameState {
  matchId: string;
  playerId: number;
  ballX: number;
  ballY: number;
  ballSpeed: number;
  flagX: boolean;
  flagY: boolean;
  paddleLeftY: number;
  paddelRightY: number;
  keypressd: string;
  disconnected: boolean;
  leftPlayerScore: number;
  rightPlayerScore: number;
  rounds: number;
  endGame: boolean;
  alive: boolean;
  gameEndResult?: string;
  leftPlayerBallHit: number;
  rightPlayerBallHit: number;
  startTime: number;
  endTime: number;
  level: number;
  matchPlayed: number;
  matchWon: number;
  matchLost: number;
  enemyId: number;
  countdownActive?: boolean; // Add countdown state
  countdownTime?: number; // Add countdown time
}
interface PlayerData {
  userName: string;
  matchId: string;
  playerId: number;
  leftPlayerScore: number;
  rightPlayerScore: number;
  gameDuration: number;
  gameEndResult: string;
  leftPlayerBallHit: number;
  rightPlayerBallHit: number;
  level: number;
  matchPlayed: number;
  matchWon: number;
  matchLost: number;
  enemyId: number; // Added enemyId to track the opponent
  userId?: number; // Optional, used for server-side updates
}

interface LastMatchData {
  level: number;
  matchPlayed: number;
  matchWon: number;
  matchLost: number;
}
interface CompactGameState {
  p: number; // playerId
  bx: number; // ballX
  by: number; // ballY
  fx: number; // flagX (0 or 1)
  fy: number; // flagY (0 or 1)
  pl: number; // paddleLeftY
  pr: number; // paddelRightY
  kp: string; // keypressd
  dc: number; // disconnected (0 or 1)
  ls: number; // leftPlayerScore
  rs: number; // rightPlayerScore
  rd: number; // rounds
  bs: number; // ballSpeed
  hc: number; // hitCount
  r: string; // gameEndResult
  e: number; // endGame (0 or 1)
  al: number; // alive (0 or 1)
  lh: number; // leftPlayerBallHit
  rh: number; // rightPlayerBallHit
  st: number; // startTime
  et: number; // endTime
  ei: number; // enemyId
  mi: string; // matchId
  ca: number; // countdownActive (0 or 1)
  ct: number; // countdownTime
}
function expandGameState(compact: CompactGameState): Partial<GameState> {
  return {
    playerId: compact.p || 1,
    ballX:
      compact.bx !== null && compact.bx !== undefined && !isNaN(compact.bx)
        ? compact.bx
        : 500,
    ballY:
      compact.by !== null && compact.by !== undefined && !isNaN(compact.by)
        ? compact.by
        : 300,
    flagX: compact.fx === 1,
    flagY: compact.fy === 1,
    paddleLeftY:
      compact.pl !== null && compact.pl !== undefined && !isNaN(compact.pl)
        ? compact.pl
        : 240,
    paddelRightY:
      compact.pr !== null && compact.pr !== undefined && !isNaN(compact.pr)
        ? compact.pr
        : 240,
    keypressd: compact.kp || "",
    disconnected: compact.dc === 1,
    leftPlayerScore: compact.ls || 0,
    rightPlayerScore: compact.rs || 0,
    rounds: compact.rd || 5,
    ballSpeed:
      compact.bs !== null && compact.bs !== undefined && !isNaN(compact.bs)
        ? compact.bs
        : 3,
    // hitCount: compact.hc,
    gameEndResult: compact.r || "",
    endGame: compact.e === 1,
    alive: compact.al === 1,
    leftPlayerBallHit: compact.lh || 0,
    rightPlayerBallHit: compact.rh || 0,
    startTime: compact.st || Date.now(),
    endTime: compact.et || 0,
    enemyId: compact.ei || 0,
    matchId: compact.mi || "",
    countdownActive: compact.ca === 1, // Add countdown expansion
    countdownTime: compact.ct || 0,
  };
}
interface FlowFieldDependencies {
  rightPlayerScore: HTMLElement;
  leftPlayerScore: HTMLElement;
  restartButton: HTMLButtonElement;
  result: HTMLElement;
  gameTabe: HTMLElement;
  disconnectedResult: HTMLElement;
  exit: HTMLElement;
  playerSide: HTMLElement;
  socket: WebSocket;
  userName: string;
  roomdIdentif: string;
}

class FlowField {
  private ctx: CanvasRenderingContext2D;
  private width: number = 10;
  private height: number = 100;
  private canvasWidth: number = 1000;
  private canvasHeight: number = 600;
  private ballPulse: number = 0;
  private keys: Record<string, boolean>;
  private gameState: GameState;
  private deps: FlowFieldDependencies;

  constructor(
    ctx: CanvasRenderingContext2D,
    keys: Record<string, boolean>,
    dependencies: FlowFieldDependencies
  ) {
    this.ctx = ctx;
    this.keys = keys;
    this.deps = dependencies;
    this.gameState = {
      matchId: "",
      playerId: 0,
      ballX: 500,
      ballY: 300,
      ballSpeed: 3,
      flagX: false,
      flagY: false,
      paddleLeftY: 240,
      paddelRightY: 240,
      keypressd: "",
      disconnected: false,
      leftPlayerScore: 0,
      rightPlayerScore: 0,
      rounds: 5,
      endGame: false,
      alive: true,
      leftPlayerBallHit: 0,
      rightPlayerBallHit: 0,
      startTime: Date.now(),
      endTime: 0,
      level: 0,
      matchPlayed: 0,
      matchWon: 0,
      matchLost: 0,
      enemyId: 0, // Added enemyId to track the opponent
      countdownActive: false, // Initialize countdown state
      countdownTime: 0, // Initialize countdown time
    };

    this.deps.restartButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent default behavior
      if (!this.deps.restartButton.disabled) {
        this.deps.restartButton.disabled = true; // Disable button to prevent multiple clicks
        window.location.reload();
        try {
          await fetch("/game/restart-match", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender_id: getCurrentUser()?.id,
              recipient_id: +this.gameState.enemyId,
            }),
          });
        } catch (error) {
          // console.error("Error sending restart request:", error);
        } finally {
          this.deps.restartButton.disabled = false; // Re-enable button
        }
      }
    });
  }

  private sendPlayerData(playerData: PlayerData): void {
    fetch("/game/storePlayerData", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    }).catch((error) => {
      // console.error("Error sending player data:", error);
    });
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

    // player names
    // this.ctx.save();
    // this.ctx.font = "bold 22px Orbitron, sans-serif";
    // this.ctx.fillStyle = "#AEBABF";
    // this.ctx.textAlign = "left";
    // this.ctx.fillText("Left Player", 20, 30);
    // this.ctx.fillStyle = "#E05E4B";
    // this.ctx.textAlign = "right";
    // this.ctx.fillText("Right Player", this.canvasWidth - 20, 30);
    // this.ctx.restore();

    if (
      this.gameState.countdownTime === 0 ||
      this.gameState.countdownTime === 1 ||
      this.gameState.countdownTime === 2 ||
      this.gameState.countdownTime === 3
    )
      this.gameState.countdownActive = true;
    else this.gameState.countdownActive = false;

    if (
      this.gameState?.countdownActive &&
      (this.gameState?.countdownTime ?? 0) > 0
    ) {
      this.drawCountdown();
      return;
    }

    // Left paddle
    this.ctx.fillStyle = "#AEBABF";
    this.ctx.fillRect(10, this.gameState.paddleLeftY, this.width, this.height);
    this.ctx.strokeStyle = "#AEBABF";
    this.ctx.strokeRect(
      10,
      this.gameState.paddleLeftY,
      this.width,
      this.height
    );

    // Right paddle
    this.ctx.fillStyle = "#E05E4B";
    this.ctx.fillRect(
      980,
      this.gameState.paddelRightY,
      this.width,
      this.height
    );
    this.ctx.strokeStyle = "#E05E4B";
    this.ctx.strokeRect(
      980,
      this.gameState.paddelRightY,
      this.width,
      this.height
    );

    // Ball
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
  }
  private drawCountdown(): void {
    const isDark =
      document.getElementById("game-screen")?.dataset.theme === "dark";
    this.drawGameElements(isDark);

    // Draw countdown text
    this.ctx.fillStyle = isDark ? "#FFD700" : "#00B894";
    this.ctx.font = "bold 120px 'Orbitron', monospace";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    const countdownText =
      this.gameState.countdownActive &&
      this.gameState.countdownTime !== undefined &&
      this.gameState.countdownTime > 0
        ? this.gameState.countdownTime.toString()
        : "GO!";

    // Add text shadow
    this.ctx.shadowColor = isDark ? "#FFD700" : "#00B894";
    this.ctx.shadowBlur = 20;

    this.ctx.fillText(
      countdownText,
      this.canvasWidth / 2,
      this.canvasHeight / 2
    );

    // Dynamic subtitle based on scores
    this.ctx.font = "bold 22px Orbitron, sans-serif";
    this.ctx.fillStyle = isDark ? "#fff" : "#23272f";
    this.ctx.shadowBlur = 10;

    let subtitle = "Game Starting...";
    if (
      this.gameState.leftPlayerScore > 0 ||
      this.gameState.rightPlayerScore > 0
    ) {
      subtitle = "Next Point Starting...";
    }

    this.ctx.fillText(
      subtitle,
      this.canvasWidth / 2,
      this.canvasHeight / 2 + 80
    );

    // Reset shadow
    this.ctx.shadowBlur = 0;
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "alphabetic";
  }
  private drawGameElements(isDark: boolean): void {
    // Left paddle
    this.ctx.fillStyle = "#AEBABF";
    this.ctx.fillRect(10, this.gameState.paddleLeftY, this.width, this.height);
    this.ctx.strokeStyle = "#AEBABF";
    this.ctx.strokeRect(
      10,
      this.gameState.paddleLeftY,
      this.width,
      this.height
    );

    // Right paddle
    this.ctx.fillStyle = "#E05E4B";
    this.ctx.fillRect(
      980,
      this.gameState.paddelRightY,
      this.width,
      this.height
    );
    this.ctx.strokeStyle = "#E05E4B";
    this.ctx.strokeRect(
      980,
      this.gameState.paddelRightY,
      this.width,
      this.height
    );
  }
  private keysFunction(): void {
    // if (this.gameState.countdownActive) {
    //   return;
    // }
    if (this.keys["w"]) {
      this.gameState.keypressd = "w";
    } else if (this.keys["s"]) {
      this.gameState.keypressd = "s";
    }
  }

  private ballPositionUpdate(): void {
    if (this.deps.socket.readyState === WebSocket.OPEN) {
      this.deps.socket.send(JSON.stringify(this.gameState));
    }
  }
  public updateUser(currentUser: UserProfile, hasWon: boolean): void {
    const payload = {
      hasWon: hasWon,
      matches_won: currentUser.matches_won,
      matches_lost: currentUser.matches_lost,
    };
    fetch(`/profile/user/${currentUser.userId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      // console.error("Error updating user:", error);
    });
  }

  public updateGameState(data: string | ArrayBuffer): void {
    try {
      let parsedData: GameState;

      // Check if data is ArrayBuffer (from Buffer.from() on server)
      if (data instanceof ArrayBuffer) {
        // Convert ArrayBuffer to string
        const decoder = new TextDecoder();
        const jsonString = decoder.decode(data);
        const compact: CompactGameState = JSON.parse(jsonString);
        // Expand compact state to full state
        const expandedState = expandGameState(compact);
        parsedData = { ...this.gameState, ...expandedState };
      } else {
        // Handle regular JSON string (fallback)
        parsedData = JSON.parse(data);
      }
      this.gameState = parsedData;
      this.gameState = parsedData;
      if (this.gameState.playerId === 1) {
        this.deps.playerSide.innerText =
          "YOU ARE ON THE LEFT SIDE - GRAY PADDLE";
      } else if (this.gameState.playerId === 2) {
        this.deps.playerSide.innerText =
          "YOU ARE ON THE RIGHT SIDE - RED PADDLE";
      }
      this.deps.rightPlayerScore.textContent = String(
        this.gameState.rightPlayerScore
      );
      this.deps.leftPlayerScore.textContent = String(
        this.gameState.leftPlayerScore
      );
      if (
        this.gameState.gameEndResult &&
        this.gameState.gameEndResult.length !== 0
      ) {
        this.gameState.endGame = true;
        this.deps.result.textContent = "You " + this.gameState.gameEndResult;
        this.deps.gameTabe.style.display = "block";
        (async () => {
          const getOldDataOfCurrentUserData = getCurrentUser();
          const cuurrUser = getOldDataOfCurrentUserData?.userId;
          if (!getOldDataOfCurrentUserData) {
            // console.warn(
            //   "No previous match data found. Initializing defaults."
            // );
            const playerData: PlayerData = {
              userName: this.deps.userName,
              matchId: this.gameState.matchId,
              playerId: this.gameState.playerId,
              leftPlayerScore: this.gameState.leftPlayerScore,
              rightPlayerScore: this.gameState.rightPlayerScore,
              gameDuration: this.gameState.endTime,
              gameEndResult: this.gameState.gameEndResult ?? "",
              leftPlayerBallHit: this.gameState.leftPlayerBallHit,
              rightPlayerBallHit: this.gameState.rightPlayerBallHit,
              level: 5,
              matchPlayed: 1,
              matchWon: this.gameState.gameEndResult === "Won" ? 1 : 0,
              matchLost: this.gameState.gameEndResult === "Lost" ? 1 : 0,
              enemyId: this.gameState.enemyId, // Include
              userId: cuurrUser,
            };

            const currentUser = getCurrentUser();
            if (currentUser) {
              currentUser.level = 5;
              currentUser.matches_played = 1;
              currentUser.matches_won =
                this.gameState.gameEndResult === "Won" ? 1 : 0;
              currentUser.matches_lost =
                this.gameState.gameEndResult === "Lost" ? 1 : 0;
              if (this.gameState.playerId === 1) {
                if (this.gameState.gameEndResult === "Won")
                  this.updateUser(currentUser, true);
                else if (this.gameState.gameEndResult === "Lost")
                  this.updateUser(currentUser, false);
              } else if (this.gameState.playerId === 2) {
                if (this.gameState.gameEndResult === "Won")
                  this.updateUser(currentUser, true);
                else if (this.gameState.gameEndResult === "Lost")
                  this.updateUser(currentUser, false);
              }
            }
            this.sendPlayerData(playerData);
            return;
          }
          let hasWonPlayerOne: boolean = false;
          if (this.gameState.playerId === 1 && flag_one === true) {
            flag_one = false;

            const scoreFactor = 0.1;
            let levelGain: number = 0;
            if (this.gameState.leftPlayerBallHit !== 0)
              levelGain = this.gameState.leftPlayerBallHit * scoreFactor;
            this.gameState.matchPlayed =
              getOldDataOfCurrentUserData.matches_played + 1;
            if (this.gameState.gameEndResult === "Won") {
              hasWonPlayerOne = true;
              this.gameState.level +=
                getOldDataOfCurrentUserData.level + 1 + levelGain; // 1 is the win bonus
              this.gameState.matchLost =
                getOldDataOfCurrentUserData.matches_lost;
              this.gameState.matchWon =
                getOldDataOfCurrentUserData.matches_won + 1;
            } else if (this.gameState.gameEndResult === "Lost") {
              hasWonPlayerOne = false;
              if (getOldDataOfCurrentUserData.level - 1 < 0) {
                this.gameState.level = 0; // Ensure level never goes negative
              } else
                this.gameState.level = getOldDataOfCurrentUserData.level - 1; // Subtract penalty safely
              this.gameState.matchLost =
                getOldDataOfCurrentUserData.matches_lost + 1;
              this.gameState.matchWon = getOldDataOfCurrentUserData.matches_won;
            }
          }
          let hasWonPlayerTwo: boolean = false;
          if (this.gameState.playerId === 2 && flag_two === true) {
            flag_two = false;
            const scoreFactor = 0.1; // adjust this value to control how much each point increases the level
            let levelGain: number = 0;
            if (this.gameState.rightPlayerBallHit !== 0)
              levelGain = this.gameState.rightPlayerBallHit * scoreFactor;
            this.gameState.matchPlayed =
              getOldDataOfCurrentUserData.matches_played + 1;
            if (this.gameState.gameEndResult === "Won") {
              hasWonPlayerTwo = true;
              this.gameState.level =
                getOldDataOfCurrentUserData.level + 1 + levelGain; // 1 is the win bonus
              this.gameState.matchWon =
                getOldDataOfCurrentUserData.matches_won + 1;
              this.gameState.matchLost =
                getOldDataOfCurrentUserData.matches_lost;
            } else if (this.gameState.gameEndResult === "Lost") {
              hasWonPlayerTwo = false;
              if (getOldDataOfCurrentUserData.level - 1 < 0) {
                this.gameState.level = 0; // Ensure level never goes negative
              } else
                this.gameState.level = getOldDataOfCurrentUserData.level - 1; // Subtract penalty safely
              this.gameState.matchLost =
                getOldDataOfCurrentUserData.matches_lost + 1;
              this.gameState.matchWon = getOldDataOfCurrentUserData.matches_won;
            }

            // Ensure level stays non-negative
          }
          const currentUser = getCurrentUser();
          const playerData: PlayerData = {
            userName: this.deps.userName,
            matchId: this.gameState.matchId,
            playerId: this.gameState.playerId,
            leftPlayerScore: this.gameState.leftPlayerScore,
            rightPlayerScore: this.gameState.rightPlayerScore,
            gameDuration: this.gameState.endTime,
            gameEndResult: this.gameState.gameEndResult ?? "",
            leftPlayerBallHit: this.gameState.leftPlayerBallHit,
            rightPlayerBallHit: this.gameState.rightPlayerBallHit,
            level: this.gameState.level,
            matchPlayed: this.gameState.matchPlayed,
            matchWon: this.gameState.matchWon,
            matchLost: this.gameState.matchLost,
            enemyId: this.gameState.enemyId, // Include
            userId: currentUser?.userId ?? 0, // Include userId
          };
          this.sendPlayerData(playerData);

          if (currentUser) {
            currentUser.level = this.gameState.level;
            currentUser.matches_played = this.gameState.matchPlayed;
            currentUser.matches_won = this.gameState.matchWon;
            currentUser.matches_lost = this.gameState.matchLost;
            if (this.gameState.playerId === 1 && flag_update === true) {
              flag_update = false;
              this.updateUser(currentUser, hasWonPlayerOne);
            } else if (this.gameState.playerId === 2 && flag_update === true) {
              flag_update = false;
              this.updateUser(currentUser, hasWonPlayerTwo);
            }
          }
        })();
      }
    } catch (err) {
      // console.error("Error parsing game state:", err);
      this.deps.disconnectedResult.style.display = "block";
      setTimeout(() => {
        navigateTo("/arena");
      }, 3000);
    }
  }

  public animate(): void {
    this.draw();
    this.keysFunction();
    this.ballPositionUpdate();
    requestAnimationFrame(this.animate.bind(this));
  }
}

export function closeRemoteWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
