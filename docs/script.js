// API Example: https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=c53f64d488e1a3a434d5df4073ee05e5
// API Call: api.openweathermap.org/data/2.5/weather?q={city name}&appid={c53f64d488e1a3a434d5df4073ee05e5}

// ----- Global Variables ----- //
var getToday = document.querySelector("#today");
var momentToday = moment().format("[Today is] dddd, MMMM Do");
var cityName = $("#user-input");
var citySearchedArray = [];
var tempF = document.querySelector("#temperature");
var hum = document.querySelector("#humidity");
var wind = document.querySelector("#wind-speed");
var uvIndex = document.querySelector("#uv-index");
var currentCity = document.querySelector("#selected-city");
var currentCountry = document.querySelector("#selected-state");
var currentWeatherIconUrl = "";
var currentWeatherIconCode = "";
var iconUrl = "";
var iconCode = "";
var forecastDate = "";
var forecastTemp = "";
var forecastHum = "";
var storedCities = "";

// API Info and Getting From Local Storage
var APIKey = "c53f64d488e1a3a434d5df4073ee05e5";
var getCitiesFromLocal = JSON.parse(localStorage.getItem("searched-cities"));
if (getCitiesFromLocal !== null) {
    getCitiesFromLocal.forEach(function (city) {
        city.toUpperCase();
    });
    citySearchedArray = getCitiesFromLocal;
}

// ----- Functions ----- //

//Function to Generate Weather Information
function generateWeatherInfo() {
    var cityNameValue = cityName.val().trim();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityNameValue + "&appid=" + APIKey;
    //  AJAX call to the OpenWeatherAPI
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        currentCity.innerHTML = response.name;
        currentCountry.innerHTML = response.sys.country;
        var currentWeatherIconEl = $("<img>").attr("src", currentWeatherIconUrl);
        //Stupid icon doesn't work yet BUGGIE
        // $('.card-body').appendChild(currentWeatherIconEl);
        currentWeatherIconCode = response.weather[0].icon;
        currentWeatherIconUrl = "https://openweathermap.org/img/w/" + currentWeatherIconCode + ".png";
        tempF.innerHTML = "Temperature: " + Math.round((((response.main.temp) - 273.15) * 9 / 5) + 32) + "°F / " + Math.round((response.main.temp) - 273.15) + "°C";
        hum.innerHTML = "Humidity: " + response.main.humidity + "%";
        wind.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
        $.ajax({
            url: uvIndexQueryUrl,
            method: "GET"
        })
            .then(function (response) {
                uvIndex.innerHTML = "UV Index: " + response.value;
                clearUV();
                if (response.value < 3) {
                    $("#uv-color").addClass("green");
                } else if (response.value > 2 && response.value < 6) {
                    $("#uv-color").addClass("yellow");
                } else if (response.value > 5 && response.value < 8) {
                    $("#uv-color").addClass("orange");
                } else if (response.value > 7 && response.value < 11) {
                    $("#uv-color").addClass("red");
                } else {
                    $("#uv-color").addClass("purple");
                }
            });
    })
}
//Functions to Generate Five Day Forecast as cards
function displayFiveDayForecast() {
    var fiveDayDiv = $("#forecast-card-div");
    var cardEl = $("<div class='card'>").addClass("forecast-card col-2 text-light");
    var iconEl = $("<img>").attr("src", iconUrl);
    var cardTitleDate = $("<h5>").text(forecastDate);
    var cardTextDiv = $("<div>");
    var cardTempElHigh = $("<p>").text(forecastTempH);
    var cardTempElLow = $("<p>").text(forecastTempL);
    var cardHumEl = $("<p>").text(forecastHum);
    cardTextDiv.append(cardTitleDate);
    cardTextDiv.append(cardTempElHigh);
    cardTextDiv.append(cardTempElLow);
    cardTextDiv.append(cardHumEl);
    cardTextDiv.append(iconEl);
    fiveDayDiv.append(cardEl);
    cardEl.append(cardTextDiv);
}
function generateFiveDayForecast() {
    var cityNameNew = cityName.val().trim();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityNameNew + "&appid=" + APIKey;
    //  AJAX call to the OpenWeatherAPI Forecast Info
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var fiveDayQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?&appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
        $.when($.ajax({
            url: fiveDayQueryUrl,
            method: "GET"
        }))
            .then(function (response) {
                for (var i = 0; i < 5; i++) {
                    iconCode = response.daily[i].weather[0].icon;
                    iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    forecastDate = moment().add(i, "days").format("MMMM DD YYYY");
                    forecastTempH = "H: " + Math.round((((response.daily[i].temp.max) - 273.15) * 9 / 5) + 32) + "°F / " + Math.round((response.daily[i].temp.max) - 273.15) + "°C";
                    forecastTempL = "L: " + Math.round((((response.daily[i].temp.min) - 273.15) * 9 / 5) + 32) + "°F / " + Math.round((response.daily[i].temp.min) - 273.15) + "°C";
                    forecastHum = "Humidity: " + response.daily[i].humidity + "%"
                    displayFiveDayForecast();
                }
            });
    }
    )
}
//Function to save city to local storage and as button
function saveCityAndButtonToLocal() {
    $(".city-buttons").empty();
    for (var i = 0; i < citySearchedArray.length; i++) {
    var newButton = $("<button>");
    var newButtonListItem = $("<li>");
    newButton.addClass("btn btn-dark");
    newButton.text(citySearchedArray[i]);
    $(".city-buttons").prepend(newButtonListItem);
    newButtonListItem.prepend(newButton);
    localStorage.setItem(storedCities, JSON.stringify(citySearchedArray));
}
};
//Functions to clear previously created
function clearDisplay() {
    $("#forecast-card-div").empty();
}
function clearUV() {
    $("#uv-color").removeClass();
}
//Function to display cities
function displayCities() {
    localStorage.getItem(storedCities, JSON.parse(citySearchedArray));
    console.log(citySearchedArray);
}

//Display Today
getToday.innerHTML = momentToday;
//On load, hide empty divs
$(document).ready(function () {
    $(".card-body").hide();
    $(".column-right").hide();
    displayCities(citySearchedArray);
    if (getCitiesFromLocal !== null) {
        var last = citySearchedArray[0];
        generateWeatherInfo(last);
    }
});
// On clicking search button
$(document).on("click", "#search-button", function () {
    //clearing previous stuff
    clearDisplay();
    // unhide divs
    $(".card-body").show();
    $(".column-right").show();
    // Generate weather info
    generateWeatherInfo();
    //Call five day forecast
    generateFiveDayForecast();
    // Commit city to local storage as button
    citySearchedArray.push(cityName.val().trim().toUpperCase());
    saveCityAndButtonToLocal();
}
);
//On clicking created buttons (not fully working)
$(document).on("click", ".city-buttons", function () {
    clearDisplay();
    clearUV();
    var clickCity = $(this).text();
    generateWeatherInfo(clickCity);
})