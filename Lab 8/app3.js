const express = require("express");
const app = express();
const PORT = 3000;

class Course {
    constructor(courseName, instructor) {
        this.courseName = courseName;
        this.instructor = instructor;
    }

    displayCourse() {
        return `Course: ${this.courseName}, Instructor: ${this.instructor}`;
    }
}

let course1 = new Course("Web Technologies", "Prof. S Gopikrishnan");

let enrollCourse = new Promise((resolve, reject) => {
    let seatsAvailable = true;
    if (seatsAvailable) {
        resolve("Enrollment Successful");
    } else {
        reject("Course Full");
    }
});

app.get("/", (req, res) => {
    let courseInfo = course1.displayCourse();
    enrollCourse
        .then(msg => {
            res.send(`<p>${courseInfo}</p><p>${msg}</p>`);
        })
        .catch(err => {
            res.send(`<p>${courseInfo}</p><p>${err}</p>`);
        });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});