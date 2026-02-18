// CONFIGURATION
const API_KEY = 'YOUR_API_KEY_HERE'; // <-- PASTE YOUR KEY HERE
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const errorMsg = document.getElementById('error-msg');
const loader = document.getElementById('loader');
const cacheNotice = document.getElementById('cache-notice');

// Cache Variable (Stores the last successful result)
let weatherCache = {
    city: null,
    data: null
};

// Event Listener
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Allow "Enter" key to trigger search
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

async function fetchWeather(city) {
    // 1. Reset UI
    errorMsg.classList.add('hidden');
    weatherCard.classList.add('hidden');
    cacheNotice.classList.add('hidden');

    // 2. CHECK CACHE: If the user searches the same city again, use local data
    if (weatherCache.city && weatherCache.city.toLowerCase() === city.toLowerCase()) {
        console.log("Serving from cache...");
        renderWeather(weatherCache.data);
        cacheNotice.classList.remove('hidden');
        return; // Stop here, don't hit the API
    }

    // 3. Show Loader
    loader.classList.remove('hidden');

    try {
        // 4. Construct URL with Query Parameters
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`; // units=metric gives Celsius

        const response = await fetch(url);

        // 5. Handle HTTP Errors (e.g., 404 City Not Found)
        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found. Please try again.");
            if (response.status === 401) throw new Error("Invalid API Key.");
            throw new Error("Something went wrong.");
        }

        const data = await response.json();

        // 6. Save to Cache
        weatherCache = {
            city: city,
            data: data
        };

        // 7. Update UI
        renderWeather(data);

    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
    } finally {
        // Always hide loader
        loader.classList.add('hidden');
    }
}

function renderWeather(data) {
    // Parsing JSON data to DOM
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('condition').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    
    // Set Weather Icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Show Card
    weatherCard.classList.remove('hidden');
}