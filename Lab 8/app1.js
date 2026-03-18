const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
   
    let studentName = "Arun";
    let mark1 = 85;
    let mark2 = 90;
    let mark3 = 88;

    const calculateTotal = (m1, m2, m3) => m1 + m2 + m3;
    const calculateAverage = (m1, m2, m3) => (m1 + m2 + m3) / 3;

    let total = calculateTotal(mark1, mark2, mark3);
    let average = calculateAverage(mark1, mark2, mark3);

    const output = `
        <h2>Student Report</h2>
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Total Marks:</strong> ${total}</p>
        <p><strong>Average Marks:</strong> ${average.toFixed(2)}</p>
    `;

    res.send(output);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});