import { navigateTo } from "@/utils/navigate-to-link";
import { initGameThemeToggle } from "@/utils/game-theme-toggle";
import { styles } from "@/styles/styles";

export function LocalGame() {
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

  // Create a container element for the game
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

   	<div class="flex items-center justify-center flex-col w-full" style="min-height:${canvasHeight}px;">
      <div class="score flex justify-center gap-20 md:gap-60 w-full mb-4 transition-all duration-300">
		<span id="leftPlayerScoreLocal" class="text-3xl md:text-5xl font-semibold font-orbitron">0</span>
		<span id="rightPlayerScoreLocal" class="text-3xl md:text-5xl font-semibold font-orbitron">0</span>
	  </div>

      <div class="flex justify-center w-full pb-8">
		<canvas class="${styles.gameCanvas}"
        		id="canvas"
        		width=${canvasWidth}
        		height=${canvasHeight}>
      	</canvas>
      </div>
  	</div>

    <div id="gameTab"
    	class="game-tab ${styles.gameTab} hidden">
    	  <h2 class="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Match Complete</h2>
      	  <p id="result" class="text-xl mt-1 font-medium">Right Side Dominates</p>
      	  <button id="restart" class="game-btn text-white mt-6 font-bold py-3 px-8 rounded-xl text-lg md:text-xl shadow-md tracking-wide transition-all duration-300">
        	Challenge Again
      	  </button>
    </div>
`;

  const startMessage = document.createElement("div");
  startMessage.id = "startMessage";
  startMessage.className =
    "backdrop-blur-md absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 text-center text-2xl md:text-3xl font-bold text-pong-sport-muted px-6 py-4 rounded-xl shadow-lg flex flex-col gap-3 items-center justify-center";
  startMessage.innerHTML = `
  <p>Press <span class="text-pong-dark-accent">F</span> to Serve</p>
  <p class="text-sm mt-2 font-normal">Welcome to the BHV Lounge — let the rally begin.</p>
`;
  container.appendChild(startMessage);

  // Initialize game elements
  const canvas = container.querySelector("#canvas") as HTMLCanvasElement;
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
  const exit = container.querySelector("#exit") as HTMLElement;

  exit.addEventListener("click", () => {
    navigateTo("/arena");
  });

  // Game state and logic
  let socketLocal: WebSocket;
  let keys: { [key: string]: boolean } = {};
  let gameStarted = false;

  // Initialize the game
  function init() {
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "f" && !gameStarted) {
        gameStarted = true;
        startMessage.style.display = "none";
        startGame();
      }
    });
  }

  // Function to start the game
  function startGame() {
    socketLocal = new WebSocket(`wss://${window.location.host}/game/ws`);

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
      socketLocal,
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

    flow.animate();
  }

  window.addEventListener("resize", (e) => {
    e.preventDefault();
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

  // Call the init function to set up the game
  init();

  // Call after DOM is ready

  return container;
}

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

// Modified FlowFieldLocal class
class FlowFieldLocal {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private keys: { [key: string]: boolean };
  private gameState: GameStateLocal;
  private canvasWidth: number;
  private canvasHeight: number;
  private ballPulse: number = 0;

  private domElements: {
    rightPlayerScoreLocal: HTMLElement;
    leftPlayerScoreLocal: HTMLElement;
    gameTab: HTMLElement;
    result: HTMLElement;
    restart: HTMLElement;
    socketLocal: WebSocket;
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    keys: { [key: string]: boolean },
    domElements: {
      rightPlayerScoreLocal: HTMLElement;
      leftPlayerScoreLocal: HTMLElement;
      gameTab: HTMLElement;
      result: HTMLElement;
      restart: HTMLElement;
      socketLocal: WebSocket;
    }
  ) {
    this.width = 10;
    this.height = 100;
    this.canvasWidth = 1000;
    this.canvasHeight = 600;
    this.ctx = ctx;
    this.keys = keys;
    this.domElements = domElements;
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

    // Left paddle
    this.ctx.fillStyle = isDark ? "#00B894" : "#FFD700";
    this.ctx.fillRect(10, this.gameState.paddleLeftY, this.width, this.height);
    this.ctx.strokeRect(
      10,
      this.gameState.paddleLeftY,
      this.width,
      this.height
    );

    // Right paddle
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

    // names
    // this.ctx.save();
    // this.ctx.font = "bold 22px Orbitron, sans-serif";
    // this.ctx.fillStyle = isDark ? "#FFF" : "#000";
    // this.ctx.textAlign = "left";
    // this.ctx.fillText("Left Player", 20, 40);

    // this.ctx.textAlign = "right";
    // this.ctx.fillText("Right Player", this.canvasWidth - 20, 40);
    // this.ctx.restore();
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

    this.domElements.gameTab.style.display = "flex";
    this.domElements.socketLocal.close();

    this.domElements.restart.addEventListener("click", () => {
      this.domElements.gameTab.style.display = "none";
      const newSocket = new WebSocket(`wss://${window.location.host}/game/ws`);
      this.domElements.socketLocal = newSocket;
      newSocket.onmessage = (event: MessageEvent) => {
        this.updateGameState(event.data);
      };
    });
  }
  public updateGameState(data: string): void {
    this.gameState = JSON.parse(data);
    this.domElements.rightPlayerScoreLocal.textContent =
      this.gameState.rightPlayerScore.toString();
    this.domElements.leftPlayerScoreLocal.textContent =
      this.gameState.leftPlayerScore.toString();
    if (this.gameState.rightPlayerScore === 5) {
      this.domElements.result.innerText =
        "Right Side Triumphs! A well-earned victory.";
      this.setInitialStat();
    }
    if (this.gameState.leftPlayerScore === 5) {
      this.domElements.result.innerText =
        "Left Side Prevails! The rally ends in glory.";
      this.setInitialStat();
    }
  }

  private ballPositionUpdate(): void {
    if (this.domElements.socketLocal.readyState === WebSocket.OPEN) {
      this.domElements.socketLocal.send(JSON.stringify(this.gameState));
    }
  }

  public animate(): void {
    this.draw();
    this.keysFunction();
    this.ballPositionUpdate();
    requestAnimationFrame(this.animate.bind(this));
  }
}
