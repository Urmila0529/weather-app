import { CONFIG } from "./config.js";

export class WeatherService {

    async getCurrentByCity(city, unit) {
        const res = await fetch(
            `${CONFIG.BASE_URL}/weather?q=${city}&appid=${CONFIG.API_KEY}&units=${unit}`
        );
        return res.json();
    }

    async getForecastByCity(city, unit) {
        const res = await fetch(
            `${CONFIG.BASE_URL}/forecast?q=${city}&appid=${CONFIG.API_KEY}&units=${unit}`
        );
        return res.json();
    }

    async getCurrentByCoords(lat, lon, unit) {
        const res = await fetch(
            `${CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${unit}`
        );
        return res.json();
    }

    async getForecastByCoords(lat, lon, unit) {
        const res = await fetch(
            `${CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${unit}`
        );
        return res.json();
    }

    async getAlerts(lat, lon) {
        const res = await fetch(
            `${CONFIG.ONECALL_URL}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`
        );
        return res.json();
    }
}
