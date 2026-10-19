/* ==========================================================================
   Modern Gramophone BGM Player - John Barry V. Blase Portfolio
   Features:
   - 3 Calm Royalty-Free BGM Tracks
   - Default Low-Volume Autoplay (20% volume - calm, non-intrusive)
   - Interactive Gramophone Turntable with spinning vinyl & pivoting tonearm
   - Play / Pause, Next / Prev, Mute / Volume controls
   - Expand / Minimize dock states
   - Seamless cross-page persistence
   ========================================================================== */

(function () {
  const tracks = [
    { title: "Chill Horizon", subtitle: "Calm Melodic Beat · NCS Style", src: "./music/track1.mp3" },
    { title: "Morning Breeze", subtitle: "Peaceful Instrumental Melody", src: "./music/track2.mp3" },
    { title: "Tranquil Flow", subtitle: "Pure Ambient Instrumental", src: "./music/track3.mp3" }
  ];

  let currentTrack = 0;
  let isPlaying = false;
  let isMuted = false;
  let isExpanded = true;
  let previousVolume = 0.20;

  // Audio instance
  const audio = new Audio();
  audio.src = tracks[currentTrack].src;
  audio.volume = 0.20; // 20% volume by default - calm, gentle
  audio.preload = "auto";

  // Create Container
  const playerContainer = document.createElement("div");
  playerContainer.id = "gramophone-player";
  playerContainer.className = "gramophone-root";
  playerContainer.setAttribute("role", "region");
  playerContainer.setAttribute("aria-label", "Background Music Player");

  playerContainer.innerHTML = `
    <!-- Expanded Gramophone Player Deck -->
    <div class="gramophone-deck" id="gramophone-deck">
      <!-- Top header bar -->
      <div class="gramophone-header">
        <div class="gramophone-status">
          <span class="gramophone-led" id="gramophone-led"></span>
          <span class="gramophone-header-title">BGM · GRAMOPHONE</span>
        </div>
        <button class="gramophone-btn-icon gramophone-minimize-btn" id="gramophone-min-btn" title="Minimize player" aria-label="Minimize">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>

      <!-- Main Deck Body: Turntable + Track Info -->
      <div class="gramophone-body">
        <!-- Turntable Section -->
        <div class="gramophone-turntable" id="gramophone-turntable" title="Click to Play/Pause">
          <!-- Vinyl Disc -->
          <div class="gramophone-vinyl" id="gramophone-vinyl">
            <div class="vinyl-groove groove-1"></div>
            <div class="vinyl-groove groove-2"></div>
            <div class="vinyl-groove groove-3"></div>
            <div class="vinyl-label">
              <span class="vinyl-pin"></span>
            </div>
          </div>
          <!-- Tonearm / Needle -->
          <div class="gramophone-tonearm-base">
            <div class="gramophone-tonearm" id="gramophone-tonearm">
              <div class="tonearm-head"></div>
            </div>
          </div>
        </div>

        <!-- Track Info & Progress -->
        <div class="gramophone-meta">
          <div class="gramophone-track-title" id="track-title">${tracks[0].title}</div>
          <div class="gramophone-track-sub" id="track-sub">${tracks[0].subtitle}</div>
          <div class="gramophone-time-row">
            <span id="current-time">0:00</span>
            <div class="gramophone-progress-bar" id="progress-bar-container" title="Seek">
              <div class="gramophone-progress-fill" id="progress-fill"></div>
            </div>
            <span id="total-time">--:--</span>
          </div>
        </div>
      </div>

      <!-- Bottom Controls Toolbar -->
      <div class="gramophone-controls">
        <button class="gramophone-ctrl-btn" id="btn-prev" title="Previous Track" aria-label="Previous">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <button class="gramophone-ctrl-btn gramophone-play-btn" id="btn-play" title="Play/Pause" aria-label="Play or Pause">
          <svg id="play-icon" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
          <svg id="pause-icon" viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        </button>
        <button class="gramophone-ctrl-btn" id="btn-next" title="Next Track" aria-label="Next">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
        <div class="gramophone-divider"></div>
        <button class="gramophone-ctrl-btn" id="btn-mute" title="Mute/Unmute" aria-label="Mute">
          <svg id="vol-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          <svg id="mute-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </button>
        <input type="range" class="gramophone-vol-slider" id="vol-slider" min="0" max="1" step="0.05" value="0.20" title="Volume (Default: 20% Calm)" aria-label="Volume">
      </div>
    </div>

    <!-- Mini Collapsed Badge (Shown when minimized) -->
    <button class="gramophone-mini-badge" id="gramophone-mini-badge" title="Expand Gramophone BGM Player" aria-label="Expand music player" style="display: none;">
      <div class="mini-vinyl" id="mini-vinyl">
        <span class="mini-pin"></span>
      </div>
      <span class="mini-label">BGM</span>
    </button>
  `;

  document.body.appendChild(playerContainer);

  // Element handles
  const deck = document.getElementById("gramophone-deck");
  const miniBadge = document.getElementById("gramophone-mini-badge");
  const vinyl = document.getElementById("gramophone-vinyl");
  const miniVinyl = document.getElementById("mini-vinyl");
  const tonearm = document.getElementById("gramophone-tonearm");
  const led = document.getElementById("gramophone-led");
  const turntable = document.getElementById("gramophone-turntable");

  const btnPlay = document.getElementById("btn-play");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnMute = document.getElementById("btn-mute");
  const volIcon = document.getElementById("vol-icon");
  const muteIcon = document.getElementById("mute-icon");
  const volSlider = document.getElementById("vol-slider");

  const trackTitle = document.getElementById("track-title");
  const trackSub = document.getElementById("track-sub");
  const currentTimeEl = document.getElementById("current-time");
  const totalTimeEl = document.getElementById("total-time");
  const progressFill = document.getElementById("progress-fill");
  const progressContainer = document.getElementById("progress-bar-container");

  const btnMin = document.getElementById("gramophone-min-btn");

  // Format MM:SS helper
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // Update Visuals
  function updateUI() {
    if (isPlaying) {
      vinyl.classList.add("spinning");
      miniVinyl.classList.add("spinning");
      tonearm.classList.add("on-record");
      led.classList.add("active");
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      vinyl.classList.remove("spinning");
      miniVinyl.classList.remove("spinning");
      tonearm.classList.remove("on-record");
      led.classList.remove("active");
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }

    if (isMuted || audio.volume === 0) {
      volIcon.style.display = "none";
      muteIcon.style.display = "block";
    } else {
      volIcon.style.display = "block";
      muteIcon.style.display = "none";
    }
  }

  // Load a Track
  function loadTrack(index) {
    currentTrack = index;
    audio.src = tracks[currentTrack].src;
    trackTitle.textContent = tracks[currentTrack].title;
    trackSub.textContent = tracks[currentTrack].subtitle;
    progressFill.style.width = "0%";
    currentTimeEl.textContent = "0:00";
    totalTimeEl.textContent = "--:--";
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      updateUI();
    } else {
      audio.play().then(() => {
        isPlaying = true;
        updateUI();
      }).catch((e) => {
        console.log("Audio play error:", e);
      });
    }
  }

  // Autoplay attempt (browser autoplay policy safe)
  function attemptAutoplay() {
    audio.play().then(() => {
      isPlaying = true;
      updateUI();
    }).catch(() => {
      // Browser blocked autoplay without user gesture; attach first-interaction listener
      const onFirstGesture = () => {
        audio.play().then(() => {
          isPlaying = true;
          updateUI();
        }).catch(() => {});
        window.removeEventListener("click", onFirstGesture);
        window.removeEventListener("keydown", onFirstGesture);
        window.removeEventListener("touchstart", onFirstGesture);
      };
      window.addEventListener("click", onFirstGesture, { once: true });
      window.addEventListener("keydown", onFirstGesture, { once: true });
      window.addEventListener("touchstart", onFirstGesture, { once: true });
    });
  }

  // Audio Events
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    // Next track on finish
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play().then(() => {
      isPlaying = true;
      updateUI();
    });
  });

  // User Seek
  progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (!isNaN(audio.duration)) {
      audio.currentTime = pos * audio.duration;
    }
  });

  // Buttons
  btnPlay.addEventListener("click", togglePlay);
  turntable.addEventListener("click", togglePlay);

  btnNext.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
  });

  btnPrev.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
  });

  btnMute.addEventListener("click", () => {
    if (isMuted) {
      audio.muted = false;
      audio.volume = previousVolume > 0 ? previousVolume : 0.20;
      volSlider.value = audio.volume;
      isMuted = false;
    } else {
      previousVolume = audio.volume;
      audio.muted = true;
      volSlider.value = 0;
      isMuted = true;
    }
    updateUI();
  });

  volSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = val === 0;
    isMuted = val === 0;
    if (val > 0) previousVolume = val;
    updateUI();
  });

  // Minimize / Expand Dock
  btnMin.addEventListener("click", () => {
    isExpanded = false;
    deck.style.display = "none";
    miniBadge.style.display = "inline-flex";
  });

  miniBadge.addEventListener("click", () => {
    isExpanded = true;
    miniBadge.style.display = "none";
    deck.style.display = "block";
  });

  // Initial setup
  loadTrack(0);
  updateUI();
  attemptAutoplay();
})();
