import { WeatherService } from "./weatherService.js";
import { WeatherUI } from "./ui.js";
import { Storage } from "./storage.js";
/* 🌙 Automatic Dark Mode Based on Time */
function applyDarkModeByTime() {
    const hour = new Date().getHours();

    if (hour >= 18 || hour < 6) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

applyDarkModeByTime();


const service = new WeatherService();
const ui = new WeatherUI();

let unit = "metric";
let currentCity = "";

async function loadByCity(city) {
    const current = await service.getCurrentByCity(city, unit);
    const forecast = await service.getForecastByCity(city, unit);
    const alerts = await service.getAlerts(current.coord.lat, current.coord.lon);

    currentCity = city;

    ui.showCurrent(current, unit);
    ui.showForecast(forecast, unit);
    ui.showAlerts(alerts);
    ui.updateMap(current.coord.lat, current.coord.lon);

    document.getElementById("favBtn").onclick = () => {
        Storage.saveFavorite(city);
        renderFavorites();
    };
}

async function loadByLocation() {
    navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude } = pos.coords;

        const current = await service.getCurrentByCoords(latitude, longitude, unit);
        const forecast = await service.getForecastByCoords(latitude, longitude, unit);
        const alerts = await service.getAlerts(latitude, longitude);

        currentCity = current.name;

        ui.showCurrent(current, unit);
        ui.showForecast(forecast, unit);
        ui.showAlerts(alerts);
        ui.updateMap(latitude, longitude);

        document.getElementById("favBtn").onclick = () => {
            Storage.saveFavorite(currentCity);
            renderFavorites();
        };
    });
}

function renderFavorites() {
    const ul = document.getElementById("favoriteList");
    ul.innerHTML = "";

    Storage.getFavorites().forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.onclick = () => loadByCity(city);
        ul.appendChild(li);
    });
}

document.getElementById("searchBtn").onclick = () => {
    const city = searchInput.value.trim();
    if (city) loadByCity(city);
};

document.getElementById("unitToggle").onclick = () => {
    unit = unit === "metric" ? "imperial" : "metric";
    unitToggle.textContent = unit === "metric" ? "°C" : "°F";
    if (currentCity) loadByCity(currentCity);
};

document.getElementById("locationBtn").onclick = loadByLocation;

document.getElementById("shareBtn").onclick = () => {
    if (navigator.share) {
        navigator.share({
            title: "Weather App",
            text: `Weather in ${currentCity}`,
            url: location.href
        });
    } else {
        alert("Sharing not supported on this browser");
    }
};
/* ----------------------------------------
   LOCATION DETECTION
---------------------------------------- */

// Automatic location detection on page load
async function detectLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        loadByCity("Mumbai"); // fallback default city
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const current = await service.getCurrentByCoords(latitude, longitude, unit);
        const forecast = await service.getForecastByCoords(latitude, longitude, unit);
        const alerts = await service.getAlerts(latitude, longitude);

        currentCity = current.name;

        ui.showCurrent(current, unit);
        ui.showForecast(forecast, unit);
        ui.showAlerts(alerts);
        ui.updateMap(latitude, longitude);

        // Favorite button for detected city
        document.getElementById("favBtn").onclick = () => {
            Storage.saveFavorite(currentCity);
            renderFavorites();
        };
    }, (error) => {
        alert("Location access denied. Loading default city.");
        loadByCity("Mumbai"); // fallback default
    });
}

// Manual location detection button
document.getElementById("locationBtn").onclick = detectLocation;


/* Auto-detect location on load */
loadByLocation();
renderFavorites();
detectLocation();