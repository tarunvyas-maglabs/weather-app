import "./styles.css";

const form = document.querySelector("form");
const cityInput = document.getElementById("search-city");
const searchResultDiv = document.querySelector(".search-result");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    cityInput.setCustomValidity("");
    const valid = checkValidity();

    if(!valid){
        form.reportValidity();
        return;
    }
    const city = cityInput.value;

    getWeatherData(city).then((response) => displayInfo(response)).catch(() => {
        searchResultDiv.textContent = "";
        alert("No matches found");
    });
    cityInput.value = "";
})

function displayInfo({cityName, condition, temperature, humidity, windSpeed, unit}){
    searchResultDiv.textContent = "";
    const card = document.createElement("div");
    card.classList.add("card");
    const name = document.createElement("h1");
    const cond = document.createElement("h1");
    const temp = document.createElement("h1");
    const hum = document.createElement("h1");
    const ws = document.createElement("h1");
    const button = document.createElement("button");
    button.classList.add("toggle-unit");
    button.textContent = `Change to ${(unit === "us") ? "C" : "F"}`;
    button.addEventListener("click", () => toggleUnit(cityName, (unit === "us") ? "uk" : "us"));

    name.textContent = `City: ${cityName}`;
    cond.textContent = `Condition: ${condition}`;
    temp.textContent = `Temperature: ${temperature} ${(unit === "us") ? "F" : "C"}`;
    hum.textContent = `Humidity: ${humidity}`;
    ws.textContent = `Wind Speed: ${windSpeed}`;

    card.append(name, cond, temp, hum, ws);
    searchResultDiv.append(card, button);
}

function toggleUnit(city, unit){
    const data = getWeatherData(city, unit);
    data.then((info) => displayInfo(info));
}

function checkValidity() {
    let valid = true;
    const city = cityInput.value;
    if(!city) {
        cityInput.setCustomValidity("Enter a city");
        valid = false;
    } else if(/\d/.test(city)){
        cityInput.setCustomValidity("Invalid city");
        valid = false;
    }
    return valid;
}

async function getWeatherData(city = "london", unit = "us") {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=H9UGCTDWFS8RBD668RLE7B4MS`);
    if(!response.ok) {
        throw new Error(response.status());
    }
    const data = await response.json();
    return {
        cityName: data.resolvedAddress,
        condition: data.currentConditions.conditions,
        temperature: data.currentConditions.temp,
        humidity: data.currentConditions.humidity,
        windSpeed: data.currentConditions.windspeed,
        unit
    }
}
