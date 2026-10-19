/* ==========================================================================
   Retro 8-Bit Umamusume Circuit Derby Mini-Game
   Theme: Gruvbox / Terminal Arcade (matches John Barry V. Blase Portfolio)
   Features:
   - Top Landscape Banner: Endless ambient animated pixel horse GIF loop
   - Windowed Arcade Mode: Click banner/Play button to expand into windowed stadium
   - Whole Circuit Track: Full stadium oval with 4 lanes, curves & laps
   - Umamusume Roster: 18 iconic runners randomly selected every race + Re-roll
   - Dynamic Racing AI: Pace styles (Nige, Senko, Sashi, Oikomi) & skill surges
   - Betting System: 10, 25, 50, ALL-IN with persistent localStorage coins
   - Live Terminal Announcer: Clean single-prefix commentary ticker
   ========================================================================== */

(function () {
  // --- 18 Umamusume Character Legends ---
  const UMAMUSUME_ROSTER = [
    { name: "Special Week", odds: 2.4, silk: "#f6929d", coat: "#4a2c11", style: "Sashi / Betweener", trait: "Miraculous Comeback · Devastating Stretch Surge" },
    { name: "Silence Suzuka", odds: 2.1, silk: "#82c896", coat: "#6d3b14", style: "Nige / Front Runner", trait: "Silence Pioneer · Blistering Early Escape" },
    { name: "Tokai Teio", odds: 3.2, silk: "#54a0ff", coat: "#7a4419", style: "Senko / Leader", trait: "Miracle Stride · High Agility Leader" },
    { name: "Oguri Cap", odds: 3.5, silk: "#a5b1c2", coat: "#c8d6e5", style: "Senko / Leader", trait: "Ash-Grey Miracle · Tireless Powerhouse" },
    { name: "Gold Ship", odds: 5.5, silk: "#eb3b5a", coat: "#dcdde1", style: "Oikomi / Chaser", trait: "Wild Free-Spirit · Unpredictable Gate Warp" },
    { name: "Mejiro McQueen", odds: 3.6, silk: "#a55eea", coat: "#574b90", style: "Senko / Leader", trait: "Graceful Noble · Infinite Stamina Maestro" },
    { name: "Daiwa Scarlet", odds: 2.8, silk: "#fc5c65", coat: "#773c18", style: "Nige / Front Runner", trait: "Proud Red Comet · Iron Will Pace Setter" },
    { name: "Vodka", odds: 4.0, silk: "#2f3542", coat: "#503018", style: "Sashi / Betweener", trait: "Fiery Champion · Explosive Final Dash" },
    { name: "Rice Shower", odds: 5.0, silk: "#3c40c6", coat: "#1e1e24", style: "Senko / Leader", trait: "Black Assassin · Relentless Grit & Stamina" },
    { name: "Twin Turbo", odds: 4.8, silk: "#00d2d3", coat: "#382010", style: "Nige / Front Runner", trait: "Full Throttle Turbo · Reckless Supersonic Burst" },
    { name: "Grass Wonder", odds: 4.2, silk: "#20bf6b", coat: "#693b16", style: "Sashi / Betweener", trait: "Quiet Samurai · Unflinching Precision Closer" },
    { name: "Symboli Rudolf", odds: 2.0, silk: "#2d3436", coat: "#3d2314", style: "Senko / Leader", trait: "The Emperor · Flawless Tactical Superiority" },
    { name: "Agnes Tachyon", odds: 4.5, silk: "#f7b731", coat: "#633917", style: "Sashi / Betweener", trait: "Mad Scientist · Hypersonic Laboratory Surge" },
    { name: "Kitasan Black", odds: 2.9, silk: "#e74c3c", coat: "#18181c", style: "Nige / Front Runner", trait: "Festival King · Unshakeable Frontline Dominance" },
    { name: "Satono Diamond", odds: 3.8, silk: "#2ed573", coat: "#563116", style: "Sashi / Betweener", trait: "Emerald Heiress · Elegant Long-Stride Closer" },
    { name: "Mayano Top Gun", odds: 4.4, silk: "#fa8231", coat: "#6a3c17", style: "Versatile", trait: "Sky Ace · Versatile Tactical Chameleon" },
    { name: "Nice Nature", odds: 6.2, silk: "#8854d0", coat: "#583017", style: "Sashi / Betweener", trait: "Beloved Fighter · Tenacious Underdog Kick" },
    { name: "Maruzensky", odds: 3.0, silk: "#e84118", coat: "#784212", style: "Nige / Front Runner", trait: "Supercar of the Turf · Peerless Raw Acceleration" }
  ];

  // Helper to pick 4 random distinct horses
  function getRandomField() {
    const shuffled = [...UMAMUSUME_ROSTER].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map((h, idx) => ({
      ...h,
      id: idx + 1
    }));
  }

  // --- Bankroll Persistence ---
  const STORAGE_KEY = "blase_derby_coins";
  function getCoins() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const val = parseInt(saved, 10);
      return isNaN(val) || val <= 0 ? 100 : val;
    } catch {
      return 100;
    }
  }
  function saveCoins(val) {
    try { localStorage.setItem(STORAGE_KEY, val.toString()); } catch {}
  }

  let coins = getCoins();
  let currentField = getRandomField();
  let selectedHorseId = 1;
  let selectedBet = 10;
  let isRacing = false;
  let isWindowOpen = false;

  // --- 8-Bit Pixel Horse Sprites (22x15 matrix) ---
  // 1: Body, 2: Mane/Tail, 3: Jockey/Silks, 4: Face/Eyes/Saddle
  const HORSE_FRAMES = [
    // Frame 0: Extended Gallop
    [
      "......................",
      "..........333.........",
      ".........33333........",
      ".........3333.........",
      "....2...11114.........",
      "...22..1111114..11....",
      "..22..1111111111111...",
      ".22...1111111111111...",
      "......111111111111....",
      ".......111...111......",
      "......11.......111....",
      ".....11.........111...",
      "....11...........111..",
      "....1.............11..",
      "......................"
    ],
    // Frame 1: Mid Reach
    [
      "......................",
      "..........333.........",
      ".........33333........",
      ".........3333.........",
      "....2...11114.........",
      "...22..1111114..11....",
      "..22..1111111111111...",
      ".22...1111111111111...",
      "......111111111111....",
      ".......111...111......",
      ".......11.....111.....",
      "......11.......111....",
      "......11........111...",
      ".....11..........11...",
      "......................"
    ],
    // Frame 2: Legs Gathered / High Jump
    [
      "......................",
      "..........333.........",
      ".........33333........",
      ".........3333.........",
      "....2...11114.........",
      "...22..1111114..11....",
      "..22..1111111111111...",
      ".22...1111111111111...",
      "......111111111111....",
      ".......111111111......",
      "........111.111.......",
      "........11...11.......",
      ".......11.....11......",
      ".......1.......1......",
      "......................"
    ],
    // Frame 3: Push-off Gallop
    [
      "......................",
      "..........333.........",
      ".........33333........",
      ".........3333.........",
      "....2...11114.........",
      "...22..1111114..11....",
      "..22..1111111111111...",
      ".22...1111111111111...",
      "......111111111111....",
      ".......111...111......",
      "......111.....11......",
      ".....111.......11.....",
      "....111.........11....",
      "...111...........1....",
      "......................"
    ]
  ];

  // Draw a pixel horse sprite
  function drawPixelHorse(ctx, horse, x, y, frameIdx, pixelSize, facingRight = true, leanAngle = 0) {
    const frame = HORSE_FRAMES[frameIdx % 4];
    ctx.save();
    ctx.translate(x, y);
    if (leanAngle !== 0) {
      ctx.rotate(leanAngle);
    }
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    const offsetX = -(22 * pixelSize) / 2;
    const offsetY = -(15 * pixelSize) / 2;

    for (let r = 0; r < 15; r++) {
      const row = frame[r];
      for (let c = 0; c < 22; c++) {
        const char = row[c];
        if (char === ".") continue;

        let col = horse.coat;
        if (char === "2") col = "#110b07"; // Mane/tail
        if (char === "3") col = horse.silk; // Silk/uniform color
        if (char === "4") col = "#d4be98"; // Face/bib

        ctx.fillStyle = col;
        ctx.fillRect(offsetX + c * pixelSize, offsetY + r * pixelSize, pixelSize, pixelSize);
      }
    }

    // Number bib
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(6, Math.floor(pixelSize * 3.5))}px monospace`;
    ctx.fillText(horse.id.toString(), offsetX + 9 * pixelSize, offsetY + 8 * pixelSize);

    ctx.restore();
  }

  // --- Top Landscape Banner Background Engine (Endless GIF Loop) ---
  let bannerAnimId = null;
  let bannerHorses = [
    { id: 1, name: "Special Week", silk: "#f6929d", coat: "#4a2c11", x: 80, speed: 1.8, frame: 0, tick: 0 },
    { id: 2, name: "Silence Suzuka", silk: "#82c896", coat: "#6d3b14", x: 260, speed: 2.1, frame: 1, tick: 2 },
    { id: 3, name: "Tokai Teio", silk: "#54a0ff", coat: "#7a4419", x: 440, speed: 1.9, frame: 2, tick: 4 },
    { id: 4, name: "Gold Ship", silk: "#eb3b5a", coat: "#dcdde1", x: 620, speed: 2.3, frame: 3, tick: 1 }
  ];

  function startBannerAnimation(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let trackOffset = 0;

    // Ambient floating sakura petals for the banner
    const petals = Array.from({ length: 12 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 70,
      vx: 0.8 + Math.random() * 1.2,
      vy: 0.3 + Math.random() * 0.5,
      size: 3 + Math.random() * 3,
      alpha: 0.3 + Math.random() * 0.5
    }));

    function loop() {
      const w = canvas.width;
      const h = canvas.height;
      trackOffset = (trackOffset + 3.5) % 40;

      // Dark turf base
      ctx.fillStyle = "#0c120e";
      ctx.fillRect(0, 0, w, h);

      // Grass strip texture & track lane
      ctx.fillStyle = "#152018";
      ctx.fillRect(0, 14, w, h - 28);

      // Parallax track markers
      ctx.strokeStyle = "rgba(184, 197, 114, 0.22)";
      ctx.lineWidth = 1;
      ctx.setLineDash([10, 14]);
      ctx.beginPath();
      ctx.moveTo(-trackOffset, Math.floor(h / 2));
      ctx.lineTo(w + 40, Math.floor(h / 2));
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddock white railing (top & bottom)
      ctx.fillStyle = "rgba(212, 190, 152, 0.55)";
      ctx.fillRect(0, 10, w, 2);
      ctx.fillRect(0, h - 12, w, 2);

      // Paddock posts
      for (let px = -trackOffset; px < w + 40; px += 45) {
        ctx.fillRect(px, 6, 3, 9);
        ctx.fillRect(px, h - 14, 3, 9);
      }

      // Draw horses running horizontally in infinite loop
      bannerHorses.forEach((bh, i) => {
        bh.x += bh.speed;
        if (bh.x > w + 80) {
          bh.x = -80;
          bh.speed = 1.8 + Math.random() * 1.0;
        }

        bh.tick++;
        if (bh.tick % 5 === 0) {
          bh.frame = (bh.frame + 1) % 4;
        }

        const horseY = 16 + i * 18;

        // Dust particles behind horse
        ctx.fillStyle = "rgba(212, 190, 152, 0.35)";
        ctx.fillRect(bh.x - 22, horseY + 12, 6, 3);
        ctx.fillRect(bh.x - 30, horseY + 15, 8, 3);

        // Draw pixel horse (larger pixel size 1.65 for high visibility)
        drawPixelHorse(ctx, bh, bh.x, horseY, bh.frame, 1.65, true, 0);
      });

      // Drifting ambient petals
      petals.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > w + 20) p.x = -20;
        if (p.y > h + 10) p.y = -10;

        ctx.fillStyle = `rgba(255, 183, 197, ${p.alpha})`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      bannerAnimId = requestAnimationFrame(loop);
    }

    if (bannerAnimId) cancelAnimationFrame(bannerAnimId);
    bannerAnimId = requestAnimationFrame(loop);
  }

  // --- Oval Circuit Mathematics & Simulation ---
  /*
     Circuit geometry:
     Canvas: 780 x 300
     Left bend center: (200, 150), Right bend center: (580, 150)
     Straight length: L = 380 (x: 200 to 580)
     4 Concentric Lanes: Radii R = [74, 88, 102, 116]
     Lanes 0..3 (Inside rail to outside rail)
     Direction: Counter-Clockwise
     1. Bottom Straight: x: 390 -> 580 (running right)
     2. Right Bend: (580, 150) curving from bottom to top (theta: PI/2 -> -PI/2)
     3. Top Straight (Backstretch): x: 580 -> 200 (running left)
     4. Left Bend: (200, 150) curving from top to bottom (theta: -PI/2 -> -3*PI/2)
     5. Bottom Straight Home Stretch: x: 200 -> 390 (Checkered Finish Line at 390)
  */

  function getLaneGeometry(laneIdx) {
    const R = 74 + laneIdx * 14;
    const L = 380;
    const arcLen = Math.PI * R;
    const totalLap = 2 * L + 2 * arcLen;
    return { R, L, arcLen, totalLap };
  }

  function getCircuitPosition(laneIdx, distance) {
    const { R, L, arcLen, totalLap } = getLaneGeometry(laneIdx);
    const d = distance % totalLap;

    const startOffset = L / 2; // Start line is at midpoint of bottom straight (x = 390)

    // Segment 1: Bottom Straight (from x = 390 to 580)
    // Distance on this seg: 190
    if (d < startOffset) {
      const x = 390 + d;
      const y = 150 + R;
      return { x, y, facingRight: true, leanAngle: 0, sector: "Home Straight" };
    }

    // Segment 2: Right Bend (Turns 1 & 2)
    const seg2Start = startOffset;
    if (d < seg2Start + arcLen) {
      const progress = (d - seg2Start) / arcLen;
      const theta = Math.PI / 2 - progress * Math.PI; // PI/2 -> -PI/2
      const x = 580 + R * Math.cos(theta);
      const y = 150 + R * Math.sin(theta);
      const lean = -Math.sin(progress * Math.PI) * 0.25; // Bank lean
      const facing = theta > 0;
      return { x, y, facingRight: facing, leanAngle: lean, sector: "1st & 2nd Turn" };
    }

    // Segment 3: Top Straight (Backstretch, x: 580 to 200)
    const seg3Start = seg2Start + arcLen;
    if (d < seg3Start + L) {
      const progress = (d - seg3Start);
      const x = 580 - progress;
      const y = 150 - R;
      return { x, y, facingRight: false, leanAngle: 0, sector: "Backstretch 800m" };
    }

    // Segment 4: Left Bend (Turns 3 & 4 into Home Stretch)
    const seg4Start = seg3Start + L;
    if (d < seg4Start + arcLen) {
      const progress = (d - seg4Start) / arcLen;
      const theta = -Math.PI / 2 - progress * Math.PI; // -PI/2 -> -3*PI/2
      const x = 200 + R * Math.cos(theta);
      const y = 150 + R * Math.sin(theta);
      const lean = Math.sin(progress * Math.PI) * 0.25;
      const facing = theta > -Math.PI;
      return { x, y, facingRight: facing, leanAngle: lean, sector: "Final Turn 400m" };
    }

    // Segment 5: Bottom Straight approach to Finish Line (x: 200 to 390)
    const seg5Start = seg4Start + arcLen;
    const progress = d - seg5Start;
    const x = 200 + progress;
    const y = 150 + R;
    return { x, y, facingRight: true, leanAngle: 0, sector: "FINAL SPRINT" };
  }

  // --- Mount & UI Logic ---
  function mountDerbyApp() {
    // 1. Mount Top Landscape Banner
    const topBar = document.getElementById("derby-top-bar");
    if (!topBar) return;

    topBar.innerHTML = `
      <div class="derby-top-container">
        <!-- Ambient Animated Background Canvas (GIF-Style Loop) -->
        <canvas id="derby-banner-canvas" class="derby-banner-canvas" width="1200" height="96"></canvas>
        <div class="derby-banner-vignette"></div>

        <!-- Landscape Foreground Bar -->
        <div class="derby-banner-content">
          <div class="derby-banner-left">
            <span class="derby-cli-pill">
              <span class="text-terminal font-bold">$</span> ./uma-derby.sh
            </span>
            <span class="derby-pulse-badge">
              <span class="pulse-dot"></span> LIVE CIRCUIT
            </span>
            <div class="derby-coins-pill" id="banner-coins-display" title="Your Bankroll">
              <span class="coin-icon">🪙</span>
              <span class="coin-val" id="banner-coins-val">${coins}</span>
              <span class="coin-lbl">COINS</span>
            </div>
          </div>

          <div class="derby-banner-center">
            <span class="derby-banner-ticker-icon">🏇</span>
            <span class="derby-banner-ticker-text" id="banner-ticker-msg">Tokyo Turf 1600m · Special Week, Silence Suzuka & field ready in the paddock</span>
          </div>

          <div class="derby-banner-right">
            <button type="button" class="derby-open-window-btn" id="derby-open-window-btn">
              <span>🏇 PLAY DERBY</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Start background GIF canvas loop
    const bannerCanvas = document.getElementById("derby-banner-canvas");
    startBannerAnimation(bannerCanvas);

    // 2. Create Windowed Arcade Modal (appended to body)
    let modalRoot = document.getElementById("derby-modal-overlay");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "derby-modal-overlay";
      modalRoot.className = "derby-modal-overlay";
      modalRoot.style.display = "none";
      document.body.appendChild(modalRoot);
    }

    modalRoot.innerHTML = `
      <div class="derby-window-card">
        <!-- Retro Window Titlebar -->
        <div class="derby-window-titlebar">
          <div class="window-dots">
            <span class="dot dot-red" id="window-close-dot" title="Close Window"></span>
            <span class="dot dot-yellow" id="window-min-dot" title="Minimize Window"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="window-title">
            <span>🏇 UMAMUSUME DERBY CIRCUIT · TOKYO RACECOURSE (TURF 1600M)</span>
          </div>
          <div class="window-actions">
            <div class="derby-coins-badge" title="Bankroll">
              <span class="coin-icon">🪙</span>
              <span class="coin-val" id="modal-coins-val">${coins}</span>
              <span class="coin-txt">COINS</span>
            </div>
            <button type="button" class="window-control-btn" id="modal-minimize-btn" title="Minimize to top banner">🗕</button>
            <button type="button" class="window-control-btn" id="modal-close-btn" title="Close">✕</button>
          </div>
        </div>

        <!-- Window Body -->
        <div class="derby-window-body">
          <!-- Paddock / Horse Selection Header -->
          <div class="paddock-toolbar">
            <div class="paddock-heading">
              <span class="text-terminal font-bold mr-1">▸</span>
              <span>PADDOCK FIELD · SELECT YOUR CHAMPION</span>
            </div>
            <button type="button" class="derby-reroll-btn" id="derby-reroll-btn" title="Pick 4 new Umamusume runners">
              <span>🎲 NEW FIELD</span>
            </button>
          </div>

          <!-- 4 Umamusume Selection Cards -->
          <div class="derby-horses-grid" id="horses-grid">
            ${renderHorseButtons(currentField, selectedHorseId)}
          </div>

          <!-- Betting Controls Bar -->
          <div class="derby-wager-row">
            <div class="wager-selector">
              <span class="wager-label">WAGER:</span>
              <button type="button" class="wager-chip ${selectedBet === 10 ? 'active' : ''}" data-bet="10">10</button>
              <button type="button" class="wager-chip ${selectedBet === 25 ? 'active' : ''}" data-bet="25">25</button>
              <button type="button" class="wager-chip ${selectedBet === 50 ? 'active' : ''}" data-bet="50">50</button>
              <button type="button" class="wager-chip ${selectedBet === 'all' ? 'active' : ''}" data-bet="all">ALL-IN</button>
            </div>
            <button type="button" class="derby-start-btn" id="circuit-start-btn">
              <span>🏇 START CIRCUIT RACE</span>
            </button>
          </div>

          <!-- Oval Circuit Track Canvas -->
          <div class="derby-track-wrap circuit-wrap">
            <canvas id="circuit-canvas" class="derby-circuit-canvas" width="780" height="300"></canvas>
            <div class="circuit-sector-badge" id="circuit-sector-badge">SECTOR: PADDOCK GATES</div>
          </div>

          <!-- Announcer & Victory Result Bar -->
          <div class="derby-footer-bar">
            <div class="derby-announcer">
              <span class="ticker-prompt">[ANN]</span>
              <span class="ticker-text" id="circuit-ticker-msg">Gates are locked. Select your champion & place your wager to begin the circuit championship!</span>
            </div>
            <div class="derby-result-banner" id="circuit-result-banner" style="display:none;"></div>
          </div>
        </div>
      </div>
    `;

    initArcadeEvents();
    initCircuitCanvas();
  }

  function renderHorseButtons(field, activeId) {
    return field.map(h => `
      <button type="button" class="derby-horse-btn ${h.id === activeId ? 'selected' : ''}" data-horse="${h.id}" style="--horse-color: ${h.silk}">
        <div class="horse-btn-top">
          <span class="horse-badge">#${h.id} ${h.style.split('/')[0].trim()}</span>
          <span class="horse-odds">${h.odds.toFixed(1)}x</span>
        </div>
        <div class="horse-btn-name">${h.name}</div>
        <div class="horse-btn-trait">${h.trait}</div>
      </button>
    `).join('');
  }

  // --- Arcade Event Listeners ---
  function initArcadeEvents() {
    const modalOverlay = document.getElementById("derby-modal-overlay");
    const openBtn = document.getElementById("derby-open-window-btn");
    const topBar = document.getElementById("derby-top-bar");
    const closeBtn = document.getElementById("modal-close-btn");
    const minBtn = document.getElementById("modal-minimize-btn");
    const closeDot = document.getElementById("window-close-dot");
    const minDot = document.getElementById("window-min-dot");
    const rerollBtn = document.getElementById("derby-reroll-btn");

    function openWindow() {
      isWindowOpen = true;
      modalOverlay.style.display = "flex";
      updateCoinDisplays();
      drawStaticCircuit();
    }

    function closeWindow() {
      isWindowOpen = false;
      modalOverlay.style.display = "none";
      updateCoinDisplays();
    }

    if (openBtn) openBtn.onclick = openWindow;
    if (topBar) {
      topBar.onclick = (e) => {
        // Prevent clicks on action buttons from double-triggering
        if (!e.target.closest("button")) {
          openWindow();
        }
      };
    }

    if (closeBtn) closeBtn.onclick = closeWindow;
    if (minBtn) minBtn.onclick = closeWindow;
    if (closeDot) closeDot.onclick = closeWindow;
    if (minDot) minDot.onclick = closeWindow;

    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) closeWindow();
    };

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isWindowOpen) closeWindow();
    });

    // Re-roll Umamusume runners
    if (rerollBtn) {
      rerollBtn.onclick = () => {
        if (isRacing) return;
        currentField = getRandomField();
        selectedHorseId = 1;
        document.getElementById("horses-grid").innerHTML = renderHorseButtons(currentField, selectedHorseId);
        bindHorseClicks();
        const ticker = document.getElementById("circuit-ticker-msg");
        if (ticker) ticker.textContent = `New field entered the paddock! Pick your champion for the upcoming Tokyo Turf cup.`;
        drawStaticCircuit();
      };
    }

    bindHorseClicks();
    bindWagerChips();
  }

  function bindHorseClicks() {
    const horseBtns = document.querySelectorAll(".derby-horse-btn");
    const tickerMsg = document.getElementById("circuit-ticker-msg");
    horseBtns.forEach(btn => {
      btn.onclick = () => {
        if (isRacing) return;
        horseBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedHorseId = parseInt(btn.dataset.horse, 10);
        const horse = currentField.find(h => h.id === selectedHorseId);
        if (tickerMsg && horse) {
          tickerMsg.textContent = `Selected #${horse.id} ${horse.name} (${horse.odds.toFixed(1)}x odds). Strategy: ${horse.trait}`;
        }
      };
    });
  }

  function bindWagerChips() {
    const wagerChips = document.querySelectorAll(".wager-chip");
    wagerChips.forEach(chip => {
      chip.onclick = () => {
        if (isRacing) return;
        wagerChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        selectedBet = chip.dataset.bet === "all" ? "all" : parseInt(chip.dataset.bet, 10);
      };
    });
  }

  function updateCoinDisplays() {
    const bannerVal = document.getElementById("banner-coins-val");
    const modalVal = document.getElementById("modal-coins-val");
    if (bannerVal) bannerVal.textContent = coins;
    if (modalVal) modalVal.textContent = coins;
  }

  // --- Oval Circuit Canvas Rendering & Animation ---
  let circuitCtx = null;
  let raceAnimId = null;

  function initCircuitCanvas() {
    const canvas = document.getElementById("circuit-canvas");
    if (!canvas) return;
    circuitCtx = canvas.getContext("2d");

    const startBtn = document.getElementById("circuit-start-btn");
    if (startBtn) {
      startBtn.onclick = handleStartRace;
    }

    drawStaticCircuit();
  }

  // Draw circuit track elements
  function drawTrackBase(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);

    // Infield & Outfield Lawn
    ctx.fillStyle = "#111612";
    ctx.fillRect(0, 0, width, height);

    // Track Oval Dirt Ribbon (Stroke 4 lanes)
    // Center bends: (200, 150) and (580, 150), straights L = 380
    // Total lane band width = 14 * 4 = 56px, centered on radius ~95
    ctx.lineCap = "round";

    // Track surface band
    ctx.strokeStyle = "#251c14";
    ctx.lineWidth = 62;
    drawStadiumPath(ctx, 200, 580, 150, 95);

    // Outer turf border rail
    ctx.strokeStyle = "rgba(212, 190, 152, 0.35)";
    ctx.lineWidth = 2;
    drawStadiumPath(ctx, 200, 580, 150, 126);

    // Inner turf border rail
    ctx.strokeStyle = "rgba(212, 190, 152, 0.35)";
    ctx.lineWidth = 2;
    drawStadiumPath(ctx, 200, 580, 150, 66);

    // 4 Distinct Lanes (Dashed dividing lines)
    for (let i = 0; i <= 4; i++) {
      const r = 66 + i * 14;
      ctx.strokeStyle = i === 0 || i === 4 ? "rgba(184, 197, 114, 0.4)" : "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      if (i > 0 && i < 4) {
        ctx.setLineDash([4, 6]);
      } else {
        ctx.setLineDash([]);
      }
      drawStadiumPath(ctx, 200, 580, 150, r);
    }
    ctx.setLineDash([]);

    // Infield Garden Decoration
    ctx.fillStyle = "#152018";
    ctx.beginPath();
    ctx.ellipse(390, 150, 130, 48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(184, 197, 114, 0.15)";
    ctx.stroke();

    ctx.fillStyle = "rgba(212, 190, 152, 0.4)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("TOKYO RACECOURSE · 1600M TURF", 390, 146);
    ctx.fillStyle = "rgba(224, 176, 94, 0.7)";
    ctx.font = "8px monospace";
    ctx.fillText("★ UMAMUSUME DERBY CIRCUIT ★", 390, 160);

    // Checkered Finish Line Banner on bottom straight (x = 390, y = 150 + 66 to 122)
    const finishX = 390;
    const checkSize = 5;
    for (let cy = 150 + 66; cy < 150 + 122; cy += checkSize) {
      for (let cx = finishX - 5; cx <= finishX + 5; cx += checkSize) {
        ctx.fillStyle = (Math.floor(cx / checkSize) + Math.floor(cy / checkSize)) % 2 === 0 ? "#ffffff" : "#0d0e0f";
        ctx.fillRect(cx, cy, checkSize, checkSize);
      }
    }

    // Finish / Start Posts
    ctx.fillStyle = "#e0b05e";
    ctx.fillRect(finishX - 6, 150 + 60, 12, 4);
    ctx.fillRect(finishX - 6, 150 + 124, 12, 4);

    // Sector Labels
    ctx.font = "8px monospace";
    ctx.fillStyle = "rgba(212, 190, 152, 0.6)";
    ctx.fillText("[1ST CORNER]", 630, 80);
    ctx.fillText("[BACKSTRETCH]", 390, 32);
    ctx.fillText("[FINAL CORNER]", 150, 80);
    ctx.fillText("FINISH ►", finishX - 25, 150 + 96);
  }

  function drawStadiumPath(ctx, x1, x2, cy, r) {
    ctx.beginPath();
    // Bottom straight (left to right)
    ctx.moveTo(x1, cy + r);
    ctx.lineTo(x2, cy + r);
    // Right bend (bottom to top)
    ctx.arc(x2, cy, r, Math.PI / 2, -Math.PI / 2, true);
    // Top straight (right to left)
    ctx.lineTo(x1, cy - r);
    // Left bend (top to bottom)
    ctx.arc(x1, cy, r, -Math.PI / 2, Math.PI / 2, true);
    ctx.stroke();
  }

  function drawStaticCircuit() {
    if (!circuitCtx) return;
    drawTrackBase(circuitCtx, 780, 300);

    // Draw horses in starting stalls at the finish line
    currentField.forEach((h, idx) => {
      const pos = getCircuitPosition(idx, 0);
      drawPixelHorse(circuitCtx, h, pos.x, pos.y, 0, 1.4, true, 0);
    });
  }

  // --- Dynamic Circuit Race Simulation ---
  function handleStartRace() {
    if (isRacing) return;

    let wager = selectedBet === "all" ? coins : selectedBet;
    if (coins <= 0) {
      coins = 50;
      saveCoins(coins);
      updateCoinDisplays();
    }
    if (wager > coins) wager = coins;
    if (wager <= 0) return;

    // Deduct coins upfront
    coins -= wager;
    saveCoins(coins);
    updateCoinDisplays();

    isRacing = true;
    const startBtn = document.getElementById("circuit-start-btn");
    const tickerMsg = document.getElementById("circuit-ticker-msg");
    const sectorBadge = document.getElementById("circuit-sector-badge");
    const resultBanner = document.getElementById("circuit-result-banner");
    const rerollBtn = document.getElementById("derby-reroll-btn");

    if (startBtn) {
      startBtn.classList.add("disabled");
      startBtn.innerHTML = "<span>🏇 RACING...</span>";
    }
    if (rerollBtn) rerollBtn.style.opacity = "0.5";
    if (resultBanner) resultBanner.style.display = "none";

    // Initialize 4 runners along the circuit
    // Total circuit lap is ~1310px
    const chosenHorse = currentField.find(h => h.id === selectedHorseId);
    tickerMsg.textContent = `They're off! Clean break as all 4 contenders charge out of the gates! You backed #${chosenHorse.id} ${chosenHorse.name} for ${wager} coins!`;

    // Strategy profile modifiers:
    // Nige (Front Runner): Fast early, decelerates late
    // Senko (Leader): Steady consistent pace
    // Sashi (Betweener): Hangs back early, massive surge on final turn
    // Oikomi (Chaser): Last early, supersonic rocket in final stretch
    const runners = currentField.map((h, i) => {
      const geom = getLaneGeometry(i);
      const totalLap = geom.totalLap;

      // Base speeds
      let baseSpeed = 2.2 + (Math.random() * 0.4);
      if (h.odds <= 2.2) baseSpeed += 0.35;
      else if (h.odds <= 3.2) baseSpeed += 0.22;
      else if (h.odds <= 4.5) baseSpeed += 0.12;

      return {
        horse: h,
        lane: i,
        distance: 0,
        totalLap: totalLap,
        baseSpeed: baseSpeed,
        currentSpeed: baseSpeed,
        stamina: 100,
        skillTriggered: false,
        finished: false,
        finishTime: 0,
        frame: 0,
        frameTick: 0
      };
    });

    let raceStartTime = performance.now();
    let finishOrder = [];
    let lastAnnounceSector = "";

    function raceStep(now) {
      const elapsedSec = (now - raceStartTime) / 1000;
      drawTrackBase(circuitCtx, 780, 300);

      let allFinished = true;

      // Update positions
      runners.forEach(r => {
        if (!r.finished) {
          allFinished = false;

          // Personality & Sector logic
          const progressPct = r.distance / r.totalLap;

          if (r.horse.style.includes("Nige")) {
            // Front Runner bursts early
            if (progressPct < 0.4) r.currentSpeed = r.baseSpeed * 1.25;
            else if (progressPct > 0.75) r.currentSpeed = r.baseSpeed * (0.88 + Math.random() * 0.2);
          } else if (r.horse.style.includes("Sashi")) {
            // Betweener saves stamina, bursts on 3rd & 4th turn
            if (progressPct < 0.5) r.currentSpeed = r.baseSpeed * 0.95;
            else if (progressPct >= 0.6) r.currentSpeed = r.baseSpeed * 1.35;
          } else if (r.horse.style.includes("Oikomi")) {
            // Chaser rocket on final straight
            if (progressPct < 0.65) r.currentSpeed = r.baseSpeed * 0.92;
            else if (progressPct >= 0.75) {
              r.currentSpeed = r.baseSpeed * 1.48;
              r.skillTriggered = true;
            }
          } else {
            // Senko Leader: steady with random kick
            r.currentSpeed = r.baseSpeed * (0.98 + Math.random() * 0.15);
          }

          // Random pace oscillation
          r.currentSpeed += (Math.random() - 0.48) * 0.18;
          r.distance += r.currentSpeed;

          // Animation frame
          r.frameTick++;
          if (r.frameTick % 4 === 0) {
            r.frame = (r.frame + 1) % 4;
          }

          // Crossing the checkered line (1 full circuit lap)
          if (r.distance >= r.totalLap) {
            r.distance = r.totalLap;
            r.finished = true;
            r.finishTime = elapsedSec;
            finishOrder.push(r);
          }
        }

        // Draw the runner at current circuit coordinates
        const pos = getCircuitPosition(r.lane, r.distance);

        // Dust particles if moving
        if (!r.finished) {
          circuitCtx.fillStyle = "rgba(212, 190, 152, 0.3)";
          circuitCtx.fillRect(pos.x - (pos.facingRight ? 12 : -12), pos.y + 4, 4, 3);
        }

        // Skill aura if surging
        if (r.skillTriggered && !r.finished) {
          circuitCtx.strokeStyle = r.horse.silk;
          circuitCtx.lineWidth = 1.5;
          circuitCtx.beginPath();
          circuitCtx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
          circuitCtx.stroke();
        }

        drawPixelHorse(circuitCtx, r.horse, pos.x, pos.y, r.frame, 1.4, pos.facingRight, pos.leanAngle);
      });

      // Announcer Sector Commentary
      const leader = [...runners].sort((a, b) => b.distance - a.distance)[0];
      const leaderPos = getCircuitPosition(leader.lane, leader.distance);

      if (sectorBadge) {
        sectorBadge.textContent = `SECTOR: ${leaderPos.sector.toUpperCase()} (${Math.floor((leader.distance / leader.totalLap) * 100)}%)`;
      }

      if (leaderPos.sector !== lastAnnounceSector) {
        lastAnnounceSector = leaderPos.sector;
        if (leaderPos.sector === "1st & 2nd Turn") {
          tickerMsg.textContent = `Heading into the 1st Corner — #${leader.horse.id} ${leader.horse.name} sets the tempo on the rails!`;
        } else if (leaderPos.sector === "Backstretch 800m") {
          tickerMsg.textContent = `Down the backstretch! The pack is tightening as contenders prepare their final maneuvers!`;
        } else if (leaderPos.sector === "Final Turn 400m") {
          tickerMsg.textContent = `Rounding the final corner into the straight! Whips are flashing, here comes the surge!`;
        } else if (leaderPos.sector === "FINAL SPRINT") {
          tickerMsg.textContent = `FINAL 200 METERS! #${leader.horse.id} ${leader.horse.name} dueling for the wire! Who will take the crown?!`;
        }
      }

      if (!allFinished) {
        raceAnimId = requestAnimationFrame(raceStep);
      } else {
        finishCircuitRace(finishOrder, wager);
      }
    }

    if (raceAnimId) cancelAnimationFrame(raceAnimId);
    raceAnimId = requestAnimationFrame(raceStep);
  }

  function finishCircuitRace(order, wager) {
    isRacing = false;
    const startBtn = document.getElementById("circuit-start-btn");
    const tickerMsg = document.getElementById("circuit-ticker-msg");
    const resultBanner = document.getElementById("circuit-result-banner");
    const rerollBtn = document.getElementById("derby-reroll-btn");

    if (startBtn) {
      startBtn.classList.remove("disabled");
      startBtn.innerHTML = "<span>🏇 START CIRCUIT RACE</span>";
    }
    if (rerollBtn) rerollBtn.style.opacity = "1";

    const winner = order[0].horse;
    const isWin = winner.id === selectedHorseId;
    const payout = Math.floor(wager * winner.odds);

    if (resultBanner) {
      resultBanner.style.display = "flex";
      if (isWin) {
        coins += payout;
        saveCoins(coins);
        updateCoinDisplays();

        resultBanner.className = "derby-result-banner win";
        resultBanner.innerHTML = `
          <div class="result-text">
            <span class="win-tag">🏆 VICTORY!</span>
            <span>#${winner.id} ${winner.name} captures the Tokyo Turf Cup! You won <strong>+${payout} COINS</strong>!</span>
          </div>
        `;
        tickerMsg.textContent = `PHOTO FINISH! #${winner.id} ${winner.name} wins it in grand fashion! Superb victory!`;
      } else {
        saveCoins(coins);
        updateCoinDisplays();

        resultBanner.className = "derby-result-banner lose";
        resultBanner.innerHTML = `
          <div class="result-text">
            <span class="lose-tag">RACE CONCLUDED</span>
            <span>Winner: #${winner.id} ${winner.name}. You lost ${wager} coins.</span>
          </div>
        `;
        tickerMsg.textContent = `Crown awarded to #${winner.id} ${winner.name}! Better luck in the next race!`;
      }
    }

    // Emergency bailout if broke
    if (coins <= 0) {
      setTimeout(() => {
        coins = 50;
        saveCoins(coins);
        updateCoinDisplays();
        if (tickerMsg) {
          tickerMsg.textContent = "Bonus: Received +50 complimentary coins from the Tokyo Turf stewards!";
        }
      }, 1500);
    }
  }

  // Auto-mount when page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountDerbyApp);
  } else {
    mountDerbyApp();
  }
})();
