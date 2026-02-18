const API_URL = "http://localhost:3000/students";

// DOM Elements
const studentForm = document.getElementById('student-form');
const tableBody = document.getElementById('table-body');
const msgBox = document.getElementById('msg-box');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// --- 1. READ (Fetch and Display) ---
async function getStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const students = await response.json();
        renderTable(students);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function renderTable(students) {
    tableBody.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.dept}</td>
            <td>${student.marks}</td>
            <td>
                <button class="btn-warning" onclick="editMode('${student.id}')">Edit</button>
                <button class="btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- 2. CREATE & UPDATE (Handle Form Submit) ---
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('student-id').value;
    const name = document.getElementById('name').value;
    const dept = document.getElementById('dept').value;
    const marks = document.getElementById('marks').value;

    const studentData = { name, dept, marks };

    try {
        if (id) {
            // Update Existing Student (PUT)
            await fetchRequest(`${API_URL}/${id}`, 'PUT', studentData);
            showMessage("Student updated successfully!", "success");
        } else {
            // Create New Student (POST)
            await fetchRequest(API_URL, 'POST', studentData);
            showMessage("Student added successfully!", "success");
        }
        
        resetForm();
        getStudents(); // Refresh table
    } catch (error) {
        showMessage("Operation failed: " + error.message, "error");
    }
});

// Generic Helper for API Requests
async function fetchRequest(url, method, data) {
    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
}

// --- 3. DELETE ---
window.deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Failed to delete");
        
        showMessage("Student deleted successfully", "success");
        getStudents();
    } catch (error) {
        showMessage(error.message, "error");
    }
};

// --- 4. PREPARE EDIT (Fill Form) ---
window.editMode = async (id) => {
    // Fetch specific student details to fill the form
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const student = await response.json();

        // Fill form
        document.getElementById('student-id').value = student.id;
        document.getElementById('name').value = student.name;
        document.getElementById('dept').value = student.dept;
        document.getElementById('marks').value = student.marks;

        // Change UI to "Edit Mode"
        formTitle.textContent = "Edit Student";
        submitBtn.textContent = "Update Student";
        submitBtn.classList.replace('btn-primary', 'btn-warning');
        cancelBtn.classList.remove('hidden');

    } catch (error) {
        showMessage("Could not fetch student details", "error");
    }
};

// --- Utilities ---
function showMessage(msg, type) {
    msgBox.textContent = msg;
    msgBox.className = `msg-box ${type}`;
    msgBox.classList.remove('hidden');
    setTimeout(() => msgBox.classList.add('hidden'), 3000);
}

function resetForm() {
    studentForm.reset();
    document.getElementById('student-id').value = '';
    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    submitBtn.classList.replace('btn-warning', 'btn-primary');
    cancelBtn.classList.add('hidden');
}

cancelBtn.addEventListener('click', resetForm);

// Initial Load
getStudents();