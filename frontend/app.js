/* ============================================
   Railway Reservation System - Frontend Logic
   ============================================ */

// ===== DATA STORE =====

// Trains
const trains = [
    { trainNo: 101, trainName: "Yal Devi", source: "Colombo", destination: "Jaffna", totalSeats: 100, availableSeats: 100 },
    { trainNo: 102, trainName: "Udarata Menike", source: "Colombo", destination: "Badulla", totalSeats: 80, availableSeats: 80 },
    { trainNo: 103, trainName: "Ruhunu Kumari", source: "Colombo", destination: "Matara", totalSeats: 101, availableSeats: 101 }
];

// Data Structures
let reservations = [];          // LinkedList simulation
let waitingQueue = [];          // Queue simulation
let undoStack = [];             // Stack simulation
let reservationTree = [];       // BST simulation (sorted by ID)
let passengersMap = {};         // HashTable simulation

let nextPassengerId = 1;
let nextReservationId = 1001;

// Route Graph
const stations = ["Colombo", "Kandy", "Badulla", "Galle", "Matara", "Anuradhapura", "Jaffna"];
const routes = [
    { from: "Colombo", to: "Kandy", distance: 115 },
    { from: "Kandy", to: "Badulla", distance: 165 },
    { from: "Colombo", to: "Galle", distance: 119 },
    { from: "Galle", to: "Matara", distance: 45 },
    { from: "Colombo", to: "Anuradhapura", distance: 206 },
    { from: "Anuradhapura", to: "Jaffna", distance: 198 }
];

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    initDate();
    initNavigation();
    initForms();
    renderDashboard();
    renderTrains();
    populateTrainSelects();
    populateStationSelects();
    renderRouteMap();
    renderRouteDetails();
});

// ===== NAVIGATION =====

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);
            sidebar.classList.remove('open');
        });
    });

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Close sidebar on content click (mobile)
    document.querySelector('.main-content').addEventListener('click', function() {
        sidebar.classList.remove('open');
    });
}

function navigateTo(page) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${page}"]`).classList.add('active');

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    // Update title
    const titles = {
        dashboard: 'Dashboard',
        trains: 'View Trains',
        booking: 'Book Ticket',
        cancel: 'Cancel Ticket',
        reservations: 'Reservations',
        waiting: 'Waiting List',
        undo: 'Undo Last Cancel',
        passengers: 'Passenger Management',
        search: 'Search Reservations',
        sort: 'Sort Reservations',
        routes: 'Railway Routes',
        structures: 'Data Structures'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    // Refresh page data
    switch(page) {
        case 'dashboard': renderDashboard(); break;
        case 'reservations': renderReservations(); break;
        case 'waiting': renderWaitingList(); break;
        case 'undo': renderUndoPreview(); break;
        case 'passengers': renderAllPassengers(); break;
        case 'structures': refreshAllStructures(); break;
    }
}

// ===== DATE =====

function initDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString('en-US', options);
}

// ===== DASHBOARD =====

function renderDashboard() {
    document.getElementById('statTrains').textContent = trains.length;
    document.getElementById('statReservations').textContent = reservations.length;
    document.getElementById('statWaiting').textContent = waitingQueue.length;
    document.getElementById('statPassengers').textContent = Object.keys(passengersMap).length;

    // Recent Trains
    let trainsHtml = '';
    trains.forEach(train => {
        trainsHtml += `
            <div class="route-item">
                <span>🚆</span>
                <span class="route-stations">${train.trainName}</span>
                <span class="route-distance">${train.source} → ${train.destination}</span>
            </div>`;
    });
    document.getElementById('dashboardTrains').innerHTML = trainsHtml;

    // Recent Reservations
    if (reservations.length === 0) {
        document.getElementById('dashboardReservations').innerHTML = '<p class="empty-state">No reservations yet</p>';
    } else {
        let resHtml = '';
        const recent = reservations.slice(-5).reverse();
        recent.forEach(res => {
            resHtml += `
                <div class="route-item">
                    <span>🎫</span>
                    <span class="route-stations">#${res.reservationId} - ${res.passenger.name}</span>
                    <span class="route-distance">Seat ${res.seatNo} | ${res.train.trainName}</span>
                </div>`;
        });
        document.getElementById('dashboardReservations').innerHTML = resHtml;
    }
}

// ===== TRAINS =====

function renderTrains() {
    let html = '';
    trains.forEach(train => {
        const seatsClass = train.availableSeats > 0 ? 'seats-available' : 'seats-full';
        const seatsText = train.availableSeats > 0
            ? `${train.availableSeats}/${train.totalSeats} seats available`
            : 'FULL';

        html += `
            <div class="train-card">
                <div class="train-card-header">
                    <span class="train-number">No. ${train.trainNo}</span>
                </div>
                <h3>${train.trainName}</h3>
                <div class="train-route">
                    <span>📍 ${train.source}</span>
                    <span class="route-arrow">→</span>
                    <span>📍 ${train.destination}</span>
                </div>
                <div class="seats-info">
                    <span>Total: ${train.totalSeats}</span>
                    <span class="${seatsClass}">${seatsText}</span>
                </div>
            </div>`;
    });
    document.getElementById('trainsList').innerHTML = html;
}

function populateTrainSelects() {
    const select = document.getElementById('bookTrain');
    select.innerHTML = '<option value="">-- Select a Train --</option>';
    trains.forEach(train => {
        const opt = document.createElement('option');
        opt.value = train.trainNo;
        opt.textContent = `${train.trainNo} - ${train.trainName} (${train.source} → ${train.destination})`;
        if (train.availableSeats === 0) opt.textContent += ' [FULL]';
        select.appendChild(opt);
    });

    // Show train preview on select
    select.addEventListener('change', function() {
        const trainNo = parseInt(this.value);
        const train = trains.find(t => t.trainNo === trainNo);
        const preview = document.getElementById('trainPreview');
        if (train) {
            preview.style.display = 'block';
            preview.innerHTML = `
                <h4>🚆 ${train.trainName}</h4>
                <p>${train.source} → ${train.destination}</p>
                <p>Available Seats: <strong>${train.availableSeats}</strong> / ${train.totalSeats}</p>`;
        } else {
            preview.style.display = 'none';
        }
    });
}

// ===== BOOKING =====

function initForms() {
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    document.getElementById('cancelForm').addEventListener('submit', handleCancel);
}

function handleBooking(e) {
    e.preventDefault();

    const trainNo = parseInt(document.getElementById('bookTrain').value);
    const name = document.getElementById('bookName').value.trim();
    const nic = document.getElementById('bookNic').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const seatNo = parseInt(document.getElementById('bookSeat').value);

    // Validate
    if (!trainNo || !name || !nic || !phone || !seatNo) {
        showToast('Please fill all fields', 'error');
        return;
    }

    const train = trains.find(t => t.trainNo === trainNo);
    if (!train) {
        showToast('Invalid train selected', 'error');
        return;
    }

    // Create passenger
    const passenger = {
        passengerId: nextPassengerId++,
        name: name,
        nic: nic,
        phone: phone
    };
    passengersMap[passenger.passengerId] = passenger;

    // Check if train full
    if (train.availableSeats === 0) {
        waitingQueue.push(passenger);
        logOperation('enqueue', 'Queue', `Train full! Enqueued ${passenger.name} to waiting list`);
        updateCodePanel('queue', 'enqueue');
        if (document.getElementById('page-structures').classList.contains('active')) {
            highlightAndRefresh('queue', { isNew: true });
        }
        showToast('Train is full. Passenger added to waiting list.', 'warning');
        resetBookingForm();
        renderDashboard();
        return;
    }

    // Validate seat
    if (seatNo < 1 || seatNo > train.totalSeats) {
        showToast('Invalid seat number! Must be 1-' + train.totalSeats, 'error');
        return;
    }

    if (isSeatBooked(trainNo, seatNo)) {
        showToast('This seat is already booked!', 'error');
        return;
    }

    // Create reservation
    const reservation = {
        reservationId: nextReservationId++,
        passenger: passenger,
        train: train,
        seatNo: seatNo
    };

    reservations.push(reservation);
    train.availableSeats--;

    // Visualize data structure operations
    logOperation('insert', 'LinkedList', `Inserted reservation #${reservation.reservationId} at end of list`);
    logOperation('insert', 'BST', `Inserted #${reservation.reservationId} into BST`);
    logOperation('insert', 'HashTable', `Inserted passenger #${passenger.passengerId} at hash(${passenger.passengerId}) = index ${passenger.passengerId % 7}`);
    updateCodePanel('linkedList', 'insert');
    updateCodePanel('bst', 'insert');
    updateCodePanel('hashTable', 'insert');
    if (document.getElementById('page-structures').classList.contains('active')) {
        highlightAndRefresh('linkedList', { newId: reservation.reservationId });
        setTimeout(() => highlightAndRefresh('bst', { newId: reservation.reservationId }), 500);
        setTimeout(() => highlightAndRefresh('hashTable', { newId: passenger.passengerId }), 1000);
    }

    showToast(`Reservation Successful! ID: ${reservation.reservationId}`, 'success');
    resetBookingForm();
    renderDashboard();
    renderTrains();
}

function resetBookingForm() {
    document.getElementById('bookingForm').reset();
    document.getElementById('trainPreview').style.display = 'none';
}

// ===== CANCELLATION =====

function handleCancel(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('cancelId').value);
    const index = reservations.findIndex(r => r.reservationId === id);

    if (index === -1) {
        document.getElementById('cancelResult').innerHTML =
            '<div class="result-error">❌ Reservation Not Found!</div>';
        return;
    }

    const reservation = reservations[index];

    // Remove from reservations
    reservations.splice(index, 1);

    // Restore seat
    reservation.train.availableSeats++;

    // Assign to waiting list if any
    if (waitingQueue.length > 0) {
        const waitingPassenger = waitingQueue.shift();
        const newReservation = {
            reservationId: nextReservationId++,
            passenger: waitingPassenger,
            train: reservation.train,
            seatNo: reservation.seatNo
        };
        reservations.push(newReservation);
        reservation.train.availableSeats--;

        // Visualize
        logOperation('delete', 'LinkedList', `Deleted reservation #${id} from list`);
        logOperation('dequeue', 'Queue', `Dequeued ${waitingPassenger.name} from front`);
        logOperation('insert', 'LinkedList', `Assigned seat to waiting passenger → #${newReservation.reservationId}`);
        updateCodePanel('linkedList', 'delete');
        updateCodePanel('queue', 'dequeue');
        if (document.getElementById('page-structures').classList.contains('active')) {
            highlightAndRefresh('linkedList', { highlightIds: [newReservation.reservationId], newId: newReservation.reservationId });
            setTimeout(() => highlightAndRefresh('queue', { highlightIndex: 0 }), 500);
        }

        document.getElementById('cancelResult').innerHTML =
            `<div class="result-success">✅ Cancelled. Seat assigned to waiting passenger: ${waitingPassenger.name} (ID: ${newReservation.reservationId})</div>`;
    } else {
        undoStack.push(reservation);
        logOperation('delete', 'LinkedList', `Deleted reservation #${id} from list`);
        logOperation('push', 'Stack', `Pushed #${reservation.reservationId} to undo stack`);
        updateCodePanel('linkedList', 'delete');
        updateCodePanel('stack', 'push');
        if (document.getElementById('page-structures').classList.contains('active')) {
            highlightAndRefresh('stack', { highlightTop: true, isNew: true });
        }
        document.getElementById('cancelResult').innerHTML =
            '<div class="result-success">✅ Reservation Cancelled.</div>';
    }

    document.getElementById('cancelId').value = '';
    showToast('Reservation cancelled successfully', 'success');
    renderDashboard();
    renderTrains();
}

// ===== UNDO =====

function renderUndoPreview() {
    const preview = document.getElementById('undoPreview');
    if (undoStack.length === 0) {
        preview.innerHTML = '<p>No cancelled reservations to undo.</p>';
        return;
    }

    const res = undoStack[undoStack.length - 1];
    preview.innerHTML = `
        <p><strong>ID:</strong> #${res.reservationId}</p>
        <p><strong>Passenger:</strong> ${res.passenger.name}</p>
        <p><strong>Train:</strong> ${res.train.trainName}</p>
        <p><strong>Seat:</strong> ${res.seatNo}</p>`;
}

function undoCancel() {
    if (undoStack.length === 0) {
        document.getElementById('undoResult').innerHTML =
            '<div class="result-error">Nothing to undo!</div>';
        return;
    }

    const reservation = undoStack[undoStack.length - 1];
    const train = reservation.train;

    if (train.availableSeats === 0 || isSeatBooked(train.trainNo, reservation.seatNo)) {
        document.getElementById('undoResult').innerHTML =
            '<div class="result-error">Cannot undo. Seat is not available.</div>';
        return;
    }

    undoStack.pop();
    reservations.push(reservation);
    train.availableSeats--;

    logOperation('pop', 'Stack', `Popped #${reservation.reservationId} from undo stack`);
    logOperation('insert', 'LinkedList', `Restored #${reservation.reservationId} to list`);
    updateCodePanel('stack', 'pop');
    updateCodePanel('linkedList', 'insert');
    if (document.getElementById('page-structures').classList.contains('active')) {
        highlightAndRefresh('stack', { highlightTop: true });
        setTimeout(() => highlightAndRefresh('linkedList', { newId: reservation.reservationId }), 500);
    }

    document.getElementById('undoResult').innerHTML =
        `<div class="result-success">✅ Reservation Restored! ID: ${reservation.reservationId}</div>`;
    showToast('Reservation restored successfully', 'success');
    renderDashboard();
    renderTrains();
    renderUndoPreview();
}

// ===== RESERVATIONS =====

