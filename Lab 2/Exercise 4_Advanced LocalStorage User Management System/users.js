document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const userTableBody = document.querySelector("#userTable tbody");
  const clearAllBtn = document.getElementById("clearAll");

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function renderUsers() {
    userTableBody.innerHTML = "";
    const users = getUsers();
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.mobile}</td>
        <td>${user.password}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      userTableBody.appendChild(row);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !mobile || !password) {
      alert("All fields are mandatory");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      alert("Mobile number must be 10 digits");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const users = getUsers();
    if (users.some(user => user.email === email)) {
      alert("Email already registered");
      return;
    }

    users.push({ name, email, mobile, password });
    saveUsers(users);
    renderUsers();
    form.reset();
  });

  userTableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      const users = getUsers();
      users.splice(index, 1);
      saveUsers(users);
      renderUsers();
    }
  });

  clearAllBtn.addEventListener("click", () => {
    localStorage.removeItem("users");
    renderUsers();
  });

  renderUsers();
});