// Global State (In-Memory Database)
let students = [];

// DOM Elements
const tableBody = document.getElementById('table-body');
const msgArea = document.getElementById('message-area');
const saveBtn = document.getElementById('save-btn');
const updateBtn = document.getElementById('update-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Inputs
const idInput = document.getElementById('student-id');
const nameInput = document.getElementById('name');
const courseInput = document.getElementById('course');
const marksInput = document.getElementById('marks');

// --- 1. INITIALIZATION: Fetch Data ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('students.json');
        
        if (!response.ok) throw new Error("Failed to load database.");

        students = await response.json();
        renderTable();
        showMessage("Database loaded successfully!", "success");

    } catch (error) {
        showMessage("Error: " + error.message, "error");
    }
});

// --- 2. READ: Display Table ---
function renderTable() {
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td><strong>${student.name}</strong></td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
            <td>
                <button class="btn-edit" onclick="prepareEdit(${student.id})">Edit</button>
                <button class="btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- 3. CREATE: Add Student ---
saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const course = courseInput.value.trim();
    const marks = marksInput.value;

    if (!validateInput(name, course, marks)) return;

    // Generate New ID (Max ID + 1)
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 101;

    const newStudent = {
        id: newId,
        name: name,
        course: course,
        marks: parseInt(marks)
    };

    students.push(newStudent);
    renderTable();
    clearForm();
    showMessage("Student added successfully!", "success");
});

// --- 4. UPDATE: Modify Student ---
updateBtn.addEventListener('click', () => {
    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();
    const course = courseInput.value.trim();
    const marks = marksInput.value;

    if (!validateInput(name, course, marks)) return;

    // Find index of student in array
    const index = students.findIndex(s => s.id === id);

    if (index !== -1) {
        students[index] = { id, name, course, marks: parseInt(marks) };
        renderTable();
        clearForm();
        showMessage("Student updated successfully!", "success");
    } else {
        showMessage("Error: Student not found.", "error");
    }
});

// Prepare Edit Mode (Load data into inputs)
window.prepareEdit = (id) => {
    const student = students.find(s => s.id === id);
    if (student) {
        idInput.value = student.id;
        nameInput.value = student.name;
        courseInput.value = student.course;
        marksInput.value = student.marks;

        // Toggle Buttons
        saveBtn.classList.add('hidden');
        updateBtn.classList.remove('hidden');
        cancelBtn.classList.remove('hidden');
        
        document.getElementById('form-title').textContent = "Edit Student";
    }
};

// --- 5. DELETE: Remove Student ---
window.deleteStudent = (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
        students = students.filter(s => s.id !== id);
        renderTable();
        showMessage("Student record deleted.", "success");
    }
};

// --- Utilities ---
function validateInput(name, course, marks) {
    if (!name || !course || !marks) {
        showMessage("Please fill all fields.", "error");
        return false;
    }
    if (marks < 0 || marks > 100) {
        showMessage("Marks must be between 0 and 100.", "error");
        return false;
    }
    return true;
}

function clearForm() {
    idInput.value = '';
    nameInput.value = '';
    courseInput.value = '';
    marksInput.value = '';

    saveBtn.classList.remove('hidden');
    updateBtn.classList.add('hidden');
    cancelBtn.classList.add('hidden');
    document.getElementById('form-title').textContent = "Add New Student";
}

cancelBtn.addEventListener('click', clearForm);

function showMessage(msg, type) {
    msgArea.textContent = msg;
    msgArea.className = `message ${type}`;
    msgArea.classList.remove('hidden');
    setTimeout(() => msgArea.classList.add('hidden'), 3000);
}