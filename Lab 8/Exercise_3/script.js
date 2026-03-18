class Course {
    constructor(courseName, instructor) {
        this.courseName = courseName;
        this.instructor = instructor;
    }
    
    displayCourse() {
        const courseInfo = `Course: ${this.courseName}, Instructor: ${this.instructor}`;
        console.log(courseInfo);
        document.getElementById("output").innerText += courseInfo + "\n";
    }
}

let course1 = new Course("Web Technologies", "Prof. S Gopikrishnan");
course1.displayCourse();

let enrollCourse = new Promise((resolve, reject) => {
    let seatsAvailable = true;
    if (seatsAvailable) {
        resolve("Enrollment Successful");
    } else {
        reject("Course Full");
    }
});

enrollCourse
    .then(msg => {
        console.log(msg);
        document.getElementById("output").innerText += msg + "\n";
    })
    .catch(err => {
        console.log(err);
        document.getElementById("output").innerText += err + "\n";
    });