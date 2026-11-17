// app.js - Master Controller for AIT UniNav (Army Institute of Technology, Pune)

(function() {
  'use strict';

  // State Management
  const state = {
    map: null,
    currentTileLayer: null,
    tileStyle: 'light', // 'light', 'dark', 'satellite'
    is3DMode: false,
    userLocation: { lat: 18.6074, lng: 73.8752 }, // Default near Central Wing & Flagpole
    userMarker: null,
    buildingPolygons: [],
    buildingMarkers: [],
    amenityMarkers: [],
    shuttleMarkers: [],
    shuttlePolyline: null,
    activeRoutePolyline: null,
    activeRouteSegments: [],
    selectedBuilding: null,
    activeCategory: 'all',
    activeMode: 'walk', // 'walk', 'bike', 'shuttle', 'accessible'
    currentRoute: null,
    
    // Live Navigation Simulation
    isNavigating: false,
    navStepIndex: 0,
    navSubCoordIndex: 0,
    navSpeedMultiplier: 1,
    navInterval: null,
    voiceGuidanceEnabled: true,
    speechSynth: window.speechSynthesis || null,
    lastSpokenInstruction: ''
  };

  // Audio Chime Synthesizer using Web Audio API
  const audioCtx = (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined')
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null;

  function playTurnChime() {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  function speakVoiceGuidance(text) {
    if (!state.voiceGuidanceEnabled || !state.speechSynth) return;
    if (state.lastSpokenInstruction === text) return;
    state.lastSpokenInstruction = text;

    try {
      state.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      state.speechSynth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  // Initialize Router & Indoor Renderer Instances
  let router = null;
  let indoorRenderer = null;

  // DOM Elements Cache
  const DOM = {};

  function cacheDOMElements() {
    DOM.sidebarPanel = document.getElementById('sidebar-panel');
    DOM.menuToggleBtn = document.getElementById('menu-toggle-btn');
    DOM.searchInput = document.getElementById('campus-search-input');
    DOM.searchClearBtn = document.getElementById('search-clear-btn');
    DOM.searchDropdown = document.getElementById('search-dropdown-menu');
    DOM.voiceSearchBtn = document.getElementById('voice-search-btn');
    DOM.openDirectionsBtn = document.getElementById('open-directions-btn');
    DOM.categoryChips = document.querySelectorAll('.filter-chip');
    
    DOM.viewExplore = document.getElementById('view-explore');
    DOM.viewDirections = document.getElementById('view-directions');
    DOM.viewBuildingDetails = document.getElementById('view-building-details');
    DOM.popularPlacesList = document.getElementById('popular-places-list');

    // Directions
    DOM.routeStartInput = document.getElementById('route-start-input');
    DOM.routeDestInput = document.getElementById('route-dest-input');
    DOM.routeSwapBtn = document.getElementById('route-swap-btn');
    DOM.modeTabs = document.querySelectorAll('.mode-tab-btn');
    DOM.routeDurationText = document.getElementById('route-duration-text');
    DOM.routeDistanceText = document.getElementById('route-distance-text');
    DOM.routeEcoBadges = document.getElementById('route-eco-badges');
    DOM.turnStepsList = document.getElementById('turn-steps-list');
    DOM.startNavBtn = document.getElementById('start-nav-btn');

    // Building Details
    DOM.buildingHeroImg = document.getElementById('building-hero-img');
    DOM.buildingCatBadge = document.getElementById('building-cat-badge');
    DOM.buildingName = document.getElementById('building-name');
    DOM.buildingSubtitle = document.getElementById('building-subtitle');
    DOM.buildingRating = document.getElementById('building-rating');
    DOM.buildingReviews = document.getElementById('building-reviews');
    DOM.buildingHoursText = document.getElementById('building-hours-text');
    DOM.buildingOccupancyText = document.getElementById('building-occupancy-text');
    DOM.buildingDescText = document.getElementById('building-desc-text');
    DOM.buildingTagsContainer = document.getElementById('building-tags-container');
    DOM.bldgDirectionsBtn = document.getElementById('bldg-directions-btn');
    DOM.bldgIndoorBtn = document.getElementById('bldg-indoor-btn');
    DOM.indoorContainer = document.getElementById('building-indoor-container');

    // Map Controls
    DOM.ctrlLayerToggle = document.getElementById('ctrl-layer-toggle');
    DOM.ctrl3dToggle = document.getElementById('ctrl-3d-toggle');
    DOM.ctrlRecenterBtn = document.getElementById('ctrl-recenter-btn');
    DOM.ctrlSosBtn = document.getElementById('ctrl-sos-btn');
    DOM.floorSelectorWidget = document.getElementById('floor-selector-widget');

    // Live HUD
    DOM.liveNavHudTop = document.getElementById('live-nav-hud-top');
    DOM.liveNavHudBottom = document.getElementById('live-nav-hud-bottom');
    DOM.hudDistanceText = document.getElementById('hud-distance-text');
    DOM.hudInstructionText = document.getElementById('hud-instruction-text');
    DOM.hudEtaText = document.getElementById('hud-eta-text');
    DOM.hudRemainingText = document.getElementById('hud-remaining-text');
    DOM.navSpeedMultiplierBtn = document.getElementById('nav-speed-multiplier-btn');
    DOM.navVoiceMuteBtn = document.getElementById('nav-voice-mute-btn');
    DOM.navEndTripBtn = document.getElementById('nav-end-trip-btn');

    // Modals
    DOM.modalSchedule = document.getElementById('modal-schedule');
    DOM.modalSos = document.getElementById('modal-sos');
    DOM.modalVirtualTour = document.getElementById('modal-virtual-tour');
  }

  // Initialize Application
  function init() {
    cacheDOMElements();

    router = new window.CampusRouter(window.CAMPUS_GRAPH, window.CAMPUS_BUILDINGS, window.CAMPUS_SHUTTLES);
    indoorRenderer = new window.IndoorMapRenderer(DOM.indoorContainer, onIndoorRoomNavigate);

    initMap();
    renderBuildingPolygons();
    renderBuildingMarkers();
    renderAmenityMarkers();
    renderShuttleTracker();
    renderExploreList();
    initEventListeners();
    initModals();

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // Leaflet Map Initialization
  // =========================================================================
  function initMap() {
    const config = window.CAMPUS_CONFIG;

    state.map = L.map('map-view', {
      center: config.center,
      zoom: config.defaultZoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      zoomControl: true,
      attributionControl: false
    });

    state.map.zoomControl.setPosition('bottomright');
    setTileLayer('light');

    // User Location Blue-Dot Marker
    const userIcon = L.divIcon({
      className: 'user-marker-container',
      html: `<div class="live-user-marker" title="Your Location at AIT"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    state.userMarker = L.marker([state.userLocation.lat, state.userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000
    }).addTo(state.map);

    state.map.on('click', function() {
      if (state.isNavigating) return;
      closeSearchDropdown();
    });
  }

  // Change Map Tile Styles
  function setTileLayer(style) {
    if (state.currentTileLayer) {
      state.map.removeLayer(state.currentTileLayer);
    }

    state.tileStyle = style;

    if (style === 'dark') {
      state.currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd'
      });
      document.body.classList.add('dark-theme');
    } else if (style === 'satellite') {
      state.currentTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      });
      document.body.classList.remove('dark-theme');
    } else {
      state.currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd'
      });
      document.body.classList.remove('dark-theme');
    }

    state.currentTileLayer.addTo(state.map);
  }

  // =========================================================================
  // Render Building Vector Polygons
  // =========================================================================
  function renderBuildingPolygons() {
    window.CAMPUS_BUILDINGS.forEach(bldg => {
      if (!bldg.polygon) return;

      const poly = L.polygon(bldg.polygon, {
        color: bldg.color || '#2563eb',
        weight: 2,
        opacity: 0.85,
        fillColor: bldg.color || '#3b82f6',
        fillOpacity: state.is3DMode ? 0.65 : 0.35,
        className: 'campus-bldg-poly'
      }).addTo(state.map);

      poly.on('click', () => {
        selectBuilding(bldg);
      });

      poly.on('mouseover', () => {
        poly.setStyle({ fillOpacity: 0.7, weight: 3 });
      });

      poly.on('mouseout', () => {
        poly.setStyle({ fillOpacity: state.is3DMode ? 0.65 : 0.35, weight: 2 });
      });

      poly.bindTooltip(`<strong>${bldg.name}</strong><br><span style="font-size:11px;color:#64748b;">${bldg.subtitle}</span>`, {
        direction: 'top',
        offset: [0, -10],
        opacity: 0.95
      });

      state.buildingPolygons.push({ id: bldg.id, category: bldg.category, poly: poly, data: bldg });
    });
  }

  // =========================================================================
  // Render Building Markers
  // =========================================================================
  function renderBuildingMarkers() {
    window.CAMPUS_BUILDINGS.forEach(bldg => {
      const markerHtml = `
        <div class="custom-building-marker" style="background-color: ${bldg.color || '#2563eb'}; width: 32px; height: 32px;">
          <i data-lucide="${bldg.icon || 'map-pin'}" style="width: 16px; height: 16px; color: white;"></i>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'bldg-marker-icon-wrapper',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([bldg.center[0], bldg.center[1]], {
        icon: customIcon,
        title: bldg.name
      }).addTo(state.map);

      marker.on('click', () => {
        selectBuilding(bldg);
      });

      state.buildingMarkers.push({ id: bldg.id, category: bldg.category, marker: marker, data: bldg });
    });
  }

  // =========================================================================
  // Render Amenity Markers
  // =========================================================================
  function renderAmenityMarkers() {
    window.CAMPUS_AMENITIES.forEach(amenity => {
      let bg = '#0284c7';
      if (amenity.type === 'sos') bg = '#dc2626';
      if (amenity.type === 'cafe') bg = '#ea580c';
      if (amenity.type === 'printer') bg = '#7c3aed';
      if (amenity.type === 'atm') bg = '#059669';

      const amenityHtml = `
        <div class="custom-building-marker" style="background-color: ${bg}; width: 26px; height: 26px; ${amenity.type === 'sos' ? 'animation: pulse-sos 1.5s infinite;' : ''}">
          <i data-lucide="${amenity.icon || 'map-pin'}" style="width: 13px; height: 13px; color: white;"></i>
        </div>
      `;

      const icon = L.divIcon({
        className: 'amenity-icon-wrapper',
        html: amenityHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([amenity.lat, amenity.lng], { icon: icon }).addTo(state.map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <h4 style="font-weight: 700; color: #1e293b; margin-bottom: 2px;">${amenity.name}</h4>
          <p style="font-size: 11.5px; color: #64748b; margin-bottom: 6px;">${amenity.details || ''}</p>
          <button onclick="window.routeToAmenity('${amenity.id}')" style="background: #1a73e8; color: white; border: none; padding: 4px 10px; border-radius: 9999px; font-size: 11.5px; font-weight: 600; cursor: pointer;">
            Navigate Here
          </button>
        </div>
      `);

      state.amenityMarkers.push({ id: amenity.id, type: amenity.type, marker: marker, data: amenity });
    });
  }

  window.routeToAmenity = function(amenityId) {
    const item = window.CAMPUS_AMENITIES.find(a => a.id === amenityId);
    if (!item) return;
    openDirectionsView({ name: "Your Location", lat: state.userLocation.lat, lng: state.userLocation.lng }, item);
  };

  // =========================================================================
  // Shuttle / College Bus Tracker
  // =========================================================================
  function renderShuttleTracker() {
    const shuttle = window.CAMPUS_SHUTTLES[0];
    if (!shuttle) return;

    state.shuttlePolyline = L.polyline(shuttle.routePath, {
      color: '#2563eb',
      weight: 3.5,
      opacity: 0.7,
      dashArray: '6, 6'
    }).addTo(state.map);

    shuttle.activeBuses.forEach(bus => {
      const busHtml = `
        <div class="shuttle-marker-icon" style="width: 28px; height: 28px; background: #1e3a8a;">
          <i data-lucide="bus" style="width: 14px; height: 14px;"></i>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'bus-marker-wrap',
        html: busHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([bus.lat, bus.lng], { icon: busIcon }).addTo(state.map);
      marker.bindTooltip(`<strong>${bus.name}</strong><br><span style="font-size:11px;">Next Stop in ~${bus.nextArrivalMins} min</span>`, {
        direction: 'top'
      });

      state.shuttleMarkers.push({ busData: bus, marker: marker });
    });

    setInterval(simulateShuttleMovement, 3500);
  }

  function simulateShuttleMovement() {
    const shuttle = window.CAMPUS_SHUTTLES[0];
    if (!shuttle || !shuttle.routePath) return;

    state.shuttleMarkers.forEach((item) => {
      item.busData.currentStopIdx = (item.busData.currentStopIdx + 1) % shuttle.routePath.length;
      const newCoord = shuttle.routePath[item.busData.currentStopIdx];
      item.marker.setLatLng(newCoord);
      item.busData.lat = newCoord[0];
      item.busData.lng = newCoord[1];
    });
  }

  // =========================================================================
  // Explore View: Populate Featured Places
  // =========================================================================
  function renderExploreList() {
    if (!DOM.popularPlacesList) return;

    const listHtml = window.CAMPUS_BUILDINGS.slice(0, 10).map(bldg => `
      <div class="place-card-mini" data-bldg-id="${bldg.id}">
        <img src="${encodeURI(bldg.heroImage)}" class="place-card-img" alt="${bldg.name}" loading="lazy">
        <div class="place-card-body">
          <h4 class="place-card-title">${bldg.name}</h4>
          <p class="place-card-sub">${bldg.subtitle}</p>
          <div class="place-card-stats">
            <div class="rating-pill">
              <i data-lucide="star" class="w-3 h-3 fill-amber-500 text-amber-500"></i>
              <span>${bldg.rating}</span>
            </div>
            <span>•</span>
            <span class="text-xs text-emerald-600 font-medium">Open</span>
            <span>•</span>
            <span class="text-xs text-slate-500">${bldg.floors} Floors</span>
          </div>
        </div>
      </div>
    `).join('');

    DOM.popularPlacesList.innerHTML = listHtml;

    DOM.popularPlacesList.querySelectorAll('.place-card-mini').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-bldg-id');
        const bldg = window.CAMPUS_BUILDINGS.find(b => b.id === id);
        if (bldg) selectBuilding(bldg);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // Building Selection & Details
  // =========================================================================
  function selectBuilding(bldg) {
    state.selectedBuilding = bldg;

    DOM.viewExplore.style.display = 'none';
    DOM.viewDirections.style.display = 'none';
    DOM.viewBuildingDetails.style.display = 'block';
    DOM.sidebarPanel.classList.remove('collapsed');

    DOM.buildingHeroImg.src = encodeURI(bldg.heroImage);
    DOM.buildingCatBadge.textContent = bldg.category.toUpperCase();
    DOM.buildingName.textContent = bldg.name;
    DOM.buildingSubtitle.textContent = bldg.subtitle;
    DOM.buildingRating.textContent = bldg.rating;
    DOM.buildingReviews.textContent = bldg.reviewsCount;
    DOM.buildingHoursText.textContent = bldg.hours;
    DOM.buildingOccupancyText.textContent = bldg.busyLevel;
    DOM.buildingDescText.textContent = bldg.description;

    DOM.buildingTagsContainer.innerHTML = (bldg.tags || []).map(t => `
      <span class="eco-badge">${t}</span>
    `).join('');

    state.map.flyTo([bldg.center[0], bldg.center[1]], 18.5, { duration: 1.0 });

    if (bldg.indoorMap && bldg.indoorMap.floors && bldg.indoorMap.floors.length > 1) {
      DOM.floorSelectorWidget.classList.add('active');
    } else {
      DOM.floorSelectorWidget.classList.remove('active');
    }

    indoorRenderer.loadBuilding(bldg);

    if (window.lucide) window.lucide.createIcons();
  }

  function onIndoorRoomNavigate(building, floor, room) {
    openDirectionsView(
      { name: "Your Location", lat: state.userLocation.lat, lng: state.userLocation.lng },
      { name: `${building.name} - ${room.name}`, lat: building.center[0], lng: building.center[1], room: room }
    );
  }

  // =========================================================================
  // Search & Autocomplete
  // =========================================================================
  function handleSearchInput(query) {
    query = (query || '').trim().toLowerCase();

    if (!query) {
      DOM.searchClearBtn.classList.add('hidden');
      closeSearchDropdown();
      return;
    }

    DOM.searchClearBtn.classList.remove('hidden');

    const bldgMatches = window.CAMPUS_BUILDINGS.filter(b => 
      b.name.toLowerCase().includes(query) ||
      b.subtitle.toLowerCase().includes(query) ||
      (b.departments && b.departments.some(d => d.toLowerCase().includes(query))) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(query)))
    );

    const amenityMatches = window.CAMPUS_AMENITIES.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.type.toLowerCase().includes(query) ||
      (a.details && a.details.toLowerCase().includes(query))
    );

    const roomMatches = [];
    window.CAMPUS_BUILDINGS.forEach(b => {
      if (b.indoorMap && b.indoorMap.floors) {
        b.indoorMap.floors.forEach(f => {
          f.rooms.forEach(r => {
            if (r.id.toLowerCase().includes(query) || r.name.toLowerCase().includes(query)) {
              roomMatches.push({ room: r, building: b, floor: f });
            }
          });
        });
      }
    });

    const totalResults = [...bldgMatches, ...amenityMatches, ...roomMatches];

    if (totalResults.length === 0) {
      DOM.searchDropdown.innerHTML = `
        <div class="search-result-item" style="cursor: default;">
          <div class="search-result-sub">No AIT campus places found matching "${query}"</div>
        </div>
      `;
      DOM.searchDropdown.classList.add('show');
      return;
    }

    let dropdownHtml = '';

    bldgMatches.slice(0, 4).forEach(b => {
      dropdownHtml += `
        <div class="search-result-item" data-type="building" data-id="${b.id}">
          <div class="search-result-icon"><i data-lucide="${b.icon || 'map-pin'}" class="w-4 h-4"></i></div>
          <div class="search-result-details">
            <div class="search-result-title">${b.name}</div>
            <div class="search-result-sub">${b.subtitle}</div>
          </div>
          <span class="search-result-badge">${b.category}</span>
        </div>
      `;
    });

    roomMatches.slice(0, 3).forEach(item => {
      dropdownHtml += `
        <div class="search-result-item" data-type="room" data-bldg-id="${item.building.id}">
          <div class="search-result-icon"><i data-lucide="door-closed" class="w-4 h-4"></i></div>
          <div class="search-result-details">
            <div class="search-result-title">${item.room.id}: ${item.room.name}</div>
            <div class="search-result-sub">${item.building.name} • ${item.floor.name}</div>
          </div>
          <span class="search-result-badge">Lab/Room</span>
        </div>
      `;
    });

    amenityMatches.slice(0, 3).forEach(a => {
      dropdownHtml += `
        <div class="search-result-item" data-type="amenity" data-id="${a.id}">
          <div class="search-result-icon"><i data-lucide="${a.icon || 'sparkles'}" class="w-4 h-4"></i></div>
          <div class="search-result-details">
            <div class="search-result-title">${a.name}</div>
            <div class="search-result-sub">${a.details || ''}</div>
          </div>
          <span class="search-result-badge">${a.type.toUpperCase()}</span>
        </div>
      `;
    });

    DOM.searchDropdown.innerHTML = dropdownHtml;
    DOM.searchDropdown.classList.add('show');

    DOM.searchDropdown.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        if (type === 'building' || type === 'room') {
          const bId = item.getAttribute('data-id') || item.getAttribute('data-bldg-id');
          const bldg = window.CAMPUS_BUILDINGS.find(b => b.id === bId);
          if (bldg) {
            selectBuilding(bldg);
            DOM.searchInput.value = bldg.name;
          }
        } else if (type === 'amenity') {
          const aId = item.getAttribute('data-id');
          const a = window.CAMPUS_AMENITIES.find(x => x.id === aId);
          if (a) {
            state.map.flyTo([a.lat, a.lng], 19, { duration: 1.0 });
            DOM.searchInput.value = a.name;
          }
        }
        closeSearchDropdown();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function closeSearchDropdown() {
    DOM.searchDropdown.classList.remove('show');
  }

  function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    DOM.voiceSearchBtn.classList.add('active');
    DOM.searchInput.placeholder = "Listening... e.g. Central Wing, Aryabhatta, OBH";

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      DOM.searchInput.value = speechResult;
      handleSearchInput(speechResult);
      DOM.voiceSearchBtn.classList.remove('active');
      DOM.searchInput.placeholder = "Search AIT buildings, labs, hostels, mess...";
    };

    recognition.onerror = () => {
      DOM.voiceSearchBtn.classList.remove('active');
      DOM.searchInput.placeholder = "Search AIT buildings, labs, hostels, mess...";
    };

    recognition.onend = () => {
      DOM.voiceSearchBtn.classList.remove('active');
    };

    recognition.start();
  }

  // =========================================================================
  // Category Filter Chips
  // =========================================================================
  function filterCategory(cat) {
    state.activeCategory = cat;

    DOM.categoryChips.forEach(chip => {
      if (chip.getAttribute('data-category') === cat) chip.classList.add('active');
      else chip.classList.remove('active');
    });

    state.buildingPolygons.forEach(item => {
      if (cat === 'all' || item.category === cat) {
        item.poly.setStyle({ opacity: 0.85, fillOpacity: 0.35 });
      } else {
        item.poly.setStyle({ opacity: 0.2, fillOpacity: 0.05 });
      }
    });

    state.buildingMarkers.forEach(item => {
      if (cat === 'all' || item.category === cat) {
        item.marker.setOpacity(1.0);
      } else {
        item.marker.setOpacity(0.25);
      }
    });
  }

  // =========================================================================
  // Directions & Navigation Calculation
  // =========================================================================
  function openDirectionsView(startObj, destObj) {
    DOM.viewExplore.style.display = 'none';
    DOM.viewBuildingDetails.style.display = 'none';
    DOM.viewDirections.style.display = 'block';
    DOM.sidebarPanel.classList.remove('collapsed');

    if (startObj) DOM.routeStartInput.value = startObj.name || "Your Location";
    if (destObj) DOM.routeDestInput.value = destObj.name || "";

    calculateActiveRoute();
  }

  function calculateActiveRoute() {
    const startCoord = state.userLocation;
    let endCoord = null;

    if (state.selectedBuilding) {
      endCoord = { lat: state.selectedBuilding.center[0], lng: state.selectedBuilding.center[1] };
    } else {
      const defaultDest = window.CAMPUS_BUILDINGS.find(b => b.id === 'lib-aryabhatta');
      endCoord = { lat: defaultDest.center[0], lng: defaultDest.center[1] };
      DOM.routeDestInput.value = defaultDest.name;
    }

    const route = router.calculateRoute(startCoord, endCoord, state.activeMode);
    state.currentRoute = route;

    if (!route) {
      DOM.routeDurationText.textContent = "No Path Found";
      DOM.routeDistanceText.textContent = "";
      return;
    }

    DOM.routeDurationText.textContent = `${route.durationMinutes} min`;
    DOM.routeDistanceText.textContent = `(${route.totalDistance} meters)`;

    DOM.routeEcoBadges.innerHTML = `
      <span class="eco-badge"><i data-lucide="footprints" class="w-3.5 h-3.5"></i> ${route.metrics.steps} steps</span>
      <span class="eco-badge"><i data-lucide="flame" class="w-3.5 h-3.5 text-orange-500"></i> ${route.metrics.calories} kcal</span>
      <span class="eco-badge"><i data-lucide="leaf" class="w-3.5 h-3.5 text-emerald-500"></i> ${route.metrics.co2SavedGrams}g CO₂ saved</span>
    `;

    DOM.turnStepsList.innerHTML = route.instructions.map((step) => `
      <div class="turn-step-item">
        <div class="turn-icon-box">
          <i data-lucide="${step.icon || 'arrow-up'}" class="w-4 h-4"></i>
        </div>
        <div class="turn-text-content">
          <div class="turn-instruction">${step.text}</div>
          ${step.distance > 0 ? `<div class="turn-dist-sub">${step.distance} meters</div>` : ''}
          ${step.subtext ? `<div class="turn-dist-sub text-blue-600 font-medium">${step.subtext}</div>` : ''}
        </div>
      </div>
    `).join('');

    if (state.activeRoutePolyline) {
      state.map.removeLayer(state.activeRoutePolyline);
    }

    state.activeRoutePolyline = L.polyline(route.coordinates, {
      color: '#1a73e8',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(state.map);

    state.map.fitBounds(state.activeRoutePolyline.getBounds(), {
      padding: [80, 80]
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // Live Navigation Simulation & HUD
  // =========================================================================
  function startLiveNavigation() {
    if (!state.currentRoute || !state.currentRoute.coordinates || state.currentRoute.coordinates.length < 2) return;

    state.isNavigating = true;
    state.navStepIndex = 0;
    state.navSubCoordIndex = 0;
    state.navSpeedMultiplier = 1;

    DOM.sidebarPanel.classList.add('collapsed');
    DOM.liveNavHudTop.classList.add('active');
    DOM.liveNavHudBottom.classList.add('active');

    playTurnChime();
    speakVoiceGuidance(`Starting navigation to ${state.selectedBuilding ? state.selectedBuilding.name : 'destination'}. Head along the campus pathway.`);

    updateLiveNavHUD();

    if (state.navInterval) clearInterval(state.navInterval);
    state.navInterval = setInterval(stepLiveNavSimulation, 1000 / state.navSpeedMultiplier);
  }

  function stepLiveNavSimulation() {
    if (!state.isNavigating || !state.currentRoute) return;

    const coords = state.currentRoute.coordinates;
    if (state.navSubCoordIndex < coords.length - 1) {
      state.navSubCoordIndex++;
      const currentCoord = coords[state.navSubCoordIndex];

      state.userLocation = { lat: currentCoord[0], lng: currentCoord[1] };
      state.userMarker.setLatLng([currentCoord[0], currentCoord[1]]);
      state.map.panTo([currentCoord[0], currentCoord[1]], { animate: true, duration: 0.5 });

      updateLiveNavHUD();
    } else {
      endLiveNavigation(true);
    }
  }

  function updateLiveNavHUD() {
    if (!state.currentRoute) return;

    const coords = state.currentRoute.coordinates;
    const remainingCount = coords.length - 1 - state.navSubCoordIndex;
    const remainingMeters = Math.max(0, remainingCount * 25);
    const etaMins = Math.max(1, Math.round(remainingMeters / 80));

    DOM.hudRemainingText.textContent = `${remainingMeters} m remaining • ${etaMins} min`;
    DOM.hudEtaText.textContent = `ETA: ${etaMins} min`;

    const instructions = state.currentRoute.instructions;
    const instIdx = Math.min(Math.floor((state.navSubCoordIndex / coords.length) * instructions.length), instructions.length - 1);
    const activeInst = instructions[instIdx];

    if (activeInst) {
      DOM.hudInstructionText.textContent = activeInst.text;
      DOM.hudDistanceText.textContent = `In ${Math.max(10, remainingMeters)} m`;

      if (activeInst.text !== state.lastSpokenInstruction) {
        playTurnChime();
        speakVoiceGuidance(activeInst.text);
      }
    }
  }

  function endLiveNavigation(arrived = false) {
    state.isNavigating = false;
    if (state.navInterval) clearInterval(state.navInterval);

    DOM.liveNavHudTop.classList.remove('active');
    DOM.liveNavHudBottom.classList.remove('active');
    DOM.sidebarPanel.classList.remove('collapsed');

    if (arrived) {
      playTurnChime();
      speakVoiceGuidance("You have arrived at your destination!");
      alert("🎉 You have arrived at your destination!");
    }
  }

  // =========================================================================
  // Modals & Timetable Initialization
  // =========================================================================
  function initModals() {
    const schedContainer = document.getElementById('schedule-classes-container');
    if (schedContainer) {
      schedContainer.innerHTML = window.SAMPLE_STUDENT_SCHEDULE.map(c => `
        <div class="schedule-class-card ${c.isNext ? 'next-class' : ''}">
          <div>
            <span class="class-time-tag">${c.time} • ${c.days}</span>
            <h4 class="class-title">${c.courseCode}: ${c.courseName}</h4>
            <p class="class-location"><i data-lucide="map-pin" class="w-3.5 h-3.5 inline"></i> ${c.buildingName} - ${c.room}</p>
          </div>
          <button class="indoor-nav-btn" data-class-bldg="${c.buildingId}" data-class-room="${c.room}">
            <i data-lucide="navigation-2" class="w-3.5 h-3.5"></i>
            <span>Route</span>
          </button>
        </div>
      `).join('');

      schedContainer.querySelectorAll('.indoor-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const bId = btn.getAttribute('data-class-bldg');
          const room = btn.getAttribute('data-class-room');
          const bldg = window.CAMPUS_BUILDINGS.find(b => b.id === bId);
          if (bldg) {
            closeModal('modal-schedule');
            selectBuilding(bldg);
            openDirectionsView(
              { name: "Your Location", lat: state.userLocation.lat, lng: state.userLocation.lng },
              { name: `${bldg.name} (${room})`, lat: bldg.center[0], lng: bldg.center[1] }
            );
          }
        });
      });
    }

    const tourContainer = document.getElementById('tour-carousel-container');
    if (tourContainer) {
      tourContainer.innerHTML = `
        <div class="space-y-4">
          <div class="building-hero-container" style="height: 240px;">
            <img src="central%20wing.jpg" class="building-hero-img" alt="AIT Central Wing">
            <span class="building-category-tag">Real Photo • Central Wing</span>
          </div>
          <h4 class="font-bold text-slate-800 dark:text-white">Central Wing (Main Academic Block)</h4>
          <p class="text-xs text-slate-500">The iconic heritage dome, central archway, and flagpole garden of Army Institute of Technology, Pune.</p>

          <div class="building-hero-container" style="height: 240px; margin-top: 16px;">
            <img src="aryabhata%20center.jpg" class="building-hero-img" alt="Aryabhatta Centre">
            <span class="building-category-tag">Real Photo • Aryabhatta Centre</span>
          </div>
          <h4 class="font-bold text-slate-800 dark:text-white">Aryabhatta Centre (Central Library)</h4>
          <p class="text-xs text-slate-500">Entrance portico, ramp, air-conditioned reading halls, and digital research terminals.</p>
        </div>
      `;
    }

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-close-modal');
        closeModal(id);
      });
    });
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  function initEventListeners() {
    DOM.menuToggleBtn.addEventListener('click', () => {
      DOM.sidebarPanel.classList.toggle('collapsed');
    });

    DOM.searchInput.addEventListener('input', (e) => handleSearchInput(e.target.value));
    DOM.searchClearBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      handleSearchInput('');
    });

    DOM.voiceSearchBtn.addEventListener('click', startVoiceSearch);

    DOM.openDirectionsBtn.addEventListener('click', () => {
      openDirectionsView();
    });

    DOM.categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-category');
        filterCategory(cat);
      });
    });

    DOM.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        DOM.modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeMode = tab.getAttribute('data-mode');
        calculateActiveRoute();
      });
    });

    DOM.routeSwapBtn.addEventListener('click', () => {
      const temp = DOM.routeStartInput.value;
      DOM.routeStartInput.value = DOM.routeDestInput.value;
      DOM.routeDestInput.value = temp;
      calculateActiveRoute();
    });

    DOM.startNavBtn.addEventListener('click', startLiveNavigation);

    DOM.bldgDirectionsBtn.addEventListener('click', () => {
      openDirectionsView(
        { name: "Your Location", lat: state.userLocation.lat, lng: state.userLocation.lng },
        state.selectedBuilding
      );
    });

    DOM.bldgIndoorBtn.addEventListener('click', () => {
      const target = document.getElementById('building-indoor-container');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });

    DOM.ctrlLayerToggle.addEventListener('click', () => {
      if (state.tileStyle === 'light') setTileLayer('dark');
      else if (state.tileStyle === 'dark') setTileLayer('satellite');
      else setTileLayer('light');
    });

    DOM.ctrl3dToggle.addEventListener('click', () => {
      state.is3DMode = !state.is3DMode;
      DOM.ctrl3dToggle.classList.toggle('active', state.is3DMode);
      renderBuildingPolygons();
    });

    DOM.ctrlRecenterBtn.addEventListener('click', () => {
      state.map.flyTo([state.userLocation.lat, state.userLocation.lng], 18, { duration: 0.8 });
    });

    DOM.ctrlSosBtn.addEventListener('click', () => openModal('modal-sos'));

    document.getElementById('tool-my-class').addEventListener('click', () => openModal('modal-schedule'));
    document.getElementById('tool-campus-tour').addEventListener('click', () => openModal('modal-virtual-tour'));
    document.getElementById('tool-shuttle-tracker').addEventListener('click', () => {
      if (state.shuttlePolyline) {
        state.map.fitBounds(state.shuttlePolyline.getBounds(), { padding: [60, 60] });
      }
    });
    document.getElementById('tool-night-safety').addEventListener('click', () => openModal('modal-sos'));

    document.getElementById('track-shuttle-btn').addEventListener('click', () => {
      if (state.shuttleMarkers[0]) {
        state.map.flyTo(state.shuttleMarkers[0].marker.getLatLng(), 18, { duration: 0.8 });
      }
    });

    DOM.navEndTripBtn.addEventListener('click', () => endLiveNavigation(false));

    DOM.navSpeedMultiplierBtn.addEventListener('click', () => {
      if (state.navSpeedMultiplier === 1) state.navSpeedMultiplier = 2;
      else if (state.navSpeedMultiplier === 2) state.navSpeedMultiplier = 5;
      else state.navSpeedMultiplier = 1;

      DOM.navSpeedMultiplierBtn.textContent = `${state.navSpeedMultiplier}x Speed`;
      if (state.navInterval) {
        clearInterval(state.navInterval);
        state.navInterval = setInterval(stepLiveNavSimulation, 1000 / state.navSpeedMultiplier);
      }
    });

    DOM.navVoiceMuteBtn.addEventListener('click', () => {
      state.voiceGuidanceEnabled = !state.voiceGuidanceEnabled;
      DOM.navVoiceMuteBtn.classList.toggle('active', state.voiceGuidanceEnabled);
    });

    document.getElementById('route-nearest-sos-btn').addEventListener('click', () => {
      closeModal('modal-sos');
      const sosStation = window.CAMPUS_AMENITIES.find(a => a.type === 'sos');
      if (sosStation) {
        openDirectionsView(
          { name: "Your Location", lat: state.userLocation.lat, lng: state.userLocation.lng },
          { name: sosStation.name, lat: sosStation.lat, lng: sosStation.lng }
        );
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
