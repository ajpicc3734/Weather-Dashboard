const dateEl = document.getElementById("date");
const locationEl = document.getElementById("location");
const upcomingForecastEl = document.getElementById("upcoming-forecast");
const todayTempEl = document.getElementById("today-temp");
const todayHumidityEl = document.getElementById("today-humidity");
const windSpeedEl = document.getElementById("wind-speed");
const conditionsEl = document.getElementById("description");

const apiKey = "f98e9c61cb0dfbcb590f9f03dd93bd6b";

dateSet = function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  dateEl.innerText = today;
};

dateSet();

var getWeatherData = function () {
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);
  });
  // var apiUrl =
  //   "https://api.openweathermap.org/data/2.5/onecall?lat=40.30&lon=-74.77&exclude=minutely,hourly&units=imperial&appid=" +
  //   apiKey +
  //   " ";

  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=" +
    apiKey +
    " ";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => showData(data));

  // fetch(apiUrl)
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
};
getWeatherData();

function showData(data) {
  let { humidity, temp, wind_speed, uvi } = data.main;
  let { speed } = data.wind;
  let { description } = data.weather[0];

  todayTempEl.textContent = temp;
  todayHumidityEl.textContent = humidity;
  windSpeedEl.textContent = speed;
  conditionsEl.textContent = description;

  console.log(data);

  data.daily.forEach;
}
