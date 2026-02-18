document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const feedbackMsg = document.getElementById('username-feedback');
    const submitBtn = document.getElementById('submit-btn');
    const loader = document.getElementById('loader');
    const form = document.getElementById('registration-form');

    let debounceTimer;

    // Listen for typing events
    usernameInput.addEventListener('input', (e) => {
        const username = e.target.value.trim();

        // Reset UI State
        feedbackMsg.textContent = '';
        feedbackMsg.className = 'feedback';
        submitBtn.disabled = true;
        
        // Clear previous timer (Debouncing)
        clearTimeout(debounceTimer);

        if (username.length === 0) {
            loader.classList.add('hidden');
            return;
        }

        // Show loading indicator
        loader.classList.remove('hidden');

        // Set a timer to wait for the user to stop typing (500ms)
        debounceTimer = setTimeout(() => {
            checkUsernameAvailability(username);
        }, 500);
    });

    async function checkUsernameAvailability(username) {
        try {
            // Fetch the mock database
            const response = await fetch('users.json');
            
            if (!response.ok) throw new Error("Network error");

            const users = await response.json();

            // Simulate Network Latency (Artificial delay for demo purposes)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Logic: Check if username exists (Case insensitive)
            const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());

            updateUI(userExists);

        } catch (error) {
            console.error('Error fetching users:', error);
            feedbackMsg.textContent = 'Error checking availability.';
            feedbackMsg.style.color = 'orange';
        } finally {
            // Always hide loader when done
            loader.classList.add('hidden');
        }
    }

    function updateUI(isTaken) {
        if (isTaken) {
            feedbackMsg.textContent = '❌ Username already taken';
            feedbackMsg.classList.add('error');
            feedbackMsg.classList.remove('success');
            submitBtn.disabled = true;
        } else {
            feedbackMsg.textContent = '✅ Username available';
            feedbackMsg.classList.add('success');
            feedbackMsg.classList.remove('error');
            submitBtn.disabled = false;
        }
    }

    // Final Prevention: Stop form submit if button is somehow clicked
    form.addEventListener('submit', (e) => {
        if (submitBtn.disabled) {
            e.preventDefault();
            alert("Please choose a valid username first.");
        } else {
            e.preventDefault();
            alert("Registration Successful!");
        }
    });
});