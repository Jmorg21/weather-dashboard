let searchButtonEl = document.querySelector('#search-button');
let cityInputEl = document.querySelector('#city-input');
let searchHistoryContEl = document.querySelector("#search-history");
let searchHistoryListEl = document.querySelector("#search-history-list");
let currentWeatherContainer =  document.querySelector('#currentWeather');
let forecastContainer = document.querySelector('#forecast');
let uviEl = document.querySelector('.uvi');

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
    let cityLat = weatherData.coord.lat;
    let cityLong = weatherData.coord.lon;
    let cityName = weatherData.name;
    let todayWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=hourly,minutely&units=imperial&appid=48f443fa9cde74a0618217ac6ce872b9";

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
let temp = currentWeather.temp;
let windSpeed = currentWeather.wind_speed;
let humidity = currentWeather.humidity;
let uvIndex = currentWeather.uvi;
let unixDate = currentWeather.dt;
let formattedDate = new Date(unixDate * 1000).toLocaleDateString("en-US");
let icon = 'https://openweathermap.org/img/w/'+ currentWeather.weather[0].icon+'.png';

let card = document.createElement('div');
let cardBody = document.createElement('div');
let cardTitle = document.createElement('h2');
let tempEl = document.createElement('p');
let windEl = document.createElement('p');
let humidEl = document.createElement('p');
let uviEl = document.createElement('p');
let imgEl = document.createElement('img');

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


getFiveDay(city);
}

function getFiveDay(cityName) {

  var fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=48f443fa9cde74a0618217ac6ce872b9";

  fetch(fiveDayForecast).then(function(response) {
    if(response.ok) {
      return response.json()
      }
      else {
      alert("Error. No response from API.");
    }
    }).then(function(data) {
      createFiveDay(data, cityName);
      console.log(data);
    }).catch(function (error) {
      alert("unable to connect with API");
      console.log(error);
    });
  };

function createFiveDay(forecastData, cityName){
  for (var i = 0; i < forecastData.list.length; i = i + 8) {

    let date = forecastData.list[i].dt_txt;
    let splitDay = date.substring(8, 10);
    let splitMonth = date.substring(5, 7); 
    let splitYear = date.substring(2, 4); 
    let formattedDate = splitMonth + "/" + splitDay + "/" + splitYear; 
    let temp = forecastData.list[i].main.temp;
    let windSpeed = forecastData.list[i].wind.speed;
    let humidity = forecastData.list[i].main.humidity;
    let icon = 'https://openweathermap.org/img/w/' + forecastData.list[i].weather[0].icon + '.png';

    let card = document.createElement('div');
    let cardBody = document.createElement('div');
    let cardTitle = document.createElement('h4');
    let tempEl = document.createElement('p');
    let windEl = document.createElement('p');
    let humidEl = document.createElement('p');
    let imgEl = document.createElement('img');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card text-light bg-primary mx-2');
    card.append(cardBody);

    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidEl.setAttribute('class', 'card-text');

    cardTitle.textContent = formattedDate;
    imgEl.setAttribute('src', icon);
    cardTitle.append(imgEl);

    tempEl.textContent = 'Temp: ' + temp + " °F";
    windEl.textContent = 'Wind: ' + windSpeed + " MPH";
    humidEl.textContent = 'Humidity: ' + humidity + "%"; 

    cardBody.append(cardTitle, tempEl, windEl, humidEl);

    forecastContainer.append(card);
    };
};    

searchButtonEl.addEventListener("click", buttonClickHandler);