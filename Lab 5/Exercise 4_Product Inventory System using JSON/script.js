let inventory = []; // State container

// DOM Elements
const inventoryList = document.getElementById('inventory-list');
const totalValueEl = document.getElementById('total-value');
const productForm = document.getElementById('product-form');
const searchInput = document.getElementById('search-input');
const msgBox = document.getElementById('msg-box');

// Inputs
const nameIn = document.getElementById('name');
const catIn = document.getElementById('category');
const priceIn = document.getElementById('price');
const stockIn = document.getElementById('stock');
const idIn = document.getElementById('product-id');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

// --- 1. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('inventory.json');
        if (!response.ok) throw new Error("Failed to load inventory.");
        
        inventory = await response.json();
        renderTable(inventory); // Render all initially
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// --- 2. RENDER & CALCULATE ---
function renderTable(data) {
    inventoryList.innerHTML = '';
    let totalValue = 0;

    if (data.length === 0) {
        inventoryList.innerHTML = '<tr><td colspan="6" style="text-align:center;">No products found.</td></tr>';
        totalValueEl.textContent = '$0.00';
        return;
    }

    data.forEach(item => {
        // Calculate Total Value dynamically
        totalValue += (item.price * item.stock);

        // Low Stock Logic (Less than 5 items)
        const isLowStock = item.stock < 5;
        const stockClass = isLowStock ? 'low-stock' : '';
        const stockLabel = isLowStock ? `${item.stock} (Low!)` : item.stock;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.category}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td class="${stockClass}">${stockLabel}</td>
            <td>
                <button style="background:${isLowStock ? '#e74c3c' : '#3498db'}" onclick="editProduct(${item.id})">Edit</button>
                <button style="background:#7f8c8d" onclick="deleteProduct(${item.id})">Delete</button>
            </td>
        `;
        inventoryList.appendChild(row);
    });

    // Update Dashboard Summary
    totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
}

// --- 3. CREATE & UPDATE ---
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = idIn.value ? parseInt(idIn.value) : null;
    const name = nameIn.value.trim();
    const category = catIn.value.trim();
    const price = parseFloat(priceIn.value);
    const stock = parseInt(stockIn.value);

    if (price < 0 || stock < 0) {
        showMessage("Price and Stock cannot be negative.", "error");
        return;
    }

    if (id) {
        // UPDATE Existing
        const index = inventory.findIndex(p => p.id === id);
        if (index !== -1) {
            inventory[index] = { id, name, category, price, stock };
            showMessage("Product updated successfully.", "success");
        }
    } else {
        // CREATE New
        const newId = inventory.length > 0 ? Math.max(...inventory.map(p => p.id)) + 1 : 1;
        inventory.push({ id: newId, name, category, price, stock });
        showMessage("Product added to inventory.", "success");
    }

    resetForm();
    renderTable(inventory); // Re-render full list
});

// --- 4. DELETE ---
window.deleteProduct = (id) => {
    if (confirm("Delete this product permanently?")) {
        inventory = inventory.filter(p => p.id !== id);
        renderTable(inventory);
        showMessage("Product deleted.", "success");
    }
};

// --- 5. SEARCH / FILTER ---
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    // Filter logic
    const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.category.toLowerCase().includes(term)
    );

    renderTable(filtered);
});

// --- 6. UTILITIES ---
window.editProduct = (id) => {
    const item = inventory.find(p => p.id === id);
    if (item) {
        idIn.value = item.id;
        nameIn.value = item.name;
        catIn.value = item.category;
        priceIn.value = item.price;
        stockIn.value = item.stock;

        document.getElementById('form-title').textContent = "Edit Product";
        saveBtn.textContent = "Update Product";
        saveBtn.style.backgroundColor = "#f1c40f"; // Warning color
        saveBtn.style.color = "black";
        cancelBtn.classList.remove('hidden');
    }
};

function resetForm() {
    productForm.reset();
    idIn.value = '';
    document.getElementById('form-title').textContent = "Add New Product";
    saveBtn.textContent = "Add Product";
    saveBtn.style.backgroundColor = ""; // Reset to CSS default
    saveBtn.style.color = "";
    cancelBtn.classList.add('hidden');
}

cancelBtn.addEventListener('click', resetForm);

function showMessage(msg, type) {
    msgBox.textContent = msg;
    msgBox.className = `msg-box ${type}`;
    msgBox.classList.remove('hidden');
    setTimeout(() => msgBox.classList.add('hidden'), 3000);
}