// Admin Panel - Kontrola zauzetosti

// Provera autentifikacije
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('loginTime');
    
    // Proveri da li je prijavljen i da li je sesija istekla (4 sata)
    if (!isLoggedIn || !loginTime) {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    const fourHours = 4 * 60 * 60 * 1000;
    if (Date.now() - parseInt(loginTime) > fourHours) {
        sessionStorage.clear();
        alert('Sesija je istekla. Molimo prijavite se ponovo.');
        window.location.href = 'admin-login.html';
        return false;
    }
    
    return true;
}

// Logout
function logout() {
    if (confirm('Da li ste sigurni da želite da se odjavite?')) {
        sessionStorage.clear();
        window.location.href = 'admin-login.html';
    }
}

// Check Auth na load
if (!checkAuth()) {
    throw new Error('Neautorizovan pristup');
}

// Podaci o zauzetosti
let checkIns = [];
let history = [];
let stats = {
    todayCheckIns: 0,
    todayCheckOuts: 0,
    peakToday: 0
};

// Učitaj podatke
function loadData() {
    const storedCheckIns = localStorage.getItem('gymCheckIns');
    const storedHistory = localStorage.getItem('adminHistory');
    const storedStats = localStorage.getItem('adminStats');
    
    if (storedCheckIns) {
        checkIns = JSON.parse(storedCheckIns);
    }
    
    if (storedHistory) {
        history = JSON.parse(storedHistory);
    }
    
    if (storedStats) {
        stats = JSON.parse(storedStats);
    }
    
    // Resetuj statistiku ako je novi dan
    const lastReset = localStorage.getItem('statsLastReset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
        stats = {
            todayCheckIns: 0,
            todayCheckOuts: 0,
            peakToday: 0
        };
        localStorage.setItem('statsLastReset', today);
        saveStats();
    }
}

// Sačuvaj podatke
function saveCheckIns() {
    localStorage.setItem('gymCheckIns', JSON.stringify(checkIns));
}

function saveHistory() {
    // Čuvaj samo poslednjih 50 aktivnosti
    if (history.length > 50) {
        history = history.slice(-50);
    }
    localStorage.setItem('adminHistory', JSON.stringify(history));
}

function saveStats() {
    localStorage.setItem('adminStats', JSON.stringify(stats));
}

// Admin Check-in
function adminCheckIn() {
    const now = Date.now();
    checkIns.push(now);
    
    // Dodaj u istoriju
    history.push({
        type: 'checkin',
        time: now
    });
    
    // Ažuriraj statistiku
    stats.todayCheckIns++;
    if (checkIns.length > stats.peakToday) {
        stats.peakToday = checkIns.length;
    }
    
    saveCheckIns();
    saveHistory();
    saveStats();
    updateDisplay();
    
    // Vizuelni feedback
    showNotification('✓ Check-in uspešan', 'success');
}

// Admin Check-out
function adminCheckOut() {
    if (checkIns.length === 0) {
        showNotification('Nema aktivnih korisnika', 'error');
        return;
    }
    
    const now = Date.now();
    // Ukloni najstariji check-in
    checkIns.shift();
    
    // Dodaj u istoriju
    history.push({
        type: 'checkout',
        time: now
    });
    
    // Ažuriraj statistiku
    stats.todayCheckOuts++;
    
    saveCheckIns();
    saveHistory();
    saveStats();
    updateDisplay();
    
    // Vizuelni feedback
    showNotification('✓ Check-out uspešan', 'success');
}

// Reset zauzetosti
function resetOccupancy() {
    if (confirm('Da li ste sigurni da želite da resetujete zauzetost?')) {
        checkIns = [];
        saveCheckIns();
        updateDisplay();
        showNotification('Zauzetost resetovana', 'success');
    }
}

// Ažuriraj prikaz
function updateDisplay() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Filtriraj check-in-ove starije od 1 sata
    checkIns = checkIns.filter(time => time > oneHourAgo);
    saveCheckIns();
    
    const count = checkIns.length;
    
    // Ažuriraj brojač
    document.getElementById('adminOccupancyCount').textContent = count;
    
    // Ažuriraj status
    const statusElement = document.getElementById('adminOccupancyStatus');
    let statusClass, statusText;
    
    if (count <= 10) {
        statusClass = 'status-low';
        statusText = 'Malo ljudi';
        statusElement.style.color = 'var(--green)';
    } else if (count <= 25) {
        statusClass = 'status-medium';
        statusText = 'Srednje';
        statusElement.style.color = 'var(--yellow)';
    } else {
        statusClass = 'status-high';
        statusText = 'Velika gužva';
        statusElement.style.color = 'var(--red)';
    }
    
    statusElement.textContent = statusText;
    
    // Ažuriraj checkout dugme
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = count === 0;
    
    // Ažuriraj statistiku
    document.getElementById('todayCheckIns').textContent = stats.todayCheckIns;
    document.getElementById('todayCheckOuts').textContent = stats.todayCheckOuts;
    document.getElementById('peakToday').textContent = stats.peakToday;
    document.getElementById('currentStreak').textContent = count;
    
    // Ažuriraj istoriju
    updateHistory();
}

// Ažuriraj istoriju
function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    // Sortiraj od najnovije
    const sortedHistory = [...history].reverse().slice(0, 20);
    
    if (sortedHistory.length === 0) {
        historyList.innerHTML = '<p style="color: var(--text-gray); text-align: center; padding: 2rem;">Nema aktivnosti</p>';
        return;
    }
    
    sortedHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = `history-item ${item.type}`;
        
        const icon = item.type === 'checkin' 
            ? '<i class="fas fa-user-plus" style="color: var(--green)"></i>' 
            : '<i class="fas fa-user-minus" style="color: var(--red)"></i>';
        
        const text = item.type === 'checkin' ? 'Check-in' : 'Check-out';
        const timeStr = formatTimestamp(item.time);
        
        div.innerHTML = `
            <span>${icon} ${text}</span>
            <span class="history-time">${timeStr}</span>
        `;
        
        historyList.appendChild(div);
    });
}

// Formatiraj timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Ako je u poslednjih 60 sekundi
    if (diff < 60000) {
        return 'Upravo sad';
    }
    
    // Ako je u poslednjih 60 minuta
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `Pre ${minutes} min`;
    }
    
    // Ako je danas
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Inače prikaži datum i vreme
    return date.toLocaleString('sr-RS', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Notifikacija
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--green)' : 'var(--red)'};
        color: var(--dark-bg);
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// CSS za animacije
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Auto-refresh svakih 10 sekundi
setInterval(updateDisplay, 10000);

// Inicijalizacija
loadData();
updateDisplay();

console.log('%c🔐 ADMIN PANEL AKTIVAN', 'font-size: 20px; font-weight: bold; color: #FFD700;');