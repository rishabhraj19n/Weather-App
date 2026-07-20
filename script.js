const apiKey = "bb2f081c82c34341918195335261607";


const searchBox = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const weatherIcon = document.querySelector("#weather-icon");
const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error-message");

async function checkWeather(city) {
    loading.style.visibility = "visible";
    errorMessage.style.visibility = "hidden";

    try {
        const url =
            `https://api.weatherapi.com/v1/current.json` +
            `?key=${apiKey}` +
            `&q=${encodeURIComponent(city)}` +
            `&aqi=no`;

        const response = await fetch(url);
        const data = await response.json();

        loading.style.visibility = "hidden";

        if (!response.ok || data.error) {
            errorMessage.textContent =
                data.error?.message || "City not found. Please check the spelling.";

            errorMessage.style.visibility = "visible";
            return;
        }

        document.querySelector("#city-name").textContent =
            data.location.name;

        document.querySelector("#temperature").textContent =
            `${Math.round(data.current.temp_c)}°C`;

        document.querySelector("#humidity").textContent =
            `${data.current.humidity}%`;

        document.querySelector("#wind-speed").textContent =
            `${data.current.wind_kph} km/h`;

        const conditionElement =
            document.querySelector("#weather-condition");

        if (conditionElement) {
            conditionElement.textContent =
                data.current.condition.text;
        }

        const condition =
            data.current.condition.text.toLowerCase();

        if (
            condition.includes("clear") ||
            condition.includes("sunny")
        ) {
            weatherIcon.src = "images/clear.png";
        } else if (condition.includes("drizzle")) {
            weatherIcon.src = "images/drizzle.png";
        } else if (
            condition.includes("rain") ||
            condition.includes("shower") ||
            condition.includes("thunder")
        ) {
            weatherIcon.src = "images/rain.png";
        } else if (
            condition.includes("snow") ||
            condition.includes("sleet") ||
            condition.includes("ice")
        ) {
            weatherIcon.src = "images/snow.png";
        } else {
            weatherIcon.src = "images/clouds.png";
        }

        weatherIcon.alt = data.current.condition.text;

    } catch (error) {
        loading.style.visibility = "hidden";
        errorMessage.style.visibility = "hidden";

        errorMessage.textContent =
            "Unable to fetch weather. Check your internet connection.";

        errorMessage.style.visibility = "visible";

        console.error(error);
    }
}

function searchWeather() {
    const city = searchBox.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        errorMessage.style.visibility = "visible";
        return;
    }

    checkWeather(city);
}

searchButton.addEventListener("click", searchWeather);

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});

// Default city
checkWeather("Noida");