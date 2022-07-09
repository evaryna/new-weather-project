function formatDate() {
  let now = new Date();

  let date = document.querySelector("#date");

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  let currentDay = days[now.getDay()];
  let currentMonth = months[now.getMonth()];
  let currentDate = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  date.innerHTML = `${currentDay}, ${currentDate} ${currentMonth} ${hours}:${minutes}`;
}
formatDate();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showForecast(response) {
  let forecastData = response.data.daily;

  let forecast = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row forecast-week">`;

  forecastData.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 forecast-days">
              <div class="weather-forecast-day">
                ${formatDay(forecastDay.dt)}</div>
                
                <img
                  src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  width="70"
                />
                <span id="temp-max">${Math.round(forecastDay.temp.max)}°</span>
                <span id="temp-min">${Math.round(forecastDay.temp.min)}°</span>
              </div>
              `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "a891e6ecb8de24b57d2022631c614077";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  console.log(response);
  document.querySelector("#city").innerHTML = response.data.name;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  celsiusTemp = Math.round(response.data.main.temp);

  document.querySelector("#temp").innerHTML = celsiusTemp;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed * 3.6
  )} km/h`;

  getForecast(response.data.coord);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input");
  search(city.value);
}

function search(city) {
  let apiKey = "a891e6ecb8de24b57d2022631c614077";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function searchLocation(position) {
  let apiKey = "a891e6ecb8de24b57d2022631c614077";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function displayCurrentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("button");
currentLocationButton.addEventListener("click", displayCurrentCity);

function showFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  document.querySelector("#temp").innerHTML = Math.round(fahrenheitTemp);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#temp").innerHTML = celsiusTemp;
}

let celsiusTemp = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

search("Kyiv");
