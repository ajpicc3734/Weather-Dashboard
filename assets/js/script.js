const dateEl = document.getElementById("date");
const locationEl = document.getElementById("location");
const upcomingForecastEl = document.getElementById("upcoming-forecast");
const todayTempEl = document.getElementById("today-temp");
const todayHumidityEl = document.getElementById("today-humidity");
const windSpeedEl = document.getElementById("wind-speed");
const uviEl = document.getElementById("uvi");
const form = document.querySelector(".city-search");
const iconEl = document.getElementById("icon");
const cityName = document.getElementById("city-name");

const apiKey = "f98e9c61cb0dfbcb590f9f03dd93bd6b";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  var inputVal = document.getElementById("search-value").value;
  cityName.textContent = inputVal;
  console.log(inputVal);

  var geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${inputVal},US&limit=5&appid=${apiKey}`;

  fetch(geoApi)
    .then((response) => response.json())
    .then((data) => {
      // showData(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      console.group(lat, lon);
      getWeatherData(lat, lon);
    });
});

dateSet = function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  dateEl.innerText = today;
};

dateSet();

var getWeatherData = function (lat, lon) {
  // navigator.geolocation.getCurrentPosition((success) => {
  //   console.log(success);
  // });
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly&units=imperial&appid=" +
    apiKey +
    " ";
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      showData(data);
      console.log(data);
    });

  // fetch(apiUrl)
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
};
// getWeatherData();

function showData(data) {
  let { humidity, temp, wind_speed, uvi } = data.current;

  todayTempEl.textContent = temp.toFixed(0);
  todayHumidityEl.textContent = humidity;
  windSpeedEl.textContent = wind_speed.toFixed(0);
  uviEl.textContent = uvi.toFixed(0);

  uviBackground = function () {
    if (uvi >= 9) {
      uviEl.style.backgroundColor = "#f22011";
    } else if (uvi <= 8 && uvi >= 4) {
      uviEl.style.backgroundColor = "#e6d40e";
    } else if (uvi <= 3) {
      uviEl.style.backgroundcolor = "#19941f";
    }
  };
  uviBackground();

  console.log(data.current);

  var forecastEl = document.getElementsByClassName("forecast");
  forecastEl[0].classList.add("loaded");

  var upcomingForecast = "";
  data.daily.forEach((value, index) => {
    if (index > 0) {
      var dayname = new Date(value.dt * 1000).toLocaleDateString("en", {
        weekday: "long",
      });
      console.log(value);

      var iconId = value.weather[0].icon;
      var sourceLink = `http://openweathermap.org/img/wn/${iconId}.png`;
      var temp = value.temp.day.toFixed(0);
      var humidity = value.humidity;
      var windSpeed = value.wind_speed.toFixed(0);

      upcomingForecast = `<div class="forecast-day">
						<p>${dayname}</p>
						<img src=${sourceLink} alt=${value.weather[0].description}> 
						<div class="forecast-day--temp">Temp: ${temp}<sup>°C</sup></div>
            <div class="forecast-day--humidity">Humidity: ${humidity}</div>
            <div class="forecast-day--wind-speed">Wind Speed: ${windSpeed}</div>


					</div>`;
      forecastEl[0].insertAdjacentHTML("beforeend", upcomingForecast);
    }
  });
}
