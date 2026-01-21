document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const roleSelect = document.getElementById("role");
  const skillsGroup = document.getElementById("skillsGroup");

  // Validation feedback function
  function showFeedback(input, message) {
    const feedback = document.getElementById(input.id + "Feedback");
    if (message) {
      input.classList.add("error");
      feedback.textContent = message;
    } else {
      input.classList.remove("error");
      feedback.textContent = "";
    }
  }

  // Email validation (domain check)
  function validateEmail(email) {
    const allowedDomains = ["gmail.com", "yahoo.com", "vitap.ac.in"];
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  }

  // Password strength validation
  function validatePassword(password, role) {
    let regex;
    if (role === "Admin") {
      // Strongest requirement: 8+ chars, uppercase, lowercase, number, special char
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    } else if (role === "Teacher") {
      // Medium: 6+ chars, letters + numbers
      regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    } else {
      // Student: minimum 5 chars
      regex = /^.{5,}$/;
    }
    return regex.test(password);
  }

  // Dynamic role-based field visibility
  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "Teacher" || roleSelect.value === "Admin") {
      skillsGroup.classList.remove("hidden");
    } else {
      skillsGroup.classList.add("hidden");
    }
  });

  // Real-time validation
  form.addEventListener("input", (e) => {
    const input = e.target;
    const role = roleSelect.value;

    if (input.id === "email") {
      showFeedback(input, validateEmail(input.value) ? "" : "Invalid email domain.");
    }

    if (input.id === "password") {
      showFeedback(input, validatePassword(input.value, role) ? "" : "Weak password for role " + role);
    }

    if (input.id === "confirmPassword") {
      const password = document.getElementById("password").value;
      showFeedback(input, input.value === password ? "" : "Passwords do not match.");
    }

    if (input.id === "age") {
      showFeedback(input, input.value >= 18 ? "" : "You must be at least 18.");
    }

    if (input.id === "name") {
      showFeedback(input, input.value.trim() ? "" : "Name is required.");
    }

    if (input.id === "skills" && (role === "Teacher" || role === "Admin")) {
      showFeedback(input, input.value.trim() ? "" : "Skills are required.");
    }
  });

  // Prevent submission until all validations pass
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const role = roleSelect.value;

    // Check all fields
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        showFeedback(input, "This field is required.");
        valid = false;
      }
    });

    // Specific validations
    if (!validateEmail(document.getElementById("email").value)) valid = false;
    if (!validatePassword(document.getElementById("password").value, role)) valid = false;
    if (document.getElementById("password").value !== document.getElementById("confirmPassword").value) valid = false;
    if (document.getElementById("age").value < 18) valid = false;
    if ((role === "Teacher" || role === "Admin") && !document.getElementById("skills").value.trim()) valid = false;

    if (valid) {
      alert("Registration successful!");
      form.reset();
      skillsGroup.classList.add("hidden");
    } else {
      alert("Please fix the errors before submitting.");
    }
  });
});