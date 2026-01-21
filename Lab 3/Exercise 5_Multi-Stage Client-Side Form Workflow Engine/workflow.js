
// --- STATE MANAGEMENT ---
// REQ 6: Store user input temporarily
let formData = {
    username: "",
    password: "",
    email: "",
    phone: "",
    commMethod: "",
    terms: false
};

let currentStep = 1; // Starts at Stage 1
const totalSteps = 4;

// --- REQ 2: Navigation Control ---

function nextStage() {
    // REQ 5: Prevent navigation if validation fails
    if (validateCurrentStage()) {
        saveCurrentData(); // Save data to state object
        if (currentStep < totalSteps) {
            currentStep++;
            updateUI();
        }
    }
}

function prevStage() {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
    }
}

// --- REQ 1 & 5: Validation Logic ---
function validateCurrentStage() {
    let isValid = true;
    clearErrors();

    // STAGE 1 Validation Rules
    if (currentStep === 1) {
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();

        if (user.length < 4) {
            showError('username', 'err-username');
            isValid = false;
        }
        if (pass.length < 6) {
            showError('password', 'err-password');
            isValid = false;
        }
    }

    // STAGE 2 Validation Rules
    else if (currentStep === 2) {
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // Simple Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Simple Phone Regex (10 digits)
        const phoneRegex = /^\d{10}$/;

        if (!emailRegex.test(email)) {
            showError('email', 'err-email');
            isValid = false;
        }
        if (!phoneRegex.test(phone)) {
            showError('phone', 'err-phone');
            isValid = false;
        }
    }

    // STAGE 3 Validation Rules
    else if (currentStep === 3) {
        const comm = document.getElementById('commMethod').value;
        const terms = document.getElementById('terms').checked;

        if (comm === "") {
            showError('commMethod', 'err-commMethod');
            isValid = false;
        }
        if (!terms) {
            // Special handling for checkbox error visibility
            document.getElementById('err-terms').style.display = 'block';
            isValid = false;
        }
    }

    return isValid;
}

// --- DATA HANDLING ---

function saveCurrentData() {
    // Capture data based on current step to the formData object
    if (currentStep === 1) {
        formData.username = document.getElementById('username').value;
        formData.password = document.getElementById('password').value;
    } else if (currentStep === 2) {
        formData.email = document.getElementById('email').value;
        formData.phone = document.getElementById('phone').value;
    } else if (currentStep === 3) {
        formData.commMethod = document.getElementById('commMethod').value;
        formData.terms = document.getElementById('terms').checked;
    }
}

function generateSummary() {
    const summaryDiv = document.getElementById('review-summary');
    summaryDiv.innerHTML = `
        <div class="review-item">
            <span class="review-label">Username:</span> 
            <span class="review-val">${formData.username}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Email:</span> 
            <span class="review-val">${formData.email}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Phone:</span> 
            <span class="review-val">${formData.phone}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Contact via:</span> 
            <span class="review-val">${formData.commMethod}</span>
        </div>
    `;
}

// --- REQ 3 & 4: DOM Manipulation & Progress ---

function updateUI() {
    // 1. Hide all stages
    const stages = document.querySelectorAll('.stage');
    stages.forEach(stage => stage.classList.remove('active'));

    // 2. Show current stage
    // Note: dataset uses string, so we select based on index logic or attribute
    document.querySelector(`.stage[data-step="${currentStep}"]`).classList.add('active');

    // 3. Update Progress Bar
    // Logic: Step 1 = 25%, Step 2 = 50%, etc.
    const progressPercentage = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progressPercentage}%`;

    // 4. Special Case: If we reached step 4, generate the summary
    if (currentStep === 4) {
        generateSummary();
    }
}

// --- UTILITIES ---

function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add('input-error');
    document.getElementById(errorId).style.display = 'block';
}

function clearErrors() {
    // Hide all error messages and remove border highlights
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('input-error'));
}

function submitForm() {
    alert(`Success! Data sent to server:\n${JSON.stringify(formData, null, 2)}`);
    // Ideally, you would use fetch() here to post the data
    location.reload(); // Reset for demo
}

// Initialize Progress Bar on Load
updateUI();