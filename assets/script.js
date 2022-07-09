var searchButtonEl = document.querySelector('#search-button');
var cityInputEl = document.querySelector('#city-input');
var currentWeatherContainer =  document.querySelector('#currentWeather');
var forecastContainer = document.querySelector('#forecast');
var uviEl = document.querySelector('.uvi');

var buttonClickHandler = function(event) {
  event.preventDefault();

  var cityName = cityInputEl.value.trim();
  
  if (cityName) {
    getCoordinates(cityName);
    cityInputEl.textContent = "";
    cityName.value = ""; 
  }
  else {
    alert("Please enter a valid city.");
  }
}

var getCoordinates = function(cityName) {
  var cityCoordinates = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=48f443fa9cde74a0618217ac6ce872b9";

  fetch(cityCoordinates).then(function(response) {
    if(response.ok) {
      return response.json()
      }else {
      alert("Error. Cannot find coordinates");
    }
    }).then(function(data) {
      getTodayWeather(data)
    }).catch(function (error) {
    alert("unable to connect to API");
    console.log(error);
  });
};

var getTodayWeather = function(weatherData) {
  var cityLat = weatherData.coord.lat;
  var cityLong = weatherData.coord.lon;
  var cityName = weatherData.name;
  var todayWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=hourly,minutely&units=imperial&appid=48f443fa9cde74a0618217ac6ce872b9";

  fetch(todayWeather).then(function(response) {
    if(response.ok) {
      return response.json()
      }
      else {
      alert("Error. Cannot find coordinates");
    }
    }).then(function(data) {
      createCurrentWeather(data.current, cityName)
      console.log(data);
    }).catch(function (error) {
    alert("unable to connect to API");
    console.log(error);
  });
};

function createCurrentWeather(currentWeather, city){
var temp = currentWeather.temp;
var windSpeed = currentWeather.wind_speed;
var humidity = currentWeather.humidity;
var uvIndex = currentWeather.uvi;
var unixDate = currentWeather.dt;
var formattedDate = new Date(unixDate * 1000).toLocaleDateString("en-US");
var icon = 'https://openweathermap.org/img/w/'+ currentWeather.weather[0].icon+'.png';

var card = document.createElement('div');
var cardBody = document.createElement('div');
var cardTitle = document.createElement('h2');
var tempEl = document.createElement('p');
var windEl = document.createElement('p');
var humidEl = document.createElement('p');
var uviEl = document.createElement('p');
var imgEl = document.createElement('img');

card.setAttribute('class', 'card');
cardBody.setAttribute('class', 'card-body');
card.append(cardBody);

cardTitle.setAttribute('class', 'card-title');
tempEl.setAttribute('class', 'card-text');
windEl.setAttribute('class', 'card-text');
humidEl.setAttribute('class', 'card-text');
uviEl.setAttribute('class', 'card-text uvi');

cardTitle.textContent = city + " " + formattedDate;
imgEl.setAttribute('src', icon);
cardTitle.append(imgEl);

tempEl.textContent = 'Temp: ' + temp + " °F";
windEl.textContent = 'Wind: ' + windSpeed + " MPH";
humidEl.textContent = 'Humidity: ' + humidity + "%"; 
uviEl.textContent = 'UV Index: ' + uvIndex;

cardBody.append(cardTitle, tempEl, windEl, humidEl, uviEl);

currentWeatherContainer.innerHTML = '';
currentWeatherContainer.append(card);
};

searchButtonEl.addEventListener("click", buttonClickHandler);