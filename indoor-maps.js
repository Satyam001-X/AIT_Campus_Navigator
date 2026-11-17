// indoor-maps.js - Multi-Floor Interactive Indoor Architectural Layout Engine

class IndoorMapRenderer {
  constructor(containerElement, onRoomSelect) {
    this.container = containerElement;
    this.onRoomSelect = onRoomSelect || (() => {});
    this.currentBuilding = null;
    this.currentFloorIndex = 0;
    this.selectedRoomId = null;
  }

  // Set building and render default floor
  loadBuilding(building) {
    this.currentBuilding = building;
    if (!building || !building.indoorMap || !building.indoorMap.floors) {
      this.container.innerHTML = `
        <div class="indoor-empty-state">
          <i data-lucide="layout" class="w-12 h-12 text-slate-400 mb-2"></i>
          <p class="font-medium text-slate-600 dark:text-slate-300">Single-level building layout</p>
          <p class="text-xs text-slate-500">Indoor schematic not required for this facility.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Default to floor 1 if present
    const defaultLvl = building.indoorMap.defaultFloor !== undefined ? building.indoorMap.defaultFloor : 1;
    let initialIdx = building.indoorMap.floors.findIndex(f => f.level === defaultLvl);
    if (initialIdx === -1) initialIdx = 0;

    this.currentFloorIndex = initialIdx;
    this.render();
  }

  // Switch active floor
  switchFloor(floorIndex) {
    if (!this.currentBuilding || !this.currentBuilding.indoorMap.floors[floorIndex]) return;
    this.currentFloorIndex = floorIndex;
    this.selectedRoomId = null;
    this.render();
  }

  // Render SVG Floor Plan
  render() {
    if (!this.currentBuilding || !this.currentBuilding.indoorMap) return;

    const floors = this.currentBuilding.indoorMap.floors;
    const currentFloor = floors[this.currentFloorIndex];
    if (!currentFloor) return;

    // Build Floor Tab Pills
    const floorPillsHtml = floors.map((f, idx) => `
      <button class="indoor-floor-tab ${idx === this.currentFloorIndex ? 'active' : ''}" 
              data-floor-idx="${idx}">
        ${f.level === 0 ? 'G / Base' : `Floor ${f.level}`}
      </button>
    `).join('');

    // Generate Room SVG elements
    const roomsSvg = currentFloor.rooms.map(room => {
      let fillColor = "#f1f5f9";
      let strokeColor = "#cbd5e1";
      let iconName = "square";
      let badgeLabel = room.id;

      if (room.type === "lecture_hall") {
        fillColor = "#e0e7ff";
        strokeColor = "#6366f1";
        iconName = "presentation";
      } else if (room.type === "lab") {
        fillColor = "#ede9fe";
        strokeColor = "#8b5cf6";
        iconName = "cpu";
      } else if (room.type === "classroom") {
        fillColor = "#e0f2fe";
        strokeColor = "#0284c7";
        iconName = "book-open";
      } else if (room.type === "restroom") {
        fillColor = "#ecfdf5";
        strokeColor = "#10b981";
        iconName = "smile";
      } else if (room.type === "elevator") {
        fillColor = "#fef3c7";
        strokeColor = "#f59e0b";
        iconName = "arrow-up-down";
      } else if (room.type === "cafe" || room.type === "dining") {
        fillColor = "#ffedd5";
        strokeColor = "#ea580c";
        iconName = "coffee";
      } else if (room.type === "health") {
        fillColor = "#fee2e2";
        strokeColor = "#ef4444";
        iconName = "cross";
      } else if (room.type === "study") {
        fillColor = "#f0fdf4";
        strokeColor = "#16a34a";
        iconName = "compass";
      }

      const isSelected = (this.selectedRoomId === room.id);

      return `
        <g class="indoor-room-group ${isSelected ? 'selected' : ''}" data-room-id="${room.id}" tabindex="0">
          <rect x="${room.x}%" y="${room.y}%" width="${room.w}%" height="${room.h}%" 
                rx="6" 
                fill="${fillColor}" 
                stroke="${strokeColor}" 
                stroke-width="${isSelected ? '3' : '1.5'}"
                class="indoor-room-rect" />
          
          <text x="${room.x + 2}%" y="${room.y + 7}%" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="11" 
                font-weight="700" 
                fill="#334155"
                class="indoor-room-code">${room.id}</text>
          
          <text x="${room.x + 2}%" y="${room.y + 14}%" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="9.5" 
                font-weight="500" 
                fill="#64748b"
                class="indoor-room-label">
            ${room.name.length > 26 ? room.name.substring(0, 24) + '…' : room.name}
          </text>
        </g>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="indoor-map-wrapper">
        <div class="indoor-header">
          <div class="indoor-building-title">
            <span class="indoor-badge">${this.currentBuilding.name}</span>
            <span class="indoor-floor-subtitle">${currentFloor.name}</span>
          </div>
          <div class="indoor-floor-selector">
            ${floorPillsHtml}
          </div>
        </div>

        <div class="indoor-canvas-container">
          <svg viewBox="0 0 100 100" class="indoor-floorplan-svg" preserveAspectRatio="none">
            <!-- Building Outer Perimeter Wall -->
            <rect x="5%" y="8%" width="90%" height="84%" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" stroke-dasharray="0" class="building-boundary" />
            <!-- Corridor Center Line -->
            <line x1="12%" y1="52%" x2="88%" y2="52%" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4" />
            <!-- Rooms -->
            ${roomsSvg}
          </svg>
        </div>

        <div class="indoor-legend">
          <span class="legend-item"><span class="legend-dot bg-indigo-500"></span> Lecture</span>
          <span class="legend-item"><span class="legend-dot bg-purple-500"></span> Lab</span>
          <span class="legend-item"><span class="legend-dot bg-sky-500"></span> Classroom</span>
          <span class="legend-item"><span class="legend-dot bg-emerald-500"></span> Restroom</span>
          <span class="legend-item"><span class="legend-dot bg-amber-500"></span> Elevator</span>
        </div>

        <div id="indoor-room-detail-card" class="indoor-room-detail-card ${this.selectedRoomId ? 'active' : 'hidden'}"></div>
      </div>
    `;

    // Attach Floor Switcher Listeners
    this.container.querySelectorAll('.indoor-floor-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-floor-idx'), 10);
        this.switchFloor(idx);
      });
    });

    // Attach Room Click Listeners
    this.container.querySelectorAll('.indoor-room-group').forEach(group => {
      group.addEventListener('click', () => {
        const roomId = group.getAttribute('data-room-id');
        this.selectRoom(roomId);
      });
    });
  }

  // Select a specific room and render detail bottom popup
  selectRoom(roomId) {
    if (!this.currentBuilding || !this.currentBuilding.indoorMap) return;
    const currentFloor = this.currentBuilding.indoorMap.floors[this.currentFloorIndex];
    const room = currentFloor.rooms.find(r => r.id === roomId);
    if (!room) return;

    this.selectedRoomId = roomId;

    // Highlight room
    this.container.querySelectorAll('.indoor-room-group').forEach(g => {
      if (g.getAttribute('data-room-id') === roomId) {
        g.classList.add('selected');
        const rect = g.querySelector('.indoor-room-rect');
        if (rect) rect.setAttribute('stroke-width', '3');
      } else {
        g.classList.remove('selected');
        const rect = g.querySelector('.indoor-room-rect');
        if (rect) rect.setAttribute('stroke-width', '1.5');
      }
    });

    // Render detail card
    const detailCard = this.container.querySelector('#indoor-room-detail-card');
    if (detailCard) {
      detailCard.classList.remove('hidden');
      detailCard.classList.add('active');
      detailCard.innerHTML = `
        <div class="indoor-card-content">
          <div class="indoor-card-info">
            <span class="room-pill">${room.id}</span>
            <div>
              <h4 class="font-bold text-slate-800 dark:text-white text-sm">${room.name}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">${this.currentBuilding.name} • ${currentFloor.name}</p>
            </div>
          </div>
          <button class="indoor-nav-btn" id="indoor-start-nav-btn">
            <i data-lucide="navigation-2" class="w-3.5 h-3.5"></i>
            <span>Route to Room</span>
          </button>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      const navBtn = detailCard.querySelector('#indoor-start-nav-btn');
      if (navBtn) {
        navBtn.addEventListener('click', () => {
          this.onRoomSelect(this.currentBuilding, currentFloor, room);
        });
      }
    }
  }
}

// Global Export
if (typeof window !== "undefined") {
  window.IndoorMapRenderer = IndoorMapRenderer;
}
