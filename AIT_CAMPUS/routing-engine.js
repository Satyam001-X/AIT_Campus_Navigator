// routing-engine.js - A* & Dijkstra Multi-Modal Campus Routing Engine

class CampusRouter {
  constructor(graph, buildings, shuttles) {
    this.graph = graph || window.CAMPUS_GRAPH;
    this.buildings = buildings || window.CAMPUS_BUILDINGS;
    this.shuttles = shuttles || window.CAMPUS_SHUTTLES;
    this.adjacencyList = this.buildAdjacencyList();
  }

  // Pre-process graph edges into adjacency lookup
  buildAdjacencyList() {
    const adj = {};
    for (const nodeId in this.graph.nodes) {
      adj[nodeId] = [];
    }

    this.graph.edges.forEach(edge => {
      if (!adj[edge.u]) adj[edge.u] = [];
      if (!adj[edge.v]) adj[edge.v] = [];

      adj[edge.u].push({
        node: edge.v,
        dist: edge.dist,
        bikeSafe: edge.bikeSafe !== false,
        accessible: edge.accessible !== false
      });

      adj[edge.v].push({
        node: edge.u,
        dist: edge.dist,
        bikeSafe: edge.bikeSafe !== false,
        accessible: edge.accessible !== false
      });
    });

    return adj;
  }

  // Calculate distance between two lat/lng coordinates using Haversine formula (in meters)
  static getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculate compass bearing between two points (0 - 360 deg)
  static getBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    return (θ * 180 / Math.PI + 360) % 360;
  }

  // Find nearest graph node to any given lat/lng
  findNearestNode(lat, lng, requireAccessible = false) {
    let nearestNodeId = null;
    let minDist = Infinity;

    for (const [nodeId, data] of Object.entries(this.graph.nodes)) {
      if (requireAccessible && data.isAccessible === false) continue;

      const dist = CampusRouter.getHaversineDistance(lat, lng, data.lat, data.lng);
      if (dist < minDist) {
        minDist = dist;
        nearestNodeId = nodeId;
      }
    }

    return { nodeId: nearestNodeId, distance: minDist };
  }

  // A* Shortest Path Search on Graph
  findShortestPath(startNodeId, endNodeId, mode = "walk") {
    if (!this.graph.nodes[startNodeId] || !this.graph.nodes[endNodeId]) {
      return null;
    }

    if (startNodeId === endNodeId) {
      const node = this.graph.nodes[startNodeId];
      return {
        path: [startNodeId],
        coordinates: [[node.lat, node.lng]],
        totalDistance: 0,
        mode: mode
      };
    }

    const endNode = this.graph.nodes[endNodeId];
    const openSet = [startNodeId];
    const cameFrom = {};

    const gScore = {};
    const fScore = {};

    for (const nodeId in this.graph.nodes) {
      gScore[nodeId] = Infinity;
      fScore[nodeId] = Infinity;
    }

    gScore[startNodeId] = 0;
    fScore[startNodeId] = CampusRouter.getHaversineDistance(
      this.graph.nodes[startNodeId].lat,
      this.graph.nodes[startNodeId].lng,
      endNode.lat,
      endNode.lng
    );

    while (openSet.length > 0) {
      // Find node in openSet with lowest fScore
      let current = openSet[0];
      let lowestF = fScore[current];
      let lowestIdx = 0;

      for (let i = 1; i < openSet.length; i++) {
        const item = openSet[i];
        if (fScore[item] < lowestF) {
          lowestF = fScore[item];
          current = item;
          lowestIdx = i;
        }
      }

      if (current === endNodeId) {
        // Reconstruct path
        const path = [current];
        while (cameFrom[current]) {
          current = cameFrom[current];
          path.unshift(current);
        }

        const coordinates = path.map(id => [this.graph.nodes[id].lat, this.graph.nodes[id].lng]);
        return {
          path: path,
          coordinates: coordinates,
          totalDistance: Math.round(gScore[endNodeId]),
          mode: mode
        };
      }

      openSet.splice(lowestIdx, 1);

      const neighbors = this.adjacencyList[current] || [];
      for (const edge of neighbors) {
        // Check mode restrictions
        if (mode === "accessible" && !edge.accessible) continue;
        if (mode === "bike" && !edge.bikeSafe) continue;

        let edgeCost = edge.dist;
        if (mode === "bike") {
          // Biking prefers longer open roads over pedestrian zigzags
          edgeCost = edge.bikeSafe ? edge.dist * 0.9 : edge.dist * 2.0;
        }

        const tentativeGScore = gScore[current] + edgeCost;

        if (tentativeGScore < gScore[edge.node]) {
          cameFrom[edge.node] = current;
          gScore[edge.node] = tentativeGScore;

          const neighborNode = this.graph.nodes[edge.node];
          const h = CampusRouter.getHaversineDistance(
            neighborNode.lat,
            neighborNode.lng,
            endNode.lat,
            endNode.lng
          );
          fScore[edge.node] = tentativeGScore + h;

          if (!openSet.includes(edge.node)) {
            openSet.push(edge.node);
          }
        }
      }
    }

    return null; // No path found
  }

  // Calculate Shuttle Combined Route
  calculateShuttleRoute(startCoord, endCoord) {
    if (!this.shuttles || this.shuttles.length === 0) {
      return this.calculateRoute(startCoord, endCoord, "walk");
    }

    const shuttle = this.shuttles[0];
    // Find closest pickup shuttle stop to start
    let nearestPickup = null;
    let minPickupDist = Infinity;
    shuttle.stops.forEach((stop, idx) => {
      const d = CampusRouter.getHaversineDistance(startCoord.lat, startCoord.lng, stop.lat, stop.lng);
      if (d < minPickupDist) {
        minPickupDist = d;
        nearestPickup = { stop, idx, dist: d };
      }
    });

    // Find closest drop-off shuttle stop to destination
    let nearestDropoff = null;
    let minDropoffDist = Infinity;
    shuttle.stops.forEach((stop, idx) => {
      const d = CampusRouter.getHaversineDistance(endCoord.lat, endCoord.lng, stop.lat, stop.lng);
      if (d < minDropoffDist) {
        minDropoffDist = d;
        nearestDropoff = { stop, idx, dist: d };
      }
    });

    // Direct walk comparison
    const walkRoute = this.calculateRoute(startCoord, endCoord, "walk");

    // If shuttle stops are the same or direct walk is super short, recommend walking
    if (!nearestPickup || !nearestDropoff || nearestPickup.idx === nearestDropoff.idx || (walkRoute && walkRoute.totalDistance < 250)) {
      return walkRoute;
    }

    // Calculate leg 1: Walk to pickup stop
    const leg1 = this.calculateRoute(startCoord, { lat: nearestPickup.stop.lat, lng: nearestPickup.stop.lng }, "walk");

    // Calculate leg 2: Shuttle ride path
    const busPath = [];
    const fullLoop = shuttle.routePath;
    // Find subsegment on loop
    const pIdx = fullLoop.findIndex(pt => CampusRouter.getHaversineDistance(pt[0], pt[1], nearestPickup.stop.lat, nearestPickup.stop.lng) < 60);
    const dIdx = fullLoop.findIndex(pt => CampusRouter.getHaversineDistance(pt[0], pt[1], nearestDropoff.stop.lat, nearestDropoff.stop.lng) < 60);

    if (pIdx !== -1 && dIdx !== -1) {
      let cur = pIdx;
      while (cur !== dIdx) {
        busPath.push(fullLoop[cur]);
        cur = (cur + 1) % fullLoop.length;
      }
      busPath.push(fullLoop[dIdx]);
    } else {
      busPath.push([nearestPickup.stop.lat, nearestPickup.stop.lng], [nearestDropoff.stop.lat, nearestDropoff.stop.lng]);
    }

    let busDist = 0;
    for (let i = 0; i < busPath.length - 1; i++) {
      busDist += CampusRouter.getHaversineDistance(busPath[i][0], busPath[i][1], busPath[i+1][0], busPath[i+1][1]);
    }

    // Calculate leg 3: Walk from drop-off to destination
    const leg3 = this.calculateRoute({ lat: nearestDropoff.stop.lat, lng: nearestDropoff.stop.lng }, endCoord, "walk");

    const fullCoordinates = [
      ...(leg1 ? leg1.coordinates : [[startCoord.lat, startCoord.lng]]),
      ...busPath,
      ...(leg3 ? leg3.coordinates : [[endCoord.lat, endCoord.lng]])
    ];

    const totalDist = (leg1 ? leg1.totalDistance : 0) + Math.round(busDist) + (leg3 ? leg3.totalDistance : 0);
    const walkMins = Math.round(((leg1 ? leg1.totalDistance : 0) + (leg3 ? leg3.totalDistance : 0)) / 80);
    const busWaitAndRideMins = 3 + Math.round(busDist / 400);
    const totalMinutes = Math.max(2, walkMins + busWaitAndRideMins);

    // Build multimodal step-by-step instructions
    const instructions = [];
    if (leg1 && leg1.instructions.length > 0) {
      instructions.push({
        text: `Walk to ${nearestPickup.stop.name} (${Math.round(leg1.totalDistance)}m)`,
        icon: "footprints",
        distance: leg1.totalDistance,
        action: "walk"
      });
    }

    instructions.push({
      text: `Board Blue Line Shuttle at ${nearestPickup.stop.name}`,
      icon: "bus",
      subtext: `Next bus in ~2-4 mins • Ride ${Math.round(busDist)}m (~${busWaitAndRideMins} min)`,
      distance: Math.round(busDist),
      action: "transit"
    });

    instructions.push({
      text: `Alight from Shuttle at ${nearestDropoff.stop.name}`,
      icon: "log-out",
      distance: 0,
      action: "transfer"
    });

    if (leg3 && leg3.instructions.length > 0) {
      instructions.push({
        text: `Walk to destination (${Math.round(leg3.totalDistance)}m)`,
        icon: "flag",
        distance: leg3.totalDistance,
        action: "arrive"
      });
    }

    return {
      mode: "shuttle",
      totalDistance: totalDist,
      durationMinutes: totalMinutes,
      coordinates: fullCoordinates,
      instructions: instructions,
      transitSegments: {
        walkToStop: leg1 ? leg1.coordinates : [],
        shuttleSegment: busPath,
        walkFromStop: leg3 ? leg3.coordinates : []
      },
      metrics: {
        steps: Math.round(((leg1 ? leg1.totalDistance : 0) + (leg3 ? leg3.totalDistance : 0)) / 0.75),
        calories: Math.round(walkMins * 4.5),
        co2SavedGrams: Math.round(totalDist * 0.12)
      }
    };
  }

  // Master Route calculation method
  calculateRoute(startCoord, endCoord, mode = "walk") {
    if (mode === "shuttle") {
      return this.calculateShuttleRoute(startCoord, endCoord);
    }

    const isAccessible = (mode === "accessible");
    const startNearest = this.findNearestNode(startCoord.lat, startCoord.lng, isAccessible);
    const endNearest = this.findNearestNode(endCoord.lat, endCoord.lng, isAccessible);

    if (!startNearest.nodeId || !endNearest.nodeId) {
      return null;
    }

    const graphResult = this.findShortestPath(startNearest.nodeId, endNearest.nodeId, mode);
    if (!graphResult) return null;

    // Connect user start point to first node, and last node to destination
    const fullCoordinates = [];
    let extraDist = 0;

    if (startNearest.distance > 8) {
      fullCoordinates.push([startCoord.lat, startCoord.lng]);
      extraDist += startNearest.distance;
    }

    graphResult.coordinates.forEach(coord => fullCoordinates.push(coord));

    if (endNearest.distance > 8) {
      fullCoordinates.push([endCoord.lat, endCoord.lng]);
      extraDist += endNearest.distance;
    }

    const totalDist = Math.round(graphResult.totalDistance + extraDist);

    // Speeds:
    // walk: 80 m/min (~4.8 km/h)
    // bike: 250 m/min (~15 km/h)
    // accessible: 65 m/min (~3.9 km/h)
    let speedMetersPerMin = 80;
    if (mode === "bike") speedMetersPerMin = 250;
    if (mode === "accessible") speedMetersPerMin = 65;

    const durationMinutes = Math.max(1, Math.round(totalDist / speedMetersPerMin));

    // Generate Turn-by-Turn Instructions
    const instructions = this.generateInstructions(fullCoordinates, graphResult.path, mode);

    return {
      mode: mode,
      totalDistance: totalDist,
      durationMinutes: durationMinutes,
      coordinates: fullCoordinates,
      pathNodeIds: graphResult.path,
      instructions: instructions,
      metrics: {
        steps: mode === "bike" ? 0 : Math.round(totalDist / 0.75),
        calories: Math.round(durationMinutes * (mode === "bike" ? 7.2 : 4.6)),
        co2SavedGrams: Math.round(totalDist * 0.14)
      }
    };
  }

  // Turn-by-Turn Generator with Cardinal & Relative Directions
  generateInstructions(coordinates, pathNodeIds, mode) {
    const instructions = [];
    if (!coordinates || coordinates.length < 2) {
      return [{ text: "Proceed to destination", icon: "navigation", distance: 0, bearing: 0 }];
    }

    // Initial instruction
    const initialBearing = CampusRouter.getBearing(
      coordinates[0][0], coordinates[0][1],
      coordinates[1][0], coordinates[1][1]
    );

    let startHeadingText = "Head North";
    if (initialBearing >= 337.5 || initialBearing < 22.5) startHeadingText = "Head North";
    else if (initialBearing < 67.5) startHeadingText = "Head North-East";
    else if (initialBearing < 112.5) startHeadingText = "Head East";
    else if (initialBearing < 157.5) startHeadingText = "Head South-East";
    else if (initialBearing < 202.5) startHeadingText = "Head South";
    else if (initialBearing < 247.5) startHeadingText = "Head South-West";
    else if (initialBearing < 292.5) startHeadingText = "Head West";
    else startHeadingText = "Head North-West";

    const firstSegmentDist = Math.round(CampusRouter.getHaversineDistance(
      coordinates[0][0], coordinates[0][1],
      coordinates[1][0], coordinates[1][1]
    ));

    instructions.push({
      text: `${startHeadingText} on campus walkway`,
      icon: "arrow-up",
      distance: firstSegmentDist,
      bearing: initialBearing,
      action: "straight",
      coord: coordinates[0]
    });

    // Middle Turn Instructions
    for (let i = 1; i < coordinates.length - 1; i++) {
      const pPrev = coordinates[i - 1];
      const pCur = coordinates[i];
      const pNext = coordinates[i + 1];

      const b1 = CampusRouter.getBearing(pPrev[0], pPrev[1], pCur[0], pCur[1]);
      const b2 = CampusRouter.getBearing(pCur[0], pCur[1], pNext[0], pNext[1]);

      let diff = b2 - b1;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;

      const segDist = Math.round(CampusRouter.getHaversineDistance(pCur[0], pCur[1], pNext[0], pNext[1]));

      let turnText = "Continue straight";
      let turnIcon = "arrow-up";
      let action = "straight";

      if (diff >= 30 && diff < 65) {
        turnText = "Bear slight right";
        turnIcon = "arrow-up-right";
        action = "slight-right";
      } else if (diff >= 65 && diff < 125) {
        turnText = "Turn right";
        turnIcon = "corner-up-right";
        action = "right";
      } else if (diff >= 125) {
        turnText = "Make a sharp right";
        turnIcon = "rotate-cw";
        action = "sharp-right";
      } else if (diff <= -30 && diff > -65) {
        turnText = "Bear slight left";
        turnIcon = "arrow-up-left";
        action = "slight-left";
      } else if (diff <= -65 && diff > -125) {
        turnText = "Turn left";
        turnIcon = "corner-up-left";
        action = "left";
      } else if (diff <= -125) {
        turnText = "Make a sharp left";
        turnIcon = "rotate-ccw";
        action = "sharp-left";
      }

      // Check if this node matches a known landmark or building entrance
      const matchedNodeId = pathNodeIds && pathNodeIds[i];
      const nodeInfo = matchedNodeId ? this.graph.nodes[matchedNodeId] : null;
      let landmarkDetail = "";

      if (nodeInfo && nodeInfo.name) {
        landmarkDetail = ` past ${nodeInfo.name}`;
      }

      instructions.push({
        text: `${turnText}${landmarkDetail}`,
        icon: turnIcon,
        distance: segDist,
        bearing: b2,
        action: action,
        coord: pCur
      });
    }

    // Final Arrival Instruction
    const lastCoord = coordinates[coordinates.length - 1];
    instructions.push({
      text: mode === "accessible"
        ? "Arrived at accessible destination entrance"
        : "You have arrived at your destination",
      icon: "map-pin",
      distance: 0,
      bearing: 0,
      action: "arrive",
      coord: lastCoord
    });

    return instructions;
  }
}

// Global Export
if (typeof window !== "undefined") {
  window.CampusRouter = CampusRouter;
}
