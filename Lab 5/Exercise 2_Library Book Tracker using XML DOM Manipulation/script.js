let xmlDoc; // Global variable to hold the XML structure

document.addEventListener('DOMContentLoaded', () => {
    loadLibraryData();
});

// --- 1. FETCH & PARSE XML ---
function loadLibraryData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            xmlDoc = xhr.responseXML;
            renderTable();
        }
    };
    xhr.send();
}

// --- 2. RENDER TABLE ---
function renderTable() {
    const tableBody = document.getElementById("book-list");
    tableBody.innerHTML = ""; // Clear current view

    const books = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        
        // Extract Data safely
        const id = book.getElementsByTagName("id")[0].textContent;
        const title = book.getElementsByTagName("title")[0].textContent;
        const author = book.getElementsByTagName("author")[0].textContent;
        const status = book.getElementsByTagName("status")[0].textContent;

        // Create HTML Row
        const row = document.createElement("tr");
        
        // Status Badge Logic
        const statusClass = status === "Available" ? "status-available" : "status-borrowed";

        row.innerHTML = `
            <td>${id}</td>
            <td><strong>${title}</strong></td>
            <td>${author}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn-toggle" onclick="toggleStatus('${id}')">
                    ${status === "Available" ? "Borrow" : "Return"}
                </button>
                <button class="btn-delete" onclick="deleteBook('${id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// --- 3. CREATE: Add New Book ---
function addBook() {
    const titleInput = document.getElementById("book-title");
    const authorInput = document.getElementById("book-author");
    const statusInput = document.getElementById("book-status");

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const status = statusInput.value;

    // Validation
    if (!title || !author) {
        showNotification("Please enter both Title and Author.");
        return;
    }

    // Generate ID (find max ID + 1)
    const books = xmlDoc.getElementsByTagName("book");
    let maxId = 0;
    for(let i=0; i<books.length; i++) {
        const currentId = parseInt(books[i].getElementsByTagName("id")[0].textContent);
        if(currentId > maxId) maxId = currentId;
    }
    const newId = maxId + 1;

    // Create XML Nodes
    const newBook = xmlDoc.createElement("book");
    
    createXMLNode(newBook, "id", newId);
    createXMLNode(newBook, "title", title);
    createXMLNode(newBook, "author", author);
    createXMLNode(newBook, "status", status);

    // Append to Root (<library>)
    xmlDoc.documentElement.appendChild(newBook);

    // Update UI
    renderTable();
    
    // Clear Form
    titleInput.value = "";
    authorInput.value = "";
    showNotification("Book added successfully!");
}

// Helper to create simple XML tags
function createXMLNode(parent, tagName, content) {
    const node = xmlDoc.createElement(tagName);
    node.textContent = content;
    parent.appendChild(node);
}

// --- 4. UPDATE: Toggle Status ---
function toggleStatus(id) {
    const book = findBookById(id);
    if (book) {
        const statusNode = book.getElementsByTagName("status")[0];
        const currentStatus = statusNode.textContent;
        
        // Toggle Logic
        statusNode.textContent = currentStatus === "Available" ? "Borrowed" : "Available";
        
        renderTable();
    }
}

// --- 5. DELETE: Remove Book ---
function deleteBook(id) {
    if(!confirm("Are you sure you want to remove this book?")) return;

    const book = findBookById(id);
    if (book) {
        // Remove the book node from its parent (<library>)
        xmlDoc.documentElement.removeChild(book);
        renderTable();
        showNotification("Book removed.");
    }
}

// --- Utility: Find Node by ID ---
function findBookById(id) {
    const books = xmlDoc.getElementsByTagName("book");
    for (let i = 0; i < books.length; i++) {
        if (books[i].getElementsByTagName("id")[0].textContent == id) {
            return books[i];
        }
    }
    return null;
}

function showNotification(msg) {
    const notif = document.getElementById("notification");
    notif.textContent = msg;
    notif.classList.remove("hidden");
    setTimeout(() => notif.classList.add("hidden"), 3000);
}