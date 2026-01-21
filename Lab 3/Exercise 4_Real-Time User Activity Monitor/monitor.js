// --- REQUIREMENT 2: Store Activity ---
let activityLog = [];
const logDisplay = document.getElementById('log-display');
const alertBox = document.getElementById('suspicious-alert');

// Thresholds
const SUSPICIOUS_LIMIT = 5; // Max events allowed in the time window
const TIME_WINDOW = 1000;   // Time window in ms (1 second)
let isPaused = false;       // To temporarily block logging on suspicious detection

// --- REQUIREMENT 1 & 3: Event Listeners (Capturing vs Bubbling) ---

// 1. CAPTURING PHASE Listener (document level)
// passing 'true' as the 3rd argument enables Capturing phase
document.addEventListener('click', (e) => handleEvent(e, 'Capturing'), true);
document.addEventListener('keydown', (e) => handleEvent(e, 'Capturing'), true);
document.addEventListener('focus', (e) => handleEvent(e, 'Capturing'), true); // Focus requires capture to track globally

// 2. BUBBLING PHASE Listener (specific container level)
// default is bubbling (false)
const zone = document.getElementById('zone-container');
zone.addEventListener('click', (e) => handleEvent(e, 'Bubbling'));
zone.addEventListener('keydown', (e) => handleEvent(e, 'Bubbling'));
// Note: 'focus' does not bubble, 'focusin' does. But we track focus via Capture above.

// --- CORE LOGIC ---

function handleEvent(e, manualPhaseLabel) {
    if (isPaused) return;

    // Ignore clicks on control buttons (Clear/Export) to keep log clean
    if (e.target.tagName === 'BUTTON' && e.target.parentElement.className === 'controls') return;

    const timestamp = new Date();
    
    // Determine Phase Label (1=Capture, 2=Target, 3=Bubble)
    let phaseName = manualPhaseLabel;
    let phaseClass = manualPhaseLabel === 'Capturing' ? 'phase-capture' : 'phase-bubble';

    // If the event is actually AT the target, label it specially
    if (e.target === e.currentTarget) {
        phaseName = "Target";
        phaseClass = "phase-target";
    }

    const entry = {
        id: activityLog.length + 1,
        time: timestamp.toLocaleTimeString(),
        rawTime: timestamp.getTime(), // for calculation
        type: e.type,
        target: e.target.tagName + (e.target.id ? `#${e.target.id}` : ''),
        phase: phaseName,
        phaseClass: phaseClass
    };

    // Store in Array
    activityLog.push(entry);

    // Update DOM (Req 4)
    renderEntry(entry);

    // Check Suspicious Activity (Req 5)
    detectSuspiciousActivity();
}

// --- REQUIREMENT 4: Dynamic Display ---
function renderEntry(entry) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `
        <span>[${entry.time}] <strong>${entry.type.toUpperCase()}</strong></span>
        <span>${entry.target}</span>
        <span class="${entry.phaseClass}">${entry.phase}</span>
    `;
    
    // Auto-scroll to bottom
    logDisplay.appendChild(div);
    logDisplay.scrollTop = logDisplay.scrollHeight;
}

// --- REQUIREMENT 5: Suspicious Activity Detection ---
function detectSuspiciousActivity() {
    const totalLogs = activityLog.length;
    if (totalLogs < SUSPICIOUS_LIMIT) return;

    // Get the last N events
    const recentEvents = activityLog.slice(-SUSPICIOUS_LIMIT);
    
    // Check time difference between the first and last of this slice
    const startTime = recentEvents[0].rawTime;
    const endTime = recentEvents[recentEvents.length - 1].rawTime;

    // If 5 events happened within 1 second (1000ms)
    if ((endTime - startTime) < TIME_WINDOW) {
        triggerWarning();
    }
}

function triggerWarning() {
    isPaused = true;
    alertBox.style.display = 'block';
    
    // Reset warning after 2 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
        isPaused = false;
        // Optionally clear log to prevent immediate re-trigger
        // activityLog = []; 
    }, 2000);
}

// --- REQUIREMENT 6: Export & Reset ---

function resetLog() {
    activityLog = [];
    logDisplay.innerHTML = '<div style="color:gray; text-align:center;">Log Cleared.</div>';
}

function exportLog() {
    if (activityLog.length === 0) {
        alert("No activity to export!");
        return;
    }

    // Format text
    let content = "--- USER ACTIVITY LOG ---\n\n";
    activityLog.forEach(log => {
        content += `[${log.time}] Event: ${log.type}, Target: ${log.target}, Phase: ${log.phase}\n`;
    });

    // Create a Blob (File-like object of immutable raw data)
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a link element, click it, then remove it
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'activity_log.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}