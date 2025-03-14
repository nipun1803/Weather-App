const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const icon = document.querySelector(".weather-icon");
const tempUnitToggle = document.querySelector(".temp-toggle"); 


async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=5136f7cf1e789e65092ce1b3d4267528`);
        const data = await response.json();

        if (data.cod === "404") {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
        } else {
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
            const localTime = new Date((data.dt + data.timezone) * 1000);
            document.querySelector(".datetime").innerHTML = localTime.toLocaleString();
            changeBackground(data.weather[0].main);
            updateWeatherIcon(data.weather[0].main);
            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.querySelector(".error").innerHTML = "Network error. Please try again.";
        document.querySelector(".error").style.display = "block";
    }
}

function changeBackground(weather) {
    const body = document.body;
    if (weather.includes("Clear")) {
        body.style.background = "linear-gradient(135deg, #ff9800, #ff5722)";
    } else if (weather.includes("Clouds")) {
        body.style.background = "linear-gradient(135deg, #78909c, #37474f)";
    } else if (weather.includes("Rain") || weather.includes("Drizzle")) {
        body.style.background = "linear-gradient(135deg, #607d8b, #455a64)";
    } else if (weather.includes("Snow")) {
        body.style.background = "linear-gradient(135deg, #e0f7fa, #80deea)";
    } else {
        body.style.background = "linear-gradient(135deg, #00feba, #5b548a)";
    }
}


function updateWeatherIcon(weather) {
    let weatherCondition = weather.toLowerCase(); 

    console.log("Weather Condition:", weatherCondition); 

    if (weatherCondition.includes("cloud")) {
        icon.src = "images/clouds.png";
    } else if (weatherCondition.includes("rain")) {
        icon.src = "images/rain.png"; 
    } else if (weatherCondition.includes("drizzle")) {
        icon.src = "images/drizzle.png";
    } else if (weatherCondition.includes("mist")) {
        icon.src = "images/mist.png";
    } else if (weatherCondition.includes("clear")) {
        icon.src = "images/clear.png";
    } else {
        icon.src = "images/rain.png"; 
    }
}


function toggleTemperature() {
    let tempText = document.querySelector(".temp").innerText;
    let tempValue = parseInt(tempText);
    if (tempText.includes("°C")) {
        let fahrenheit = Math.round((tempValue * 9) / 5 + 32);
        document.querySelector(".temp").innerText = fahrenheit + "°F";
    } else {
        let celsius = Math.round(((tempValue - 32) * 5) / 9);
        document.querySelector(".temp").innerText = celsius + "°C";
    }
}


async function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=5136f7cf1e789e65092ce1b3d4267528`
            );
            const data = await response.json();
            checkWeather(data.name);
        }, () => {
            console.error("Geolocation permission denied or unavailable.");
            alert("Geolocation is not enabled. Please search manually.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});


searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});


tempUnitToggle.addEventListener("click", toggleTemperature);

getUserLocation();