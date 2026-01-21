// --- REQUIREMENT 1: Data Structure ---
// Array of question objects defining type, label, and validation rules.
const surveyQuestions = [
    {
        id: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        validation: { required: true, minLength: 3 }
    },
    {
        id: "ageGroup",
        label: "Age Group",
        type: "radio",
        options: ["18-24", "25-34", "35-50", "50+"],
        validation: { required: true }
    },
    {
        id: "interests",
        label: "Interests (Select at least 2)",
        type: "checkbox",
        options: ["Coding", "Design", "Marketing", "Business", "Gaming"],
        validation: { required: true, minSelect: 2 } // Custom rule for checkboxes
    },
    {
        id: "bio",
        label: "Short Bio",
        type: "textarea",
        placeholder: "Tell us about yourself...",
        validation: { required: false, maxLength: 100 } // Optional field with max limit
    }
];

// --- REQUIREMENT 2: Dynamic Form Generation ---
function initForm() {
    const container = document.getElementById('form-fields');

    surveyQuestions.forEach(q => {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        // 1. Create Label
        const label = document.createElement('label');
        label.className = 'form-label';
        label.innerText = q.label + (q.validation.required ? " *" : "");
        group.appendChild(label);

        // 2. Create Input based on Type
        let inputContainer;

        if (q.type === 'text' || q.type === 'textarea') {
            const input = document.createElement(q.type === 'textarea' ? 'textarea' : 'input');
            input.type = q.type === 'textarea' ? '' : 'text';
            input.className = 'form-control';
            input.id = q.id;
            input.name = q.id; // Important for validation
            if(q.placeholder) input.placeholder = q.placeholder;
            group.appendChild(input);
        } 
        else if (q.type === 'radio' || q.type === 'checkbox') {
            inputContainer = document.createElement('div');
            inputContainer.className = 'option-group';
            inputContainer.id = q.id; // Used as container ID for error targeting

            q.options.forEach(opt => {
                const wrapper = document.createElement('label');
                wrapper.className = 'option-label';
                
                const input = document.createElement('input');
                input.type = q.type;
                input.name = q.id; // Group by name
                input.value = opt;
                
                wrapper.appendChild(input);
                wrapper.appendChild(document.createTextNode(opt));
                inputContainer.appendChild(wrapper);
            });
            group.appendChild(inputContainer);
        }

        // 3. Create Error Message Placeholder (Requirement 5)
        const errorMsg = document.createElement('small');
        errorMsg.className = 'error-msg';
        errorMsg.id = `error-${q.id}`;
        group.appendChild(errorMsg);

        container.appendChild(group);
    });
}

// --- REQUIREMENT 3 & 4: Validation Functions ---

// Helper: Show error message inline
function showError(fieldId, message) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    errorEl.innerText = message;
    errorEl.style.display = 'block';
    
    // Highlight input if it's a text/textarea
    const inputEl = document.getElementById(fieldId);
    if (inputEl && (inputEl.tagName === 'INPUT' || inputEl.tagName === 'TEXTAREA')) {
        inputEl.classList.add('input-error');
    }
}

// Helper: Clear error message
function clearError(fieldId) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    errorEl.style.display = 'none';
    
    const inputEl = document.getElementById(fieldId);
    if (inputEl) inputEl.classList.remove('input-error');
}

// Core Validator
function validateField(question) {
    const rules = question.validation;
    if (!rules) return true; // No rules, pass

    let isValid = true;
    let errorText = "";

    // Handle Text Inputs
    if (question.type === 'text' || question.type === 'textarea') {
        const input = document.getElementById(question.id);
        const val = input.value.trim();

        if (rules.required && val === "") {
            isValid = false;
            errorText = "This field is required.";
        } else if (rules.minLength && val.length < rules.minLength) {
            isValid = false;
            errorText = `Must be at least ${rules.minLength} characters.`;
        } else if (rules.maxLength && val.length > rules.maxLength) {
            isValid = false;
            errorText = `Must be less than ${rules.maxLength} characters.`;
        }
    }
    // Handle Radio/Checkbox Inputs
    else if (question.type === 'radio' || question.type === 'checkbox') {
        const selected = document.querySelectorAll(`input[name="${question.id}"]:checked`);
        
        if (rules.required && selected.length === 0) {
            isValid = false;
            errorText = "Please select an option.";
        } else if (rules.minSelect && selected.length < rules.minSelect) {
            isValid = false;
            errorText = `Please select at least ${rules.minSelect} options.`;
        }
    }

    if (!isValid) {
        showError(question.id, errorText);
        return false;
    } else {
        clearError(question.id);
        return true;
    }
}

// --- REQUIREMENT 6: Prevent Submission until Valid ---
document.getElementById('dynamicForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop default HTML submission

    let isFormValid = true;

    // Validate every question in the array
    surveyQuestions.forEach(q => {
        const fieldValid = validateField(q);
        if (!fieldValid) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        // Here you would typically send data to a server
        alert("✅ Form Validated Successfully! Submitting...");
        console.log("Form submitted at: " + new Date().toLocaleTimeString());
        // this.submit(); // Uncomment to actually submit
    } else {
        console.log("❌ Validation failed. Check errors.");
    }
});

// Initialize form on load
initForm();