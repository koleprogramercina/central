// Occupancy System - sa ograničenjem check-in-a
let checkIns = [];
const CHECK_IN_COOLDOWN = 60 * 60 * 1000; // 1 sat u milisekundama

// Učitaj postojeće check-in-ove iz localStorage
function loadCheckIns() {
    const stored = localStorage.getItem('gymCheckIns');
    if (stored) {
        checkIns = JSON.parse(stored);
    }
}

// Sačuvaj check-in-ove u localStorage
function saveCheckIns() {
    localStorage.setItem('gymCheckIns', JSON.stringify(checkIns));
}

// Proveri poslednji check-in korisnika
function getLastUserCheckIn() {
    const lastCheckIn = localStorage.getItem('userLastCheckIn');
    return lastCheckIn ? parseInt(lastCheckIn) : null;
}

// Sačuvaj vreme korisnikovog check-in-a
function setUserCheckIn(timestamp) {
    localStorage.setItem('userLastCheckIn', timestamp.toString());
}

// Proveri da li korisnik može da se check-in-uje
function canUserCheckIn() {
    const lastCheckIn = getLastUserCheckIn();
    if (!lastCheckIn) return true;
    
    const now = Date.now();
    const timePassed = now - lastCheckIn;
    
    return timePassed >= CHECK_IN_COOLDOWN;
}

// Vrati preostalo vreme do sledećeg check-in-a
function getTimeUntilNextCheckIn() {
    const lastCheckIn = getLastUserCheckIn();
    if (!lastCheckIn) return 0;
    
    const now = Date.now();
    const timePassed = now - lastCheckIn;
    const remaining = CHECK_IN_COOLDOWN - timePassed;
    
    return remaining > 0 ? remaining : 0;
}

// Formatiraj vreme
function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
}

function updateOccupancy() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Ukloni check-in-ove starije od 60 minuta
    checkIns = checkIns.filter(time => time > oneHourAgo);
    saveCheckIns();
    
    const count = checkIns.length;
    updateOccupancyDisplay(count);
}

function updateOccupancyDisplay(count = checkIns.length) {
    const countElement = document.getElementById('occupancyCount');
    const statusElement = document.getElementById('occupancyStatus');
    
    if (!countElement || !statusElement) return;
    
    countElement.textContent = count;
    
    let statusClass, statusText;
    if (count <= 10) {
        statusClass = 'status-low';
        statusText = 'Malo ljudi';
    } else if (count <= 25) {
        statusClass = 'status-medium';
        statusText = 'Srednje';
    } else {
        statusClass = 'status-high';
        statusText = 'Velika gužva';
    }
    
    statusElement.className = `occupancy-status ${statusClass}`;
    statusElement.textContent = statusText;
}

function simulateCheckin() {
    const button = event.target;
    
    // Proveri da li korisnik može da se check-in-uje
    if (!canUserCheckIn()) {
        const timeRemaining = getTimeUntilNextCheckIn();
        const formattedTime = formatTime(timeRemaining);
        
        // Prikaz poruke
        const originalText = button.textContent;
        button.textContent = `⏳ Sačekaj ${formattedTime}`;
        button.style.background = '#ff3838';
        button.style.cursor = 'not-allowed';
        
        setTimeout(() => {
            updateButtonState();
        }, 3000);
        
        return;
    }
    
    // Dodaj check-in
    const now = Date.now();
    checkIns.push(now);
    setUserCheckIn(now);
    saveCheckIns();
    updateOccupancy();
    
    // Vizuelni feedback
    const originalText = button.textContent;
    button.textContent = '✓ Check-in uspešan!';
    button.style.background = '#00ff41';
    
    setTimeout(() => {
        updateButtonState();
    }, 2000);
}

// Update stanja dugmeta
function updateButtonState() {
    const button = document.getElementById('checkinButton');
    const cooldownInfo = document.getElementById('cooldownInfo');
    
    if (!button) return;
    
    if (canUserCheckIn()) {
        button.textContent = 'Check-in';
        button.style.background = 'var(--primary-gold)';
        button.style.cursor = 'pointer';
        button.disabled = false;
        
        if (cooldownInfo) {
            cooldownInfo.textContent = '';
        }
    } else {
        const timeRemaining = getTimeUntilNextCheckIn();
        const formattedTime = formatTime(timeRemaining);
        
        button.textContent = '⏳ Check-in nedostupan';
        button.style.background = '#666';
        button.style.cursor = 'not-allowed';
        button.disabled = true;
        
        if (cooldownInfo) {
            cooldownInfo.textContent = `Možete se ponovo prijaviti za ${formattedTime}`;
        }
    }
}

// Auto-refresh svakih 20 sekundi
setInterval(updateOccupancy, 20000);

// Update dugmeta svakih 10 sekundi
setInterval(updateButtonState, 10000);

// Inicijalizuj
function initializeOccupancy() {
    loadCheckIns();
    updateOccupancy();
    updateButtonState();
}

// Inicijalizuj kad se dokument učita
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOccupancy);
} else {
    initializeOccupancy();
}