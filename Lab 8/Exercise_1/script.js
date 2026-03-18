const calculateAverage = (m1, m2, m3) => {
    return (m1 + m2 + m3) / 3;
};

function processMarks() {
    let studentName = document.getElementById("nameInput").value;
    let mark1 = parseFloat(document.getElementById("mark1Input").value);
    let mark2 = parseFloat(document.getElementById("mark2Input").value);
    let mark3 = parseFloat(document.getElementById("mark3Input").value);

    if (isNaN(mark1) || isNaN(mark2) || isNaN(mark3)) {
        document.getElementById("output").innerHTML = `<span style="color: red;">Please enter all three marks.</span>`;
        return;
    }

    let totalMarks = mark1 + mark2 + mark3;
    let average = calculateAverage(mark1, mark2, mark3);

    let htmlOutput = `
        <strong>Student Name:</strong> ${studentName} <br>
        <strong>Total Marks:</strong> ${totalMarks} <br>
        <strong>Average Marks:</strong> ${average.toFixed(2)}
    `;

    document.getElementById("output").innerHTML = htmlOutput;

    console.log(`Student Name: ${studentName}`);
    console.log(`Total Marks: ${totalMarks}`);
    console.log(`Average Marks: ${average.toFixed(2)}`);
}