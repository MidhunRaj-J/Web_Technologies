function validateForm() {
    const name = document.getElementById("name").value.trim();
    const reg = document.getElementById("reg").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message");

    if (name === "" || reg === "" || email === "" || phone === "") {
        alert("All fields are required!");
        return false;
    } else {
        message.innerHTML = "✅ Thanks for registration!";
        return false; // prevent actual form submission
    }
}