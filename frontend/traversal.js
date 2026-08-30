/* ============================================
   Graph BFS/DFS Traversal — Animated Visualization
   ============================================ */

// ===== TRAVERSAL STATE =====

var travTimers = [];
var travVisited = [];
var travCurrent = null;
var travMapPositions = {
    "Colombo":      { x: 100, y: 130 },
    "Kandy":        { x: 280, y: 60 },
    "Badulla":      { x: 480, y: 60 },
    "Galle":        { x: 220, y: 210 },
    "Matara":       { x: 370, y: 210 },
    "Anuradhapura": { x: 380, y: 130 },
    "Jaffna":       { x: 530, y: 130 }
};
var travSvgWidth = 620;
var travSvgHeight = 280;

// ===== BUILD ADJACENCY LIST =====

function buildAdj() {
    var adj = {};
    stations.forEach(function (s) { adj[s] = []; });
    routes.forEach(function (r) {
        adj[r.from].push({ to: r.to, distance: r.distance });
        adj[r.to].push({ to: r.from, distance: r.distance });
    });
    return adj;
}

// ===== BFS STEP GENERATOR =====

function generateBFSSteps(start) {
    var adj = buildAdj();
    var visited = {};
    var queue = [start];
    visited[start] = true;
    var order = [];
    var steps = [];
    var lineMap = {
        start: 0, enqueue: 1, mark: 2, whileLoop: 3,
        dequeue: 4, process: 5, neighbors: 6,
        check: 7, visitNeighbor: 8, enqueueN: 9, done: 10
    };

    steps.push({ line: lineMap.start, type: 't-enqueue', text: '🚀 Starting BFS from <strong>' + start + '</strong>' });
    steps.push({ line: lineMap.enqueue, type: 't-enqueue', text: 'Enqueue <strong>' + start + '</strong> into queue' });
    steps.push({ line: lineMap.mark, type: 't-visit', text: 'Mark <strong>' + start + '</strong> as visited' });

    while (queue.length > 0) {
        steps.push({ line: lineMap.whileLoop, type: 't-check', text: 'Queue not empty (' + queue.length + ' items). Loop continues...' });

        var current = queue.shift();
        steps.push({ line: lineMap.dequeue, type: 't-explore', text: 'Dequeue <strong>' + current + '</strong> from front' });
        steps.push({ line: lineMap.process, type: 't-visit', text: '✅ Visiting <strong>' + current + '</strong> (' + (order.length + 1) + '/' + stations.length + ')' });
        order.push(current);

        var neighbors = adj[current];
        steps.push({ line: lineMap.neighbors, type: 't-check', text: 'Checking neighbors of <strong>' + current + '</strong>: [' + neighbors.map(function (n) { return n.to; }).join(', ') + ']' });

        for (var i = 0; i < neighbors.length; i++) {
            var nb = neighbors[i].to;
            var dist = neighbors[i].distance;
            if (!visited[nb]) {
                steps.push({ line: lineMap.check, type: 't-check', text: nb + ' visited? → NO (' + dist + ' km)' });
                steps.push({ line: lineMap.visitNeighbor, type: 't-enqueue', text: 'Mark <strong>' + nb + '</strong> as visited & enqueue' });
                visited[nb] = true;
                queue.push(nb);
            } else {
                steps.push({ line: lineMap.check, type: 't-check', text: nb + ' visited? → YES (skip)' });
            }
        }
    }

    steps.push({ line: lineMap.done, type: 't-result', text: '🏁 BFS Complete! Visited all <strong>' + order.length + '</strong> stations' });
    return { steps: steps, order: order };
}

// ===== DFS STEP GENERATOR =====

function generateDFSSteps(start) {
    var adj = buildAdj();
    var visited = {};
    var order = [];
    var steps = [];
    var lineMap = {
        call: 0, mark: 1, process: 2, forLoop: 3,
        check: 4, recurse: 5, returnStmt: 6, done: 7
    };

    steps.push({ line: lineMap.call, type: 't-push', text: '🚀 Starting DFS from <strong>' + start + '</strong>' });

    function dfsVisit(station, depth) {
        visited[station] = true;
        steps.push({ line: lineMap.mark, type: 't-visit', text: 'Mark <strong>' + station + '</strong> as visited' + (depth > 0 ? ' (depth: ' + depth + ')' : '') });
        order.push(station);
        steps.push({ line: lineMap.process, type: 't-visit', text: '✅ Processing <strong>' + station + '</strong> (' + order.length + '/' + stations.length + ')' });

        var neighbors = adj[station];
        steps.push({ line: lineMap.forLoop, type: 't-check', text: 'Exploring neighbors of <strong>' + station + '</strong>: [' + neighbors.map(function (n) { return n.to; }).join(', ') + ']' });

        for (var i = 0; i < neighbors.length; i++) {
            var nb = neighbors[i].to;
            steps.push({ line: lineMap.check, type: 't-check', text: 'Check ' + nb + ' → visited? ' + (visited[nb] ? 'YES (skip)' : 'NO') });
            if (!visited[nb]) {
                steps.push({ line: lineMap.recurse, type: 't-push', text: 'Recurse into <strong>' + nb + '</strong>' });
                dfsVisit(nb, depth + 1);
                steps.push({ line: lineMap.returnStmt, type: 't-explore', text: 'Return from <strong>' + nb + '</strong> back to <strong>' + station + '</strong>' });
            }
        }

        steps.push({ line: lineMap.returnStmt, type: 't-explore', text: 'Finished <strong>' + station + '</strong>' });
    }

    dfsVisit(start, 0);
    steps.push({ line: lineMap.done, type: 't-result', text: '🏁 DFS Complete! Visited all <strong>' + order.length + '</strong> stations' });
    return { steps: steps, order: order };
}

// ===== BFS JAVA CODE =====

var bfsJavaCode = [
    '// BFS — Breadth-First Search',
    'public void bfs(String start) {',
    '  int si = indexOf(start);',
    '  boolean[] visited = new boolean[N];',
    '  LinkedList<Integer> queue = new LinkedList<>();',
    '',
    '  visited[si] = true;',
    '  queue.add(si);',
    '',
    '  while (!queue.isEmpty()) {',
    '    int cur = queue.removeFirst();',
    '    System.out.print(stations[cur] + " ");',
    '',
    '    for (int i = 0; i < N; i++) {',
    '      if (adj[cur][i] > 0 && !visited[i]) {',
    '        visited[i] = true;',
    '        queue.add(i);',
    '      }',
    '    }',
    '  }',
    '}'
];

// ===== DFS JAVA CODE =====

var dfsJavaCode = [
    '// DFS — Depth-First Search',
    'public void dfs(String start) {',
    '  int si = indexOf(start);',
    '  boolean[] visited = new boolean[N];',
    '  dfs(si, visited);',
    '}',
    '',
    'private void dfs(int cur, boolean[] vis) {',
    '  vis[cur] = true;',
    '  System.out.print(stations[cur] + " ");',
    '',
    '  for (int i = 0; i < N; i++) {',
    '    if (adj[cur][i] > 0 && !vis[i]) {',
    '      dfs(i, vis);',
    '    }',
    '  }',
    '}'
];

// ===== POPULATE STATION SELECT =====

function populateTraversalSelect() {
    var sel = document.getElementById('traversalStart');
    if (!sel) return;
    sel.innerHTML = '';
    stations.forEach(function (s) {
        var opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        sel.appendChild(opt);
    });
}

// ===== RENDER MAP WITH VISITED STATIONS =====

function renderTraversalMap(currentStation, visitedSet, pathEdges) {
    pathEdges = pathEdges || [];
    var svgW = travSvgWidth;
    var svgH = travSvgHeight;
    var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" width="100%" style="max-height:280px;">';

    // Draw route lines (faded if unvisited)
    routes.forEach(function (route) {
        var from = travMapPositions[route.from];
        var to = travMapPositions[route.to];
        var bothVisited = visitedSet[route.from] && visitedSet[route.to];
        var strokeColor = bothVisited ? '#34a853' : '#dadce0';
        var sw = bothVisited ? 3 : 2;
        svg += '<line x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '" stroke="' + strokeColor + '" stroke-width="' + sw + '" stroke-linecap="round" />';
        var mx = (from.x + to.x) / 2;
        var my = (from.y + to.y) / 2;
        svg += '<text x="' + mx + '" y="' + (my - 8) + '" text-anchor="middle" fill="#5f6368" font-size="11">' + route.distance + ' km</text>';
    });

    // Draw animated path edges
    pathEdges.forEach(function (pe) {
        var from = travMapPositions[pe.from];
        var to = travMapPositions[pe.to];
        svg += '<line x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '" stroke="#ea4335" stroke-width="4" stroke-linecap="round" stroke-dasharray="8,4" opacity="0.7">' +
            '<animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.8s" repeatCount="indefinite"/>' +
            '</line>';
    });

    // Draw station nodes
    stations.forEach(function (station) {
        var pos = travMapPositions[station];
        var fillColor = '#1a73e8';
        var strokeW = 3;
        var r = 22;

        if (station === currentStation) {
            fillColor = '#fbbc04';
            r = 26;
            strokeW = 4;
        } else if (visitedSet[station]) {
            fillColor = '#34a853';
        }

        // Pulse animation for current station
        var pulse = '';
        if (station === currentStation) {
            pulse = '<circle r="22" fill="' + fillColor + '" opacity="0.3">' +
                '<animate attributeName="r" values="22;34;22" dur="1s" repeatCount="indefinite"/>' +
                '<animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite"/>' +
                '</circle>';
        }

        svg += pulse +
            '<g transform="translate(' + pos.x + ',' + pos.y + ')">' +
            '<circle r="' + r + '" fill="' + fillColor + '" stroke="#fff" stroke-width="' + strokeW + '"/>' +
            '<text y="1" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" dominant-baseline="middle">●</text>' +
            '<text y="' + (r + 14) + '" text-anchor="middle" fill="#202124" font-size="12" font-weight="500">' + station + '</text>' +
            '</g>';
    });

    svg += '</svg>';
    var mapEl = document.getElementById('routeMap');
    mapEl.innerHTML = svg;
    if (!document.getElementById('travOverlay')) {
        var ov = document.createElement('div');
        ov.id = 'travOverlay';
        ov.className = 'trav-overlay';
        mapEl.appendChild(ov);
    }
}

// ===== RENDER TRAVERSAL MAP (default unanimated) =====

function renderTraversalDefault() {
    var svgW = travSvgWidth;
    var svgH = travSvgHeight;
    var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" width="100%" style="max-height:280px;">';

    routes.forEach(function (route) {
        var from = travMapPositions[route.from];
        var to = travMapPositions[route.to];
        svg += '<line class="route-line" x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '"/>';
        var mx = (from.x + to.x) / 2;
        var my = (from.y + to.y) / 2;
        svg += '<text x="' + mx + '" y="' + (my - 8) + '" text-anchor="middle" fill="#5f6368" font-size="11">' + route.distance + ' km</text>';
    });

    stations.forEach(function (station) {
        var pos = travMapPositions[station];
        svg += '<g class="station-node" transform="translate(' + pos.x + ',' + pos.y + ')">' +
            '<circle r="22" fill="#1a73e8" stroke="#fff" stroke-width="3"/>' +
            '<text y="1" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">●</text>' +
            '<text y="36" text-anchor="middle" fill="#202124" font-size="12" font-weight="500">' + station + '</text>' +
            '</g>';
    });

    svg += '</svg>';
    var mapEl = document.getElementById('routeMap');
    mapEl.innerHTML = svg;
    if (!document.getElementById('travOverlay')) {
        var ov = document.createElement('div');
        ov.id = 'travOverlay';
        ov.className = 'trav-overlay';
        mapEl.appendChild(ov);
    }
}

// ===== RENDER CODE WITH LINE HIGHLIGHTS =====

function renderTraversalCode(codeLines, activeLine, doneLines) {
    var el = document.getElementById('traversalCodeBlock');
    if (!el) return;
    var html = '';
    codeLines.forEach(function (line, i) {
        var cls = '';
        if (i === activeLine) cls = 'active-line';
        else if (doneLines && doneLines.indexOf(i) !== -1) cls = 'done-line';
        var escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html += '<span class="code-line ' + cls + '"><span class="line-no">' + (i + 1) + '</span>' + escaped + '</span>\n';
    });
    el.innerHTML = html;
    if (activeLine !== undefined && activeLine >= 0) {
        var activeEl = el.querySelector('.active-line');
        if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ===== ADD STEP TO TRAVERSAL LOG =====

function addTravStep(step, num) {
    var container = document.getElementById('traversalSteps');
    if (num === 1) container.innerHTML = '';
    var div = document.createElement('div');
    div.className = 'traversal-step ' + step.type;
    div.innerHTML = '<span class="traversal-step-num">' + num + '</span>' +
        '<span class="traversal-step-text">' + step.text + '</span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ===== RUN STEP-BY-STEP =====

function clearTravTimers() {
    travTimers.forEach(function (t) { clearTimeout(t); });
    travTimers = [];
}

function runTraversalStepByStep() {
    clearTravTimers();
    var start = document.getElementById('traversalStart').value;
    var algo = document.getElementById('traversalAlgo').value;
    var speed = parseInt(document.getElementById('traversalSpeed').value) || 600;
    var panel = document.getElementById('traversalPanel');
    panel.classList.add('running');

    // Generate steps
    var result;
    var codeLines;
    if (algo === 'bfs') {
        result = generateBFSSteps(start);
        codeLines = bfsJavaCode;
    } else {
        result = generateDFSSteps(start);
        codeLines = dfsJavaCode;
    }

    var steps = result.steps;
    var order = result.order;

    // Reset
    document.getElementById('traversalSteps').innerHTML = '';
    document.getElementById('traversalResult').innerHTML = '';
    renderTraversalCode(codeLines, -1, []);

    // Build visited set incrementally for map
    var visitedSet = {};
    var orderIndex = 0;
    var doneLines = [];
    var lastPathEdges = [];

    steps.forEach(function (step, i) {
        var timer = setTimeout(function () {
            addTravStep(step, i + 1);
            doneLines.push(step.line);
            renderTraversalCode(codeLines, step.line, doneLines);

            // Determine which station is "current" based on the step
            var stationMentioned = step.text.match(/<strong>([^<]+)<\/strong>/);
            var stationName = stationMentioned ? stationMentioned[1] : null;

            // Track visit order for map
            if (step.type === 't-visit' && stationName && stations.indexOf(stationName) !== -1) {
                visitedSet[stationName] = true;
            }

            // Draw map
            var currentOnMap = null;
            if (stationName && stations.indexOf(stationName) !== -1) {
                if (step.type === 't-explore' || step.type === 't-push') {
                    currentOnMap = stationName;
                }
            }

            renderTraversalMap(currentOnMap, visitedSet, lastPathEdges);

            // Last step — show result
            if (i === steps.length - 1) {
                panel.classList.remove('running');
                showMapOverlay(algo, order);
                var html = '<div class="traversal-result-box">' +
                    '<h4>✅ ' + (algo.toUpperCase()) + ' Traversal Complete!</h4>' +
                    '<div class="traversal-order">';
                order.forEach(function (s, idx) {
                    if (idx > 0) html += '<span class="t-arrow">→</span>';
                    html += '<span class="t-node">' + s + '</span>';
                });
                html += '</div></div>';
                document.getElementById('traversalResult').innerHTML = html;
            }
        }, speed * (i + 1));
        travTimers.push(timer);
    });
}

// ===== RUN INSTANT =====

function runTraversalInstant() {
    clearTravTimers();
    var start = document.getElementById('traversalStart').value;
    var algo = document.getElementById('traversalAlgo').value;
    var panel = document.getElementById('traversalPanel');
    panel.classList.add('running');

    var result;
    var codeLines;
    if (algo === 'bfs') {
        result = generateBFSSteps(start);
        codeLines = bfsJavaCode;
    } else {
        result = generateDFSSteps(start);
        codeLines = dfsJavaCode;
    }

    var steps = result.steps;
    var order = result.order;

    // Show all steps at once
    document.getElementById('traversalSteps').innerHTML = '';
    document.getElementById('traversalResult').innerHTML = '';

    var allDoneLines = [];
    steps.forEach(function (step, i) {
        addTravStep(step, i + 1);
        allDoneLines.push(step.line);
    });

    renderTraversalCode(codeLines, steps[steps.length - 1].line, allDoneLines);

    // Draw final map — all visited
    var visitedSet = {};
    order.forEach(function (s) { visitedSet[s] = true; });
    renderTraversalMap(null, visitedSet);

    // Show result on map overlay
    showMapOverlay(algo, order);

    // Also show in panel
    var html = '<div class="traversal-result-box">' +
        '<h4>✅ ' + algo.toUpperCase() + ' Traversal Complete!</h4>' +
        '<div class="traversal-order">';
    order.forEach(function (s, idx) {
        if (idx > 0) html += '<span class="t-arrow">→</span>';
        html += '<span class="t-node">' + s + '</span>';
    });
    html += '</div></div>';
    document.getElementById('traversalResult').innerHTML = html;

    panel.classList.remove('running');
}

// ===== MAP OVERLAY RESULT =====

function showMapOverlay(algo, order) {
    var overlay = document.getElementById('travOverlay');
    if (!overlay) return;
    var html = '<div class="trav-overlay-title">✅ ' + algo.toUpperCase() + ' Visit Order</div>';
    html += '<div class="trav-overlay-order">';
    order.forEach(function (s, idx) {
        if (idx > 0) html += '<span class="tov-arrow">→</span>';
        html += '<span class="tov-node">' + s + '</span>';
    });
    html += '</div>';
    overlay.innerHTML = html;
    overlay.classList.add('visible');
}

function hideMapOverlay() {
    var overlay = document.getElementById('travOverlay');
    if (overlay) overlay.classList.remove('visible');
}

// ===== RESET =====

function resetTraversal() {
    clearTravTimers();
    var panel = document.getElementById('traversalPanel');
    panel.classList.remove('running');
    document.getElementById('traversalSteps').innerHTML = '<p class="ds-empty-msg">Click Run to start traversal...</p>';
    document.getElementById('traversalResult').innerHTML = '';
    document.getElementById('traversalCodeBlock').innerHTML = '<span style="color:#6c7086;">// Select an algorithm to see code</span>';
    hideMapOverlay();
    renderTraversalDefault();
}

// ===== UPDATE CODE ON ALGO CHANGE =====

function updateTraversalCode() {
    var algo = document.getElementById('traversalAlgo').value;
    if (algo === 'bfs') {
        renderTraversalCode(bfsJavaCode, -1, []);
    } else {
        renderTraversalCode(dfsJavaCode, -1, []);
    }
}

// ===== INIT =====

document.addEventListener('DOMContentLoaded', function () {
    populateTraversalSelect();

    // Algo change updates code
    var algoSel = document.getElementById('traversalAlgo');
    if (algoSel) {
        algoSel.addEventListener('change', updateTraversalCode);
    }

    // Also update route map to default when navigating to routes page
    var navLinks = document.querySelectorAll('.nav-link[data-page="routes"]');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            setTimeout(renderTraversalDefault, 50);
        });
    });
});
