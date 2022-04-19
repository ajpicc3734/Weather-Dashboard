const dateEl = document.getElementById("date");
const locationEl = document.getElementById("location");
const upcomingForecastEl = document.getElementById("forecast");
const todayTempEl = document.getElementById("today-temp");
const todayHumidityEl = document.getElementById("today-humidity");
const windSpeedEl = document.getElementById("wind-speed");
const uviEl = document.getElementById("uvi");
const form = document.querySelector(".city-search");
const iconEl = document.getElementById("icon");
var cityName = document.getElementById("city-name");
const pastSearch = document.getElementById("load-city");
var cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];

const apiKey = "f98e9c61cb0dfbcb590f9f03dd93bd6b";
//city search
form.addEventListener("submit", (e) => {
  e.preventDefault();
  var inputVal = document.getElementById("search-value").value;
  cityName.textContent = inputVal;

  //save and get city from local storage
  if (cityArray.indexOf(inputVal) === -1) {
    cityArray.push(inputVal);
  }

  localStorage.setItem("cityArray", JSON.stringify(cityArray));

  var loadCity = localStorage.getItem("cityArray");
  pastSearch.innerHTML = loadCity;

  console.log(inputVal);
  //get lat and lon by location
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
//set date
dateSet = function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  dateEl.innerText = today;
};

dateSet();

//function to retrieve weather data
var getWeatherData = function (lat, lon) {
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
};

//function to display weather data
function showData(data) {
  let { humidity, temp, wind_speed, uvi } = data.current;

  todayTempEl.textContent = temp.toFixed(0);
  todayHumidityEl.textContent = humidity;
  windSpeedEl.textContent = wind_speed.toFixed(0);
  uviEl.textContent = uvi.toFixed(0);

  // UVI background color
  uviBackground = function () {
    if (uvi >= 9) {
      uviEl.style.backgroundColor = "#f22011";
    } else if (uvi <= 8 && uvi >= 3) {
      uviEl.style.backgroundColor = "#e6d40e";
    } else {
      uviEl.style.backgroundcolor = "#19941f";
    }
  };
  uviBackground();

  console.log(data.current);
  // get and display future forecast
  var forecastEl = document.getElementById("forecast");
  forecastEl.classList.add("loaded");

  var upcomingForecast = "";
  data.daily.forEach((value, index) => {
    if (index > 0) {
      var date = new Date(value.dt * 1000).toLocaleDateString("en", {});
      console.log(value);

      var iconId = value.weather[0].icon;
      var sourceLink = `http://openweathermap.org/img/wn/${iconId}.png`;
      var temp = value.temp.day.toFixed(0);
      var humidity = value.humidity;
      var windSpeed = value.wind_speed.toFixed(0);

      var forecastDay = document.createElement("div");
      forecastDay.setAttribute("class", "upcoming-forecast");

      var pTag = document.createElement("p");
      pTag.textContent = date;
      var imgTag = document.createElement("img");
      imgTag.setAttribute("src", sourceLink);
      imgTag.setAttribute("alt", value.weather[0].description);
      var temperatureText = document.createElement("div");
      temperatureText.textContent = "Temp:";
      var temperature = document.createElement("div");
      temperature.textContent = temp;
      var humidityText = document.createElement("div");
      humidityText.textContent = "Humidity:";
      var humidityEl = document.createElement("div");
      humidityEl.textContent = humidity;
      var windText = document.createElement("div");
      windText.textContent = "Wind Speed:";
      windEl = document.createElement("div");
      windEl.textContent = windSpeed;

      forecastDay.appendChild(pTag);
      forecastDay.appendChild(imgTag);
      forecastDay.appendChild(temperatureText);
      forecastDay.appendChild(temperature);
      forecastDay.appendChild(humidityText);
      forecastDay.appendChild(humidityEl);
      forecastDay.appendChild(windText);
      forecastDay.appendChild(windEl);

      forecastEl.appendChild(forecastDay);
    }
  });
}
