document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const statusMsg = document.getElementById('status-msg');

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        // 1. Clear existing timer on every keystroke
        clearTimeout(debounceTimer);

        // 2. Clear results if input is empty
        if (query.length === 0) {
            resultsContainer.innerHTML = '';
            statusMsg.textContent = '';
            return;
        }

        // 3. Set new timer (Debounce delay: 300ms)
        debounceTimer = setTimeout(() => {
            fetchProducts(query);
        }, 300);
    });

    async function fetchProducts(query) {
        statusMsg.textContent = 'Searching...';
        
        try {
            const response = await fetch('products.json');

            if (!response.ok) {
                throw new Error('Failed to connect to the server.');
            }

            const products = await response.json();

            // 4. Filter logic (Simulating server-side search)
            const filteredProducts = products.filter(product => {
                const lowerQuery = query.toLowerCase();
                return (
                    product.name.toLowerCase().includes(lowerQuery) || 
                    product.category.toLowerCase().includes(lowerQuery)
                );
            });

            displayResults(filteredProducts);

        } catch (error) {
            console.error(error);
            statusMsg.textContent = 'Error: Could not fetch data.';
            statusMsg.style.color = 'red';
            resultsContainer.innerHTML = '';
        }
    }

    function displayResults(products) {
        // Clear previous results
        resultsContainer.innerHTML = '';

        if (products.length === 0) {
            statusMsg.textContent = 'No results found.';
            return;
        }

        statusMsg.textContent = `Found ${products.length} result(s).`;

        // 5. Dynamic DOM Generation
        products.forEach(product => {
            // Create Card Div
            const card = document.createElement('div');
            card.className = 'product-card';

            // Construct Inner HTML safely
            // Note: toFixed(2) ensures prices like 12.5 show as 12.50
            card.innerHTML = `
                <h3 class="product-name">${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            `;

            resultsContainer.appendChild(card);
        });
    }
});