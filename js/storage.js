export const Storage = {
   
    saveFavorite(city) {
        const favs = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!favs.includes(city)) {
            favs.push(city);
            localStorage.setItem("favorites", JSON.stringify(favs));
        }
    },
    getFavorites() {
        return JSON.parse(localStorage.getItem("favorites")) || [];
    },

    cacheWeather(key, data) {
        localStorage.setItem(key, JSON.stringify({
            data,
            time: Date.now()
        }));
    },

    getCachedWeather(key, maxAge = 600000) {
        const cached = JSON.parse(localStorage.getItem(key));
        if (!cached) return null;
        if (Date.now() - cached.time > maxAge) return null;
        return cached.data;
    }
};
