let xmlDoc = null; // This will hold our "Database" in memory

document.addEventListener("DOMContentLoaded", loadXML);

// --- 1. READ: Fetch and Parse XML ---
function loadXML() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "employees.xml", true);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // responseXML automatically parses the XML file into a DOM object
                xmlDoc = xhr.responseXML;
                
                if (!xmlDoc) {
                    showMessage("Error: Invalid or Empty XML", "error");
                    return;
                }
                renderTable();
            } else {
                showMessage("Failed to load XML file.", "error");
            }
        }
    };
    xhr.send();
}

// Function to display XML data in HTML Table
function renderTable() {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        
        // Helper to safely get text content from XML nodes
        const id = emp.getElementsByTagName("id")[0].textContent;
        const name = emp.getElementsByTagName("name")[0].textContent;
        const dept = emp.getElementsByTagName("department")[0].textContent;
        const salary = emp.getElementsByTagName("salary")[0].textContent;

        const row = `
            <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${dept}</td>
                <td>$${salary}</td>
                <td>
                    <button class="edit-btn" onclick="prepareEdit('${id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteEmployee('${id}')">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    }
}

// --- 2. CREATE: Add New Node ---
function addEmployee() {
    const name = document.getElementById("emp-name").value;
    const dept = document.getElementById("emp-dept").value;
    const salary = document.getElementById("emp-salary").value;

    if (!name || !dept || !salary) {
        showMessage("Please fill all fields", "error");
        return;
    }

    // Generate new ID (Simple logic: Max ID + 1)
    const employees = xmlDoc.getElementsByTagName("employee");
    const newId = employees.length > 0 ? parseInt(employees[employees.length - 1].getElementsByTagName("id")[0].textContent) + 1 : 101;

    // Create XML Nodes manually
    const newEmp = xmlDoc.createElement("employee");
    
    createNode(newEmp, "id", newId);
    createNode(newEmp, "name", name);
    createNode(newEmp, "department", dept);
    createNode(newEmp, "salary", salary);

    // Append to Root (<employees>)
    xmlDoc.documentElement.appendChild(newEmp);

    renderTable();
    resetForm();
    showMessage("Employee added successfully!", "success");
}

// Helper to create XML elements
function createNode(parent, tagName, text) {
    const elem = xmlDoc.createElement(tagName);
    const textNode = xmlDoc.createTextNode(text);
    elem.appendChild(textNode);
    parent.appendChild(elem);
}

// --- 3. DELETE: Remove Node ---
function deleteEmployee(id) {
    if (!confirm("Delete this employee?")) return;

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {
        const empId = employees[i].getElementsByTagName("id")[0].textContent;
        
        if (empId == id) {
            // Remove the node from the XML DOM
            xmlDoc.documentElement.removeChild(employees[i]);
            renderTable();
            showMessage("Employee deleted.", "success");
            return;
        }
    }
}

// --- 4. UPDATE: Edit Node ---
// Part A: Load data into form
function prepareEdit(id) {
    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {
        const empId = employees[i].getElementsByTagName("id")[0].textContent;

        if (empId == id) {
            document.getElementById("emp-id-hidden").value = id;
            document.getElementById("emp-name").value = employees[i].getElementsByTagName("name")[0].textContent;
            document.getElementById("emp-dept").value = employees[i].getElementsByTagName("department")[0].textContent;
            document.getElementById("emp-salary").value = employees[i].getElementsByTagName("salary")[0].textContent;

            // Toggle Buttons
            document.getElementById("add-btn").classList.add("hidden");
            document.getElementById("update-btn").classList.remove("hidden");
            document.getElementById("cancel-btn").classList.remove("hidden");
            return;
        }
    }
}

// Part B: Save changes to XML DOM
function saveUpdate() {
    const id = document.getElementById("emp-id-hidden").value;
    const name = document.getElementById("emp-name").value;
    const dept = document.getElementById("emp-dept").value;
    const salary = document.getElementById("emp-salary").value;

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {
        const empId = employees[i].getElementsByTagName("id")[0].textContent;

        if (empId == id) {
            // Update Text Content of XML nodes
            employees[i].getElementsByTagName("name")[0].textContent = name;
            employees[i].getElementsByTagName("department")[0].textContent = dept;
            employees[i].getElementsByTagName("salary")[0].textContent = salary;

            renderTable();
            resetForm();
            showMessage("Employee updated successfully!", "success");
            return;
        }
    }
}

// --- Utilities ---
function resetForm() {
    document.getElementById("emp-name").value = "";
    document.getElementById("emp-dept").value = "";
    document.getElementById("emp-salary").value = "";
    document.getElementById("emp-id-hidden").value = "";

    document.getElementById("add-btn").classList.remove("hidden");
    document.getElementById("update-btn").classList.add("hidden");
    document.getElementById("cancel-btn").classList.add("hidden");
}

function showMessage(msg, type) {
    const msgBox = document.getElementById("msg-box");
    msgBox.textContent = msg;
    msgBox.className = `msg-box ${type}`;
    msgBox.classList.remove("hidden");
    setTimeout(() => msgBox.classList.add("hidden"), 3000);
}