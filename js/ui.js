export class WeatherUI {
    constructor() {
        this.map = null;
        this.marker = null;
    }

    showCurrent(data, unit) {
    const symbol = unit === "metric" ? "°C" : "°F";

    const container = document.getElementById("currentWeather");
    container.innerHTML = `
        <div class="weather-card fade-in">
            <h2>${data.name}, ${data.sys.country}</h2>
            <h1>${Math.round(data.main.temp)}${symbol}</h1>
            <p>${data.weather[0].description}</p>
            <button id="favBtn">⭐ Add to Favorites</button>
        </div>
    `;
}
    showForecast(data, unit) {
    const symbol = unit === "metric" ? "°C" : "°F";

    const dailyData = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) dailyData[date] = item;
    });

    document.getElementById("forecast").innerHTML = `
        <h3>📅 5-Day Weather Forecast</h3>
        <div class="forecast-container slide-up">
            ${Object.values(dailyData).slice(0,5).map(d => {
                const dateObj = new Date(d.dt * 1000);
                return `
                    <div class="forecast-day">
                        <strong>${dateObj.toLocaleDateString("en-US", { weekday: "short" })}</strong><br>
                        <small>${dateObj.toLocaleDateString("en-US", { day: "numeric", month: "short" })}</small>
                        <i class="wi wi-owm-${d.weather[0].id}"></i>
                        <div>${Math.round(d.main.temp)}${symbol}</div>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}



    showAlerts(alerts) {
        const div = document.getElementById("alerts");
        div.innerHTML = "";

        if (!alerts || !alerts.alerts) return;

        alerts.alerts.forEach(a => {
            div.innerHTML += `
                <div class="alert-box">
                    <strong>${a.event}</strong>
                    <p>${a.description}</p>
                </div>
            `;
        });
    }

    updateMap(lat, lon) {
        if (!this.map) {
            this.map = L.map("map").setView([lat, lon], 8);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);
            this.marker = L.marker([lat, lon]).addTo(this.map);
        } else {
            this.map.setView([lat, lon], 8);
            this.marker.setLatLng([lat, lon]);
        }
    }


}