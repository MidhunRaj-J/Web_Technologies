const student = {
    id: 101,
    name: "Priya",
    department: "CSE",
    marks: 92
};

const { id, name, department, marks } = student;

let calculatedGrade;
if (marks >= 90) {
    calculatedGrade = "A";
} else if (marks >= 80) {
    calculatedGrade = "B";
} else if (marks >= 70) {
    calculatedGrade = "C";
} else {
    calculatedGrade = "F";
}

const updatedStudent = {
    ...student,
    grade: calculatedGrade
};

const destructuredText = `${id} ${name} ${department} ${marks}`;
document.getElementById("destructuredOutput").innerText = destructuredText;

const objectString = `{ id: ${updatedStudent.id}, name: '${updatedStudent.name}', department: '${updatedStudent.department}', marks: ${updatedStudent.marks}, grade: '${updatedStudent.grade}' }`;
document.getElementById("objectOutput").innerText = objectString;

console.log(id, name, department, marks);
console.log(updatedStudent);