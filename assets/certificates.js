/* ==========================================================================
   Certificates & Credentials Animated Window System
   John Barry V. Blase - Computer Engineering Portfolio
   ========================================================================== */

(function () {
  const CERTIFICATES = [
    {
      id: "cert-networking",
      title: "Advancing Secure Networking for Smart Environment: Design, Threat Modeling, and Mitigation Strategies",
      shortTitle: "Advancing Secure Networking",
      category: "Cybersecurity & Networking",
      badgeCode: "NET-SEC",
      date: "March 3, 2026",
      academicYear: "A.Y. 2025–2026",
      event: "13th Engineering Day (E-Day @ 13)",
      location: "ICCT Colleges Amphitheater, Cainta Campus",
      facilitator: "Engr. Mark Anthony Melendrez",
      coordinators: "Mr. Meiko G. Rios (DMNS) · Engr. Ivanlee A. Mendoza (COEDT)",
      organization: "ICCT Colleges Foundation Inc. · College of Engineering & Digital Technology",
      recipient: "JOHN BARRY VILLANUEVA BLASE",
      image: "./assets/certificates/cert-secure-networking.jpg",
      pdf: "./assets/certificates/cert-secure-networking.pdf",
      aspect: "landscape",
      description: "In-depth seminar on advanced network threat modeling, zero-trust architectures, and cryptographic defenses for next-generation smart environments."
    },
    {
      id: "cert-bioinformatics",
      title: "Bioinformatics and Digital Science Information in the Philippine Context",
      shortTitle: "Bioinformatics & Digital Science",
      category: "Digital Science & Bioinformatics",
      badgeCode: "BIO-INFO",
      date: "March 3, 2026",
      academicYear: "A.Y. 2025–2026",
      event: "13th Engineering Day (E-Day @ 13)",
      location: "ICCT Colleges Amphitheater, Cainta Campus",
      facilitator: "Dr. Ian Kendrich Fontanilla",
      coordinators: "Mr. Meiko G. Rios (DMNS) · Engr. Ivanlee A. Mendoza (COEDT)",
      organization: "ICCT Colleges Foundation Inc. · Mathematics & Natural Sciences",
      recipient: "JOHN BARRY VILLANUEVA BLASE",
      image: "./assets/certificates/cert-bioinformatics.jpg",
      pdf: "./assets/certificates/cert-bioinformatics.pdf",
      aspect: "landscape",
      description: "Explored computational algorithms, genomic data structures, and the digital science information landscape within Philippine ecological and medical ecosystems."
    },
    {
      id: "cert-iot",
      title: "Advancing Research and Development in IoT for Smart Environments: Innovations and Future Directions",
      shortTitle: "Advancing R&D in IoT",
      category: "IoT & Embedded Systems",
      badgeCode: "IoT-R&D",
      date: "March 6, 2025",
      academicYear: "A.Y. 2024–2025",
      event: "12th Engineering Day",
      location: "ICCT Colleges, Cainta Campus",
      facilitator: "Engr. Mark Anthony V. Melendrez",
      coordinators: "Engr. Ivanlee A. Mendoza · Mr. Meiko G. Rios · IES Advisers",
      organization: "ICCT Colleges Foundation Inc. · College of Engineering & Digital Technology",
      recipient: "JOHN BARRY V. BLASE",
      image: "./assets/certificates/cert-iot-smart-environments.jpg",
      pdf: "./assets/certificates/cert-iot-smart-environments.pdf",
      aspect: "landscape",
      description: "Explored distributed sensor architectures, edge intelligence, and future hardware engineering methodologies for smart environmental ecosystems."
    },
    {
      id: "cert-ies-membership",
      title: "Certificate of Membership — ICCT Engineering Society (IES)",
      shortTitle: "ICCT Engineering Society Membership",
      category: "Engineering Leadership",
      badgeCode: "IES-MEMBER",
      date: "A.Y. 2024–2025",
      academicYear: "Valid until June 30, 2025",
      event: "Celebration of OSO Membership Day 2025",
      location: "ICCT Colleges Foundation Inc.",
      facilitator: "IES Executive Committee",
      coordinators: "Daniela D. Mariaga (President) · Ms. Farhana Mindalano & Ms. Joanne Graniel (Advisers)",
      organization: "ICCT Engineering Society (IES)",
      recipient: "John Barry V. Blase · 2nd Year BS Computer Engineering",
      image: "./assets/certificates/cert-ies-membership.jpg",
      pdf: "./assets/certificates/cert-ies-membership.pdf",
      aspect: "portrait",
      description: "Official recognition as a bona fide student leader and active member of the ICCT Engineering Society (IES), affirming active participation in engineering initiatives."
    },
    {
      id: "cert-uma-musume",
      title: "MLBB Tournament: The Conqueror Season V (Team UMA MUSUME)",
      shortTitle: "MLBB Tournament · Team UMA MUSUME",
      category: "Esports & Team Collaboration",
      badgeCode: "UMA-MUSUME",
      date: "March 3–4, 2026",
      academicYear: "A.Y. 2025–2026",
      event: "13th Engineering Day (E-Day @ 13)",
      location: "ICCT Colleges Foundation Inc.",
      facilitator: "E-Day Esports Committee",
      coordinators: "Mr. Meiko G. Rios (DMNS) · Engr. Ivanlee A. Mendoza (COEDT)",
      organization: "College of Engineering & Digital Technology",
      recipient: "Team UMA MUSUME",
      image: "./assets/certificates/cert-uma-musume-esports.jpg",
      pdf: "./assets/certificates/cert-uma-musume-esports.pdf",
      aspect: "landscape",
      description: "Recognized for active esports tournament participation and teamwork under banner 'UMA MUSUME' in celebration of Eday@13 MLBB Conqueror Season V."
    }
  ];

  let currentIndex = 0;
  let isOpen = false;
  let isMaximized = false;

  // Touch tracking for swipe
  let touchStartX = 0;
  let touchEndX = 0;

  // DOM elements cache
  let backdropEl = null;
  let windowEl = null;
  let dockLauncherEl = null;
  let lightboxEl = null;

  function initApp() {
    createDockLauncher();
    createAnimatedWindow();
    createLightbox();
    setupGlobalEvents();
    setupHeroAndPageIntegrations();
  }

  // --- 1. Dock Launcher (Pill in bottom-left) ---
  function createDockLauncher() {
    dockLauncherEl = document.createElement("button");
    dockLauncherEl.id = "cert-dock-launcher";
    dockLauncherEl.className = "cert-dock-launcher";
    dockLauncherEl.setAttribute("aria-label", "Open Certificates Window");
    dockLauncherEl.title = "View John Barry V. Blase's 5 Verified Certificates";

    dockLauncherEl.innerHTML = `
      <span class="cert-pulse-dot"></span>
      <span>📜 Certificates</span>
      <span class="cert-badge-count">5</span>
    `;

    dockLauncherEl.addEventListener("click", () => openWindow(currentIndex));
    document.body.appendChild(dockLauncherEl);
  }

  // --- 2. Animated Window Shell ---
  function createAnimatedWindow() {
    backdropEl = document.createElement("div");
    backdropEl.id = "cert-window-backdrop";
    backdropEl.className = "cert-window-backdrop";

    windowEl = document.createElement("div");
    windowEl.id = "cert-window";
    windowEl.className = "cert-window";
    windowEl.setAttribute("role", "dialog");
    windowEl.setAttribute("aria-modal", "true");
    windowEl.setAttribute("aria-label", "Certificates & Credentials Window");

    windowEl.innerHTML = `
      <!-- Window Titlebar -->
      <div class="cert-window-header" id="cert-window-header">
        <div class="cert-window-controls">
          <button class="cert-control-btn close" id="cert-btn-close" title="Close Window (Esc)" aria-label="Close"></button>
          <button class="cert-control-btn minimize" id="cert-btn-min" title="Minimize to Dock" aria-label="Minimize"></button>
          <button class="cert-control-btn maximize" id="cert-btn-max" title="Toggle Fullscreen" aria-label="Maximize"></button>
        </div>
        <div class="cert-window-title">
          <span class="cert-term-prompt">$</span>
          <span class="cert-title-text">blase@icct: ~/credentials (5 verified)</span>
        </div>
        <div class="cert-window-header-actions">
          <span class="cert-count-pill" id="cert-header-counter">1 / 5</span>
        </div>
      </div>

      <!-- Window Body -->
      <div class="cert-window-body">
        <!-- Stage: Certificate Viewer -->
        <div class="cert-stage" id="cert-stage">
          <!-- Category Tag -->
          <div class="cert-category-chip" id="cert-cat-chip">
            <span class="cert-chip-glow"></span>
            <span id="cert-cat-text">CYBERSECURITY</span>
          </div>

          <!-- Nav Buttons -->
          <button class="cert-nav-btn prev" id="cert-nav-prev" title="Previous Certificate (Left Arrow)" aria-label="Previous">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="cert-nav-btn next" id="cert-nav-next" title="Next Certificate (Right Arrow)" aria-label="Next">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <!-- Frame & Image -->
          <div class="cert-frame" id="cert-frame">
            <div class="cert-image-wrapper" id="cert-img-wrap" title="Click to Inspect in Full Resolution">
              <img class="cert-image" id="cert-main-img" src="" alt="Certificate Preview" />
              <div class="cert-inspect-hint">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Click to Inspect</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Thumbnail Tabs Bar -->
        <div class="cert-tabs-bar" id="cert-tabs-bar">
          ${CERTIFICATES.map((c, i) => `
            <div class="cert-tab-item ${i === 0 ? "active" : ""}" data-index="${i}" title="${c.title}">
              <span class="cert-tab-tag">[0${i + 1}] ${c.badgeCode}</span>
              <span class="cert-tab-title">${c.shortTitle}</span>
            </div>
          `).join("")}
        </div>

        <!-- Details Card -->
        <div class="cert-details-card" id="cert-details-card">
          <div class="cert-details-header">
            <div class="cert-title-group">
              <h2 class="cert-main-title" id="cert-title"></h2>
              <p class="cert-subtitle" id="cert-desc"></p>
            </div>
            <div class="cert-actions-group">
              <a class="cert-btn primary" id="cert-btn-pdf" href="" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span>Official PDF</span>
              </a>
              <button class="cert-btn" id="cert-btn-inspect">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Inspect</span>
              </button>
            </div>
          </div>

          <div class="cert-meta-grid">
            <div class="cert-meta-item">
              <span class="cert-meta-label">Event / Issuer</span>
              <span class="cert-meta-value" id="cert-event"></span>
            </div>
            <div class="cert-meta-item">
              <span class="cert-meta-label">Date & Academic Year</span>
              <span class="cert-meta-value" id="cert-date"></span>
            </div>
            <div class="cert-meta-item">
              <span class="cert-meta-label">Facilitator / Speaker</span>
              <span class="cert-meta-value" id="cert-speaker"></span>
            </div>
            <div class="cert-meta-item">
              <span class="cert-meta-label">Verified Credential</span>
              <span class="cert-meta-value verified" id="cert-recipient">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>John Barry V. Blase</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Window Footer / Status Bar -->
      <div class="cert-window-footer">
        <div>ICCT COLLEGES · BS COMPUTER ENGINEERING</div>
        <div class="cert-footer-kbd">
          <span><span class="cert-kbd-chip">←</span> <span class="cert-kbd-chip">→</span> Browse</span>
          <span><span class="cert-kbd-chip">Esc</span> Close</span>
        </div>
      </div>
    `;

    backdropEl.appendChild(windowEl);
    document.body.appendChild(backdropEl);

    // Event hooks
    document.getElementById("cert-btn-close").addEventListener("click", closeWindow);
    document.getElementById("cert-btn-min").addEventListener("click", minimizeWindow);
    document.getElementById("cert-btn-max").addEventListener("click", toggleMaximize);

    document.getElementById("cert-nav-prev").addEventListener("click", prevCertificate);
    document.getElementById("cert-nav-next").addEventListener("click", nextCertificate);

    document.getElementById("cert-img-wrap").addEventListener("click", () => {
      openLightbox(CERTIFICATES[currentIndex].image, CERTIFICATES[currentIndex].title);
    });
    document.getElementById("cert-btn-inspect").addEventListener("click", () => {
      openLightbox(CERTIFICATES[currentIndex].image, CERTIFICATES[currentIndex].title);
    });

    // Close on backdrop click outside window
    backdropEl.addEventListener("click", (e) => {
      if (e.target === backdropEl) {
        closeWindow();
      }
    });

    // Thumbnail tab clicks
    const tabItems = windowEl.querySelectorAll(".cert-tab-item");
    tabItems.forEach((tab) => {
      tab.addEventListener("click", () => {
        const idx = parseInt(tab.getAttribute("data-index"), 10);
        selectCertificate(idx);
      });
    });

    // Touch swipe support on stage
    const stage = document.getElementById("cert-stage");
    stage.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    // Draggable window via header
    setupDraggableHeader();

    // Populate initial certificate
    renderCurrentCertificate("none");
  }

  // --- 3. Lightbox Inspector ---
  function createLightbox() {
    lightboxEl = document.createElement("div");
    lightboxEl.id = "cert-lightbox";
    lightboxEl.className = "cert-lightbox-overlay";
    lightboxEl.innerHTML = `
      <div class="cert-lightbox-bar">
        <span id="cert-lightbox-title">Certificate Inspection</span>
        <button class="cert-btn" id="cert-lightbox-close" style="padding: 4px 10px;">
          ✕ Close Inspector (Esc)
        </button>
      </div>
      <div class="cert-lightbox-view" id="cert-lightbox-view">
        <img class="cert-lightbox-img" id="cert-lightbox-img" src="" alt="Full-res inspection view" />
      </div>
    `;

    document.body.appendChild(lightboxEl);

    document.getElementById("cert-lightbox-close").addEventListener("click", closeLightbox);
    lightboxEl.addEventListener("click", (e) => {
      if (e.target === lightboxEl || e.target.id === "cert-lightbox-view") {
        closeLightbox();
      }
    });
  }

  function openLightbox(src, title) {
    const img = document.getElementById("cert-lightbox-img");
    const t = document.getElementById("cert-lightbox-title");
    img.src = src;
    t.textContent = title;
    lightboxEl.classList.add("active");
  }

  function closeLightbox() {
    if (lightboxEl) {
      lightboxEl.classList.remove("active");
    }
  }

  // --- 4. Render Certificate ---
  function renderCurrentCertificate(direction) {
    const cert = CERTIFICATES[currentIndex];
    if (!cert) return;

    // Header counter
    const counter = document.getElementById("cert-header-counter");
    if (counter) counter.textContent = `${currentIndex + 1} / ${CERTIFICATES.length}`;

    // Category chip
    const catText = document.getElementById("cert-cat-text");
    if (catText) catText.textContent = cert.category;

    // Main frame animation
    const frame = document.getElementById("cert-frame");
    const img = document.getElementById("cert-main-img");

    if (frame && img) {
      frame.classList.remove("sliding-left", "sliding-right");
      // trigger reflow
      void frame.offsetWidth;
      if (direction === "left") {
        frame.classList.add("sliding-left");
      } else if (direction === "right") {
        frame.classList.add("sliding-right");
      }
      img.src = cert.image;
      img.alt = cert.title;
    }

    // Details text
    const title = document.getElementById("cert-title");
    const desc = document.getElementById("cert-desc");
    const event = document.getElementById("cert-event");
    const date = document.getElementById("cert-date");
    const speaker = document.getElementById("cert-speaker");
    const recipient = document.getElementById("cert-recipient");
    const btnPdf = document.getElementById("cert-btn-pdf");

    if (title) title.textContent = cert.title;
    if (desc) desc.textContent = cert.description;
    if (event) event.textContent = `${cert.event} · ${cert.organization}`;
    if (date) date.textContent = `${cert.date} (${cert.academicYear})`;
    if (speaker) speaker.textContent = `${cert.facilitator} · ${cert.coordinators}`;
    if (recipient) recipient.innerHTML = `
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${cert.recipient}</span>
    `;

    if (btnPdf) {
      btnPdf.href = cert.pdf;
    }

    // Update active tab
    const tabs = document.querySelectorAll(".cert-tab-item");
    tabs.forEach((tab, i) => {
      if (i === currentIndex) {
        tab.classList.add("active");
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        tab.classList.remove("active");
      }
    });
  }

  function nextCertificate() {
    currentIndex = (currentIndex + 1) % CERTIFICATES.length;
    renderCurrentCertificate("left");
  }

  function prevCertificate() {
    currentIndex = (currentIndex - 1 + CERTIFICATES.length) % CERTIFICATES.length;
    renderCurrentCertificate("right");
  }

  function selectCertificate(index) {
    if (index === currentIndex) return;
    const direction = index > currentIndex ? "left" : "right";
    currentIndex = index;
    renderCurrentCertificate(direction);
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextCertificate();
      } else {
        prevCertificate();
      }
    }
  }

  // --- 5. Window Control Functions ---
  function openWindow(index) {
    if (typeof index === "number" && index >= 0 && index < CERTIFICATES.length) {
      currentIndex = index;
      renderCurrentCertificate("none");
    }
    isOpen = true;
    backdropEl.classList.add("active");
    if (dockLauncherEl) {
      dockLauncherEl.style.display = "none";
    }
  }

  function closeWindow() {
    isOpen = false;
    backdropEl.classList.remove("active");
    if (dockLauncherEl) {
      dockLauncherEl.style.display = "inline-flex";
    }
  }

  function minimizeWindow() {
    closeWindow();
  }

  function toggleMaximize() {
    isMaximized = !isMaximized;
    if (windowEl) {
      if (isMaximized) {
        windowEl.classList.add("maximized");
      } else {
        windowEl.classList.remove("maximized");
      }
    }
  }

  // Draggable logic for window header
  function setupDraggableHeader() {
    const header = document.getElementById("cert-window-header");
    if (!header || !windowEl) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    header.addEventListener("mousedown", (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest("button") || isMaximized) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = windowEl.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      windowEl.style.position = "fixed";
      windowEl.style.left = `${initialLeft}px`;
      windowEl.style.top = `${initialTop}px`;
      windowEl.style.margin = "0";
      windowEl.style.transform = "none";

      function onMouseMove(moveEvent) {
        if (!isDragging) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Keep inside bounds
        newLeft = Math.max(10, Math.min(window.innerWidth - windowEl.offsetWidth - 10, newLeft));
        newTop = Math.max(10, Math.min(window.innerHeight - windowEl.offsetHeight - 10, newTop));

        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top = `${newTop}px`;
      }

      function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // --- 6. Keyboard navigation ---
  function setupGlobalEvents() {
    window.addEventListener("keydown", (e) => {
      if (lightboxEl && lightboxEl.classList.contains("active")) {
        if (e.key === "Escape") {
          closeLightbox();
        }
        return;
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        closeWindow();
      } else if (e.key === "ArrowLeft") {
        prevCertificate();
      } else if (e.key === "ArrowRight") {
        nextCertificate();
      } else if (e.key === "f" || e.key === "F") {
        openLightbox(CERTIFICATES[currentIndex].image, CERTIFICATES[currentIndex].title);
      }
    });
  }

  // --- 7. In-Page & Hero Integrations ---
  function setupHeroAndPageIntegrations() {
    function tryInject() {
      // 1. Hero action buttons row: next to TBH and call: 09776218911
      const callBtn = document.querySelector('a[href^="tel:09776218911"]');
      if (callBtn && !document.getElementById("hero-cert-launcher-btn")) {
        const parentRow = callBtn.parentElement;
        if (parentRow) {
          const heroCertBtn = document.createElement("button");
          heroCertBtn.id = "hero-cert-launcher-btn";
          heroCertBtn.type = "button";
          heroCertBtn.className = "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-terminal/40 rounded-sm text-terminal hover:bg-terminal/10 transition-colors duration-150 cursor-pointer shadow-sm";
          heroCertBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            <span>certificates [5]</span>
          `;
          heroCertBtn.addEventListener("click", () => openWindow(0));
          parentRow.appendChild(heroCertBtn);
        }
      }

      // 2. In-Page Credentials Section
      const hireSection = document.getElementById("hire");
      if (hireSection && !document.getElementById("inpage-certificates-section")) {
        const certSection = document.createElement("section");
        certSection.id = "inpage-certificates-section";
        certSection.className = "cert-inpage-section max-w-4xl mx-auto w-full px-4 sm:px-6";
        certSection.innerHTML = `
          <div class="cert-section-header">
            <p class="cert-section-cmd">
              <span class="cert-cmd-dollar">$</span>ls -la ~/credentials
            </p>
            <div class="cert-section-title-wrap">
              <h2 class="cert-section-title">## verified certifications & awards (5)</h2>
              <button class="cert-btn primary" id="inpage-launch-window-btn">
                <span>Launch Interactive Window ↗</span>
              </button>
            </div>
          </div>

          <div class="cert-inpage-grid">
            ${CERTIFICATES.map((c, i) => `
              <div class="cert-inpage-card" data-index="${i}">
                <div class="cert-inpage-thumb-wrap">
                  <img class="cert-inpage-thumb" src="${c.image}" alt="${c.title}" loading="lazy" />
                </div>
                <div class="cert-inpage-info">
                  <span class="cert-inpage-tag">[0${i + 1}] ${c.category}</span>
                  <p class="cert-inpage-name">${c.shortTitle}</p>
                  <p class="cert-inpage-meta">${c.date} · ${c.event}</p>
                </div>
              </div>
            `).join("")}
          </div>
        `;

        // Insert right before #hire
        hireSection.parentNode.insertBefore(certSection, hireSection);

        // Bind launch button
        document.getElementById("inpage-launch-window-btn").addEventListener("click", () => openWindow(0));

        // Bind card clicks
        certSection.querySelectorAll(".cert-inpage-card").forEach((card) => {
          card.addEventListener("click", () => {
            const idx = parseInt(card.getAttribute("data-index"), 10);
            openWindow(idx);
          });
        });
      }
    }

    // Try immediately
    tryInject();

    // Observe DOM mutations to handle SPA re-renders
    const observer = new MutationObserver(() => {
      tryInject();
    });

    const root = document.getElementById("root") || document.body;
    observer.observe(root, { childList: true, subtree: true });
  }

  // Expose global controller
  window.BlaseCertificates = {
    open: openWindow,
    close: closeWindow,
    next: nextCertificate,
    prev: prevCertificate,
    select: selectCertificate,
    data: CERTIFICATES
  };

  // Mount
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