function renderReservations() {
    const container = document.getElementById('reservationsList');

    if (reservations.length === 0) {
        container.innerHTML = '<div class="empty-state">No reservations found</div>';
        return;
    }

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Passenger</th>
                    <th>Train</th>
                    <th>Seat</th>
                    <th>NIC</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>`;

    reservations.forEach(res => {
        html += `
                <tr>
                    <td>#${res.reservationId}</td>
                    <td>${res.passenger.name}</td>
                    <td>${res.train.trainName}</td>
                    <td>${res.seatNo}</td>
                    <td>${res.passenger.nic}</td>
                    <td>${res.passenger.phone}</td>
                </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== WAITING LIST =====

function renderWaitingList() {
    const container = document.getElementById('waitingList');

    if (waitingQueue.length === 0) {
        container.innerHTML = '<div class="empty-state">No passengers in waiting list</div>';
        return;
    }

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Passenger</th>
                    <th>NIC</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>`;

    waitingQueue.forEach((passenger, i) => {
        html += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${passenger.name}</td>
                    <td>${passenger.nic}</td>
                    <td>${passenger.phone}</td>
                </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== PASSENGERS =====

function renderAllPassengers() {
    const container = document.getElementById('passengersList');
    const passengers = Object.values(passengersMap);

    if (passengers.length === 0) {
        container.innerHTML = '<div class="empty-state">No passengers registered</div>';
        return;
    }

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>NIC</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>`;

    passengers.forEach(p => {
        html += `
                <tr>
                    <td>#${p.passengerId}</td>
                    <td>${p.name}</td>
                    <td>${p.nic}</td>
                    <td>${p.phone}</td>
                </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function searchPassenger() {
    const id = parseInt(document.getElementById('searchPassengerId').value);
    logOperation('search', 'HashTable', `hash(${id}) = index ${id % 7}, searching bucket...`);
    updateCodePanel('hashTable', 'search');
    if (document.getElementById('page-structures').classList.contains('active')) {
        highlightAndRefresh('hashTable', { highlightIdx: id % 7 });
    }
    const passenger = passengersMap[id];

    if (!passenger) {
        document.getElementById('passengerResult').innerHTML =
            '<div class="result-error">Passenger Not Found!</div>';
        return;
    }

    document.getElementById('passengerResult').innerHTML = `
        <div class="passenger-card">
            <h4>👤 Passenger #${passenger.passengerId}</h4>
            <p><strong>Name:</strong> ${passenger.name}</p>
            <p><strong>NIC:</strong> ${passenger.nic}</p>
            <p><strong>Phone:</strong> ${passenger.phone}</p>
        </div>`;
}

// ===== SEARCH =====

function switchSearchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.search-tab').forEach(t => t.style.display = 'none');

    if (tab === 'id') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('searchTabId').style.display = 'block';
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('searchTabNic').style.display = 'block';
    }
}

function searchReservationById() {
    const id = parseInt(document.getElementById('searchResId').value);
    logOperation('search', 'BST', `Searching BST for reservation #${id}`);
    updateCodePanel('bst', 'search');
    if (document.getElementById('page-structures').classList.contains('active')) {
        highlightAndRefresh('bst', { highlightId: id });
    }
    const reservation = reservations.find(r => r.reservationId === id);
    displaySearchResult(reservation, 'reservation ID');
}

function searchReservationByNic() {
    const nic = document.getElementById('searchNic').value.trim();
    logOperation('search', 'LinkedList', `Searching LinkedList by NIC: ${nic}`);
    updateCodePanel('linkedList', 'search');
    if (document.getElementById('page-structures').classList.contains('active')) {
        const match = reservations.find(r => r.passenger.nic === nic);
        if (match) highlightAndRefresh('linkedList', { highlightIds: [match.reservationId] });
    }
    const reservation = reservations.find(r => r.passenger.nic === nic);
    displaySearchResult(reservation, 'NIC');
}

function displaySearchResult(reservation, searchType) {
    const container = document.getElementById('searchResult');

    if (!reservation) {
        container.innerHTML = '<div class="result-error">Reservation Not Found!</div>';
        return;
    }

    container.innerHTML = `
        <div class="passenger-card" style="border-left-color: var(--primary); margin-top: 20px;">
            <h4>🎫 Reservation #${reservation.reservationId}</h4>
            <p><strong>Passenger:</strong> ${reservation.passenger.name}</p>
            <p><strong>Train:</strong> ${reservation.train.trainName} (${reservation.train.trainNo})</p>
            <p><strong>Route:</strong> ${reservation.train.source} → ${reservation.train.destination}</p>
            <p><strong>Seat:</strong> ${reservation.seatNo}</p>
            <p><strong>NIC:</strong> ${reservation.passenger.nic}</p>
            <p><strong>Phone:</strong> ${reservation.passenger.phone}</p>
        </div>`;
}

// ===== SORT =====

function sortReservations(type) {
    const sorted = [...reservations];

    switch (type) {
        case 'id':
            sorted.sort((a, b) => a.reservationId - b.reservationId);
            break;
        case 'name':
            sorted.sort((a, b) => a.passenger.name.localeCompare(b.passenger.name));
            break;
        case 'seat':
            sorted.sort((a, b) => a.seatNo - b.seatNo);
            break;
    }

    const container = document.getElementById('sortResult');

    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state">No reservations to sort</div>';
        return;
    }

    const sortLabels = { id: 'Reservation ID', name: 'Passenger Name', seat: 'Seat Number' };

    let html = `<p style="margin-bottom:12px;color:var(--text-secondary);font-size:14px;">Sorted by ${sortLabels[type]}:</p>`;
    html += `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Passenger</th>
                    <th>Train</th>
                    <th>Seat</th>
                </tr>
            </thead>
            <tbody>`;

    sorted.forEach(res => {
        html += `
                <tr>
                    <td>#${res.reservationId}</td>
                    <td>${res.passenger.name}</td>
                    <td>${res.train.trainName}</td>
                    <td>${res.seatNo}</td>
                </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== ROUTES =====

function populateStationSelects() {
    const sourceSelect = document.getElementById('pathSource');
    const destSelect = document.getElementById('pathDest');

    stations.forEach(station => {
        sourceSelect.innerHTML += `<option value="${station}">${station}</option>`;
        destSelect.innerHTML += `<option value="${station}">${station}</option>`;
    });
}

function renderRouteMap() {
    renderTraversalDefault();
    updateRouteStats();
}

// ===== ROUTE TABS =====

let currentRouteTab = 'map';

function switchRouteTab(tab) {
    currentRouteTab = tab;
    document.querySelectorAll('.route-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.route-tab-content').forEach(tc => tc.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('routeTab-' + tab).classList.add('active');

    // Re-render map when switching to map tab
    if (tab === 'map') {
        setTimeout(function() {
            renderTraversalDefault();
        }, 50);
    }
}

// ===== ROUTE STATS =====

function updateRouteStats() {
    const totalDist = routes.reduce(function(sum, r) { return sum + r.distance; }, 0);
    document.getElementById('routeStatStations').textContent = stations.length;
    document.getElementById('routeStatRoutes').textContent = routes.length;
    document.getElementById('routeStatDistance').textContent = totalDist + ' km';
}

// ===== ROUTE DETAILS (interactive) =====

function renderRouteDetails() {
    let html = '<h3 style="margin-bottom:16px;">📍 Route Distances</h3>';

    routes.forEach(function(route, index) {
        html += `
            <div class="route-item-clickable" onclick="highlightRouteOnMap(${index})" id="routeListItem${index}">
                <div class="route-item">
                    <span>🚄</span>
                    <span class="route-stations">${route.from} → ${route.to}</span>
                    <span class="route-distance">${route.distance} km</span>
                </div>
            </div>`;
    });

    document.getElementById('routeDetails').innerHTML = html;
}

function highlightRouteOnMap(index) {
    // Remove previous highlights
    document.querySelectorAll('.route-item-clickable').forEach(function(el) {
        el.classList.remove('highlighted');
    });
    // Add highlight
    var item = document.getElementById('routeListItem' + index);
    if (item) item.classList.add('highlighted');

    // Switch to map tab to show
    var tabs = document.querySelectorAll('.route-tab-btn');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.route-tab-content').forEach(function(tc) { tc.classList.remove('active'); });
    tabs[0].classList.add('active');
    document.getElementById('routeTab-map').classList.add('active');
    currentRouteTab = 'map';

    // Render map with highlighted route
    highlightSingleRoute(index);
}

function highlightSingleRoute(routeIndex) {
    var route = routes[routeIndex];
    var positions = {
        "Colombo": { x: 100, y: 130 }, "Kandy": { x: 280, y: 60 },
        "Badulla": { x: 480, y: 60 }, "Galle": { x: 220, y: 210 },
        "Matara": { x: 370, y: 210 }, "Anuradhapura": { x: 380, y: 130 },
        "Jaffna": { x: 530, y: 130 }
    };
    var svgW = 620, svgH = 280;
    var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" width="100%" style="max-height:280px;">';

    routes.forEach(function(r, i) {
        var from = positions[r.from];
        var to = positions[r.to];
        var isHighlighted = (i === routeIndex);
        var strokeClass = isHighlighted ? 'route-line-highlight' : 'route-line';
        var sw = isHighlighted ? 4 : 2;
        svg += '<line class="' + strokeClass + '" x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '" stroke-width="' + sw + '"/>';
        var mx = (from.x + to.x) / 2;
        var my = (from.y + to.y) / 2;
        svg += '<text x="' + mx + '" y="' + (my - 8) + '" text-anchor="middle" fill="' + (isHighlighted ? '#ea4335' : '#5f6368') + '" font-size="11" font-weight="' + (isHighlighted ? 'bold' : 'normal') + '">' + r.distance + ' km</text>';
    });

    stations.forEach(function(station) {
        var pos = positions[station];
        var isEndpoint = (station === route.from || station === route.to);
        var fillColor = isEndpoint ? '#ea4335' : '#1a73e8';
        var r = isEndpoint ? 26 : 22;
        svg += '<g class="station-clickable" transform="translate(' + pos.x + ',' + pos.y + ')" onclick="onMapStationClick(\'' + station + '\')">';
        svg += '<circle r="' + r + '" fill="' + fillColor + '" stroke="#fff" stroke-width="3"/>';
        svg += '<text y="1" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" dominant-baseline="middle">●</text>';
        svg += '<text y="' + (r + 14) + '" text-anchor="middle" fill="#202124" font-size="12" font-weight="500">' + station + '</text>';
        svg += '</g>';
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

// ===== STATION CLICK (map interaction) =====

var mapSelectedStations = [];

function onMapStationClick(stationName) {
    mapSelectedStations.push(stationName);

    if (mapSelectedStations.length === 1) {
        // First click - set as source
        document.getElementById('pathSource').value = stationName;
        showStationInfo(stationName);
        showToast(stationName + ' selected as source', 'info');
    } else if (mapSelectedStations.length === 2) {
        // Second click - set as destination
        if (mapSelectedStations[0] === stationName) {
            // Same station clicked again, ignore
            mapSelectedStations.pop();
            return;
        }
        document.getElementById('pathDest').value = stationName;
        showToast(mapSelectedStations[0] + ' → ' + stationName, 'info');
        mapSelectedStations = [];
        closeStationInfo();
        // Auto-switch to path tab and find
        var tabs = document.querySelectorAll('.route-tab-btn');
        tabs.forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.route-tab-content').forEach(function(tc) { tc.classList.remove('active'); });
        tabs[3].classList.add('active');
        document.getElementById('routeTab-path').classList.add('active');
        currentRouteTab = 'path';
        setTimeout(function() { findShortestPath(); }, 100);
    }
}

// ===== STATION INFO =====

function showStationInfo(stationName) {
    var card = document.getElementById('stationInfoCard');
    document.getElementById('stationInfoName').textContent = stationName;

    var connections = [];
    routes.forEach(function(r) {
        if (r.from === stationName) connections.push({ name: r.to, dist: r.distance });
        if (r.to === stationName) connections.push({ name: r.from, dist: r.distance });
    });

    var bodyHtml = '<p style="margin-bottom:12px;color:var(--text-secondary);font-size:13px;">' + connections.length + ' connection(s)</p>';
    connections.forEach(function(conn) {
        bodyHtml += '<div class="station-conn-item" onclick="onMapStationClick(\'' + conn.name + '\')">';
        bodyHtml += '<span class="station-conn-arrow">→</span>';
        bodyHtml += '<span class="station-conn-name">' + conn.name + '</span>';
        bodyHtml += '<span class="station-conn-dist">' + conn.dist + ' km</span>';
        bodyHtml += '</div>';
    });

    document.getElementById('stationInfoBody').innerHTML = bodyHtml;
    card.style.display = 'block';
}

function closeStationInfo() {
    document.getElementById('stationInfoCard').style.display = 'none';
}

function findShortestPath() {
    const source = document.getElementById('pathSource').value;
    const dest = document.getElementById('pathDest').value;

    if (!source || !dest) {
        showToast('Please select source and destination', 'error');
        return;
    }

    if (source === dest) {
        document.getElementById('pathResult').innerHTML =
            '<div class="result-error">Source and destination are the same!</div>';
        return;
    }

    // Build adjacency list
    const adj = {};
    stations.forEach(s => adj[s] = []);
    routes.forEach(r => {
        adj[r.from].push({ to: r.to, distance: r.distance });
        adj[r.to].push({ to: r.from, distance: r.distance });
    });

    // Dijkstra's algorithm
    const dist = {};
    const prev = {};
    const visited = new Set();
    const pq = []; // [{station, dist}]

    stations.forEach(s => dist[s] = Infinity);
    dist[source] = 0;
    pq.push({ station: source, dist: 0 });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { station: current } = pq.shift();

        if (visited.has(current)) continue;
        visited.add(current);

        adj[current].forEach(neighbor => {
            if (!visited.has(neighbor.to)) {
                const newDist = dist[current] + neighbor.distance;
                if (newDist < dist[neighbor.to]) {
                    dist[neighbor.to] = newDist;
                    prev[neighbor.to] = current;
                    pq.push({ station: neighbor.to, dist: newDist });
                }
            }
        });
    }

    if (dist[dest] === Infinity) {
        document.getElementById('pathResult').innerHTML =
            '<div class="result-error">No path found between these stations!</div>';
        return;
    }

    // Reconstruct path
    const path = [];
    let current = dest;
    while (current) {
        path.unshift(current);
        current = prev[current];
    }

    const container = document.getElementById('pathResult');
    container.innerHTML = `
        <div class="path-result-box">
            <h4>✅ Shortest Path Found!</h4>
            <p style="margin-bottom:8px;">Total Distance: <strong>${dist[dest]} km</strong></p>
            <div class="path-steps">
                ${path.map(s => `<span>${s}</span>`).join('<span class="path-arrow"> → </span>')}
            </div>
        </div>`;

    // Highlight route on map
    highlightPath(path);
}

function highlightPath(path) {
    // Re-render map with highlighted path
    const positions = {
        "Colombo":       { x: 100, y: 130 },
        "Kandy":         { x: 280, y: 60 },
        "Badulla":       { x: 480, y: 60 },
        "Galle":         { x: 220, y: 210 },
        "Matara":        { x: 370, y: 210 },
        "Anuradhapura":  { x: 380, y: 130 },
        "Jaffna":        { x: 530, y: 130 }
    };

    const svgWidth = 620;
    const svgHeight = 280;

    let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" style="max-height:280px;">`;

    // Draw all route lines
    routes.forEach(route => {
        const from = positions[route.from];
        const to = positions[route.to];
        svg += `<line class="route-line" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`;
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        svg += `<text x="${mx}" y="${my - 8}" text-anchor="middle" fill="#5f6368" font-size="11">${route.distance} km</text>`;
    });

    // Draw highlighted path
    for (let i = 0; i < path.length - 1; i++) {
        const from = positions[path[i]];
        const to = positions[path[i + 1]];
        svg += `<line class="route-line-highlight" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`;
    }

    // Draw station nodes
    stations.forEach(station => {
        const pos = positions[station];
        const isOnPath = path.includes(station);
        const fillColor = isOnPath ? '#ea4335' : '#1a73e8';
        svg += `
            <g class="station-node" transform="translate(${pos.x}, ${pos.y})">
                <circle r="22" fill="${fillColor}" stroke="#fff" stroke-width="3"/>
                <text y="5" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">●</text>
                <text y="36" text-anchor="middle" fill="#202124" font-size="12" font-weight="500">${station}</text>
            </g>`;
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

// ===== DATA STRUCTURE VISUALIZATIONS =====

let opLog = [];
let highlightTimers = [];

function logOperation(type, dsName, message) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    opLog.unshift({ type, dsName, message, time });
    if (opLog.length > 50) opLog.pop();
    renderOpLog();
}

function renderOpLog() {
    const container = document.getElementById('dsLogEntries');
    if (!container) return;
    if (opLog.length === 0) {
        container.innerHTML = '<p class="empty-state">Perform an operation to see logs here...</p>';
        return;
    }
    let html = '';
    opLog.forEach(entry => {
        html += `<div class="ds-log-entry ${entry.type}">
            <span class="ds-log-time">${entry.time}</span>
            <span class="ds-log-ds">[${entry.dsName}]</span>
            <span class="ds-log-msg">${entry.message}</span>
        </div>`;
    });
    container.innerHTML = html;
}

function clearOpLog() {
    opLog = [];
    renderOpLog();
}

// ===== LinkedList Visualization =====

function renderLinkedList(highlightIds, newId) {
    const container = document.getElementById('linkedListView');
    if (!container) return;
    document.getElementById('llCount').textContent = reservations.length + ' nodes';

    if (reservations.length === 0) {
        container.innerHTML = '<span class="ds-empty-msg">No reservations in LinkedList</span>';
        return;
    }

    let html = '<div class="ll-container">';
    html += '<span class="ll-null">HEAD</span>';

    reservations.forEach((res, i) => {
        let cls = '';
        if (highlightIds && highlightIds.includes(res.reservationId)) cls = ' highlight';
        if (newId && res.reservationId === newId) cls = ' new-node';
        html += `<div class="ll-node">
            <div class="ll-node-box${cls}">
                <div class="ll-node-data">#${res.reservationId}</div>
                <div class="ll-node-info">${res.passenger.name}<br>Seat ${res.seatNo}</div>
            </div>
            <span class="ll-arrow">${i < reservations.length - 1 ? '→' : ''}</span>
        </div>`;
    });

    html += '<span class="ll-null">NULL</span>';
    html += '</div>';
    container.innerHTML = html;
}

// ===== Queue Visualization =====

function renderQueue(highlightIndex, isNew) {
    const container = document.getElementById('queueView');
    if (!container) return;
    document.getElementById('qCount').textContent = waitingQueue.length + ' items';

    if (waitingQueue.length === 0) {
        container.innerHTML = '<span class="ds-empty-msg">Waiting Queue is empty</span>';
        return;
    }

    let html = '<div class="q-container" style="padding-top:24px;">';

    if (waitingQueue.length > 0) {
        html += '<span class="q-label front-label">FRONT ←</span>';
        if (waitingQueue.length > 1) {
            html += '<span class="q-label rear-label">→ REAR</span>';
        }
    }

    waitingQueue.forEach((passenger, i) => {
        let cls = '';
        if (highlightIndex !== undefined && i === highlightIndex) cls = ' highlight';
        if (isNew && i === waitingQueue.length - 1) cls = ' new-node';
        html += `<div class="q-node${cls}">
            <div class="q-node-data">${passenger.name}</div>
            <div class="q-node-info">ID: ${passenger.passengerId}</div>
        </div>`;
        if (i < waitingQueue.length - 1) {
            html += '<span class="q-arrow">→</span>';
        }
    });

    html += '</div>';
    container.innerHTML = html;
}

// ===== Stack Visualization =====

function renderStack(highlightTop, isNew) {
    const container = document.getElementById('stackView');
    if (!container) return;
    document.getElementById('sCount').textContent = undoStack.length + ' items';

    if (undoStack.length === 0) {
        container.innerHTML = '<span class="ds-empty-msg">Undo Stack is empty</span>';
        return;
    }

    let html = '<div class="s-container">';
    html += '<span class="s-top-label">TOP ↑</span>';

    for (let i = undoStack.length - 1; i >= 0; i--) {
        let cls = '';
        if (highlightTop && i === undoStack.length - 1) cls = ' highlight';
        if (isNew && i === undoStack.length - 1) cls = ' highlight';
        html += `<div class="s-node${cls}">
            <div class="s-node-data">#${undoStack[i].reservationId}</div>
            <div class="s-node-info">${undoStack[i].passenger.name} | ${undoStack[i].train.trainName}</div>
        </div>`;
    }

    html += '</div>';
    container.innerHTML = html;
}

// ===== BST Visualization =====

function buildBSTNodes() {
    const nodes = [];
    const edges = [];

    function traverse(node, depth, pos, parentId) {
        if (!node) return null;

        const id = node.reservationId;
        const x = pos;
        const y = depth * 80 + 20;

        nodes.push({ id, x, y, res: node });
        if (parentId !== null) {
            edges.push({ from: parentId, to: id });
        }

        // Build BST from reservations array (sorted by id)
        const left = buildBSTFromSorted(reservations.filter(r => r.reservationId < id), depth + 1, pos - 80 / Math.pow(2, depth), id);
        const right = buildBSTFromSorted(reservations.filter(r => r.reservationId > id), depth + 1, pos + 80 / Math.pow(2, depth), id);
    }

    // Actually build from sorted reservations
    const sorted = [...reservations].sort((a, b) => a.reservationId - b.reservationId);
    nodes.length = 0;
    edges.length = 0;

    if (sorted.length === 0) return { nodes, edges };

    function buildSubTree(arr, depth, centerX, parentPos) {
        if (arr.length === 0) return null;

        const mid = Math.floor(arr.length / 2);
        const res = arr[mid];
        const x = centerX;
        const y = depth * 80 + 30;

        nodes.push({ id: res.reservationId, x, y, res });
        if (parentPos !== null) {
            edges.push({ fromX: parentPos.x, fromY: parentPos.y, toX: x, toY: y });
        }

        const leftArr = arr.filter(r => r.reservationId < res.reservationId);
        const rightArr = arr.filter(r => r.reservationId > res.reservationId);
        const spread = Math.max(60, 120 - depth * 20);

        buildSubTree(leftArr, depth + 1, centerX - spread, { x, y });
        buildSubTree(rightArr, depth + 1, centerX + spread, { x, y });
    }

    buildSubTree(sorted, 0, 300, null);
    return { nodes, edges };
}

function renderBST(highlightId, isNew) {
    const container = document.getElementById('bstView');
    if (!container) return;
    document.getElementById('bstCount').textContent = reservations.length + ' nodes';

    if (reservations.length === 0) {
        container.innerHTML = '<span class="bst-empty">BST is empty - no reservations</span>';
        return;
    }

    const { nodes, edges } = buildBSTNodes();

    if (nodes.length === 0) {
        container.innerHTML = '<span class="bst-empty">BST is empty</span>';
        return;
    }

    // Find bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x);
        minY = Math.min(minY, n.y);
        maxY = Math.max(maxY, n.y);
    });

    const pad = 50;
    const svgW = (maxX - minX) + pad * 2;
    const svgH = (maxY - minY) + pad * 2 + 40;
    const offsetX = -minX + pad;
    const offsetY = -minY + pad;

    let svg = `<svg width="100%" viewBox="0 0 ${svgW} ${svgH}" style="min-height:200px;">`;

    // Draw edges
    edges.forEach(e => {
        svg += `<line class="bst-edge" x1="${e.fromX + offsetX}" y1="${e.fromY + offsetY + 28}" x2="${e.toX + offsetX}" y2="${e.toY + offsetY - 2}" />`;
    });

    // Draw nodes
    nodes.forEach(n => {
        let cls = '';
        if (highlightId && n.id === highlightId) cls = ' highlight';
        if (isNew && n.id === isNew) cls = ' new-node';
        svg += `<g transform="translate(${n.x + offsetX}, ${n.y + offsetY})">
            <circle r="28" fill="${cls ? '#c8e6c9' : '#fff'}" stroke="#34a853" stroke-width="2.5"/>
            <text y="1" text-anchor="middle" fill="#2e7d32" font-size="11" font-weight="bold" dominant-baseline="middle">#${n.id}</text>
        </g>`;
    });

    svg += '</svg>';
    container.innerHTML = '<div class="bst-container">' + svg + '</div>';
}

// ===== HashTable Visualization =====

function renderHashTable(highlightIdx, isNewId) {
    const container = document.getElementById('hashTableView');
    if (!container) return;
    const passengers = Object.values(passengersMap);
    document.getElementById('htCount').textContent = passengers.length + ' entries';

    const capacity = 7; // Show a subset of buckets for clarity
    let html = '<div class="ht-container">';

    for (let i = 0; i < capacity; i++) {
        const bucketPassengers = passengers.filter(p => (p.passengerId % capacity) === i);
        let cls = (highlightIdx !== undefined && i === highlightIdx) ? ' highlight' : '';

        html += `<div class="ht-bucket">
            <span class="ht-index">[${i}]</span>
            <div class="ht-chain">`;

        if (bucketPassengers.length === 0) {
            html += `<div class="ht-cell${cls}">
                <div class="ht-cell-data" style="background:#9e9e9e;">empty</div>
            </div>`;
        } else {
            bucketPassengers.forEach((p, j) => {
                let entryCls = (isNewId && p.passengerId === isNewId) ? ' highlight' : cls;
                html += `<div class="ht-cell${entryCls}">
                    <div class="ht-cell-data">#${p.passengerId}</div>
                    <div class="ht-cell-info">${p.name}</div>
                </div>`;
                if (j < bucketPassengers.length - 1) {
                    html += '<span class="ht-arrow">↓</span>';
                }
            });
        }

        html += '</div></div>';
    }

    html += '</div>';
    container.innerHTML = html;
}

// ===== Refresh All =====

function refreshAllStructures() {
    clearHighlights();
    renderLinkedList();
    renderQueue();
    renderStack();
    renderBST();
    renderHashTable();
}

function clearHighlights() {
    highlightTimers.forEach(t => clearTimeout(t));
    highlightTimers = [];
}

function highlightAndRefresh(dsType, options, duration) {
    duration = duration || 2000;
    clearHighlights();

    switch (dsType) {
        case 'linkedList':
            renderLinkedList(options.highlightIds, options.newId);
            break;
        case 'queue':
            renderQueue(options.highlightIndex, options.isNew);
            break;
        case 'stack':
            renderStack(options.highlightTop, options.isNew);
            break;
        case 'bst':
            renderBST(options.highlightId, options.newId);
            break;
        case 'hashTable':
            renderHashTable(options.highlightIdx, options.newId);
            break;
    }

    const timer = setTimeout(() => {
        switch (dsType) {
            case 'linkedList': renderLinkedList(); break;
            case 'queue': renderQueue(); break;
            case 'stack': renderStack(); break;
            case 'bst': renderBST(); break;
            case 'hashTable': renderHashTable(); break;
        }
    }, duration);
    highlightTimers.push(timer);
}

// ===== Update code panels based on operation =====

function updateCodePanel(dsType, operation) {
    const codes = {
        linkedList: {
            insert: `// LinkedList - Insert Reservation
public void insert(Reservation r) {
  Node newNode = new Node(r);
  if (head == null) {
    head = newNode;   // ← First node
    size++; return;
  }
  Node current = head;
  while (current.next != null)
    current = current.next;
  current.next = newNode; // ← Append
  size++;
}`,
            delete: `// LinkedList - Delete by ID
public boolean delete(int id) {
  if (head == null) return false;
  if (head.data.id == id) {
    head = head.next; // ← Remove head
    size--; return true;
  }
  Node current = head;
  while (current.next != null) {
    if (current.next.data.id == id) {
      current.next = current.next.next;
      size--; return true;
    }
    current = current.next;
  }
  return false;
}`,
            search: `// LinkedList - Search by ID
public Reservation search(int id) {
  Node current = head;
  while (current != null) {
    if (current.data.id == id)
      return current.data; // ← Found!
    current = current.next; // ← Traverse
  }
  return null; // ← Not found
}`
        },
        queue: {
            enqueue: `// Queue - Enqueue passenger
public void enqueue(Passenger p) {
  QueueNode newNode = new QueueNode(p);
  if (rear == null) {
    front = rear = newNode;
    return;
  }
  rear.next = newNode;
  rear = newNode;   // ← Add to rear
}`,
            dequeue: `// Queue - Dequeue passenger
public Passenger dequeue() {
  if (isEmpty()) return null;
  Passenger p = front.data;
  front = front.next;  // ← Remove front
  if (front == null)
    rear = null;
  return p;
}`
        },
        stack: {
            push: `// Stack - Push cancelled reservation
public void push(Reservation r) {
  Node newNode = new Node(r);
  newNode.next = top; // ← Link to old top
  top = newNode;      // ← New top
}`,
            pop: `// Stack - Pop for undo
public Reservation pop() {
  if (isEmpty()) return null;
  Reservation r = top.data;
  top = top.next;  // ← Move top down
  return r;        // ← Return popped
}`
        },
        bst: {
            insert: `// BST - Insert reservation
private TreeNode insert(TreeNode node, Reservation r) {
  if (node == null)
    return new TreeNode(r);
  if (r.id < node.reservation.id)
    node.left = insert(node.left, r);  // ← Go left
  else if (r.id > node.reservation.id)
    node.right = insert(node.right, r); // ← Go right
  return node;
}`,
            delete: `// BST - Delete reservation
private TreeNode delete(TreeNode node, int id) {
  if (node == null) return null;
  if (id < node.reservation.id)
    node.left = delete(node.left, id);
  else if (id > node.reservation.id)
    node.right = delete(node.right, id);
  else { // Found! Handle 0/1/2 children
    if (node.left == null) return node.right;
    if (node.right == null) return node.left;
    TreeNode succ = min(node.right);
    node.reservation = succ.reservation;
    node.right = delete(node.right, succ.id);
  }
  return node;
}`,
            search: `// BST - Search by ID
public Reservation search(int id) {
  TreeNode current = root;
  while (current != null) {
    if (id == current.reservation.id)
      return current.reservation; // ← Found!
    if (id < current.reservation.id)
      current = current.left;  // ← Go left
    else
      current = current.right; // ← Go right
  }
  return null; // ← Not found
}`
        },
        hashTable: {
            insert: `// HashTable - Insert passenger
public void insert(Passenger p) {
  int index = hash(p.passengerId);
  Entry current = table[index];
  while (current != null) {
    if (current.passenger.id == p.id)
      { current.passenger = p; return; }
    current = current.next;
  }
  Entry entry = new Entry(p);
  entry.next = table[index];
  table[index] = entry; // ← Chain
}`,
            search: `// HashTable - Search by ID
public Passenger search(int id) {
  int index = hash(id);     // ← Compute hash
  Entry current = table[index];
  while (current != null) {
    if (current.passenger.id == id)
      return current.passenger; // ← Found!
    current = current.next;     // ← Chain
  }
  return null; // ← Not found
}`
        }
    };

    const codeMap = {
        linkedList: 'llCode',
        queue: 'qCode',
        stack: 'sCode',
        bst: 'bstCode',
        hashTable: 'htCode'
    };

    const el = document.getElementById(codeMap[dsType]);
    if (el && codes[dsType] && codes[dsType][operation]) {
        el.textContent = codes[dsType][operation];
    }
}

// ===== UTILITY =====

function isSeatBooked(trainNo, seatNo) {
    return reservations.some(r => r.train.trainNo === trainNo && r.seatNo === seatNo);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function showModal(title, body) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalOverlay').classList.add('active');
}
