const express = require("express");
const app = express();
const PORT = 3000;

// Define the student object
const student = {
    id: 101,
    name: "Priya",
    department: "CSE",
    marks: 92
};

// Destructure values
const { id, name, department, marks } = student;

// Calculate grade based on marks
let grade;
if (marks >= 90) {
    grade = "A";
} else if (marks >= 80) {
    grade = "B";
} else if (marks >= 70) {
    grade = "C";
} else {
    grade = "F";
}

// Create updated student object
const updatedStudent = {
    ...student,
    grade
};

// Route to display results
app.get("/", (req, res) => {
    const output = `
        <h2>Destructured Output:</h2>
        <p>${id} ${name} ${department} ${marks}</p>
        
        <h2>Updated Student Object:</h2>
        <pre>{ id: ${updatedStudent.id}, name: '${updatedStudent.name}', department: '${updatedStudent.department}', marks: ${updatedStudent.marks}, grade: '${updatedStudent.grade}' }</pre>
    `;
    res.send(output);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});