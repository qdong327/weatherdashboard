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
    // var response = $(this);
    cityName = cityName.val().trim();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName + "&appid=" + APIKey;
    console.log(queryURL);
    //  AJAX call to the OpenWeatherAPI
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        currentCity.innerHTML = response.name;
        currentCountry.innerHTML = response.sys.country;
        tempF.innerHTML = "Temperature: " + Math.round((((response.main.temp) - 273.15) * 9 / 5) + 32) + "°F / " + Math.round((response.main.temp) - 273.15) + "°C";
        hum.innerHTML = "Humidity: " + response.main.humidity + "%";
        wind.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
        console.log(uvIndexQueryUrl);
        $.ajax({
            url: uvIndexQueryUrl,
            method: "GET"
        })
            .then(function (response) {
                uvIndex.innerHTML = "UV Index: " + response.value;
                if (response.value < 10) {
                    $("p #uv-index").addClass("green");
                    console.log(uvIndex);
                }
                // } else if (response.value)
            });
    }
    )
}

//Function to Add UV Index Color
// function generateUVColor() {
// }

//Function to Generate Five Day Forecast as cards
function generateFiveDayForecast() {

};
//Function to save city to local storage and as button
function saveCityAndButtonToLocal() {

};


//Display Today
getToday.innerHTML = momentToday;

// On clicking search button
$(document).on("click", "#search-button", function () {
    // Generate weather info
    generateWeatherInfo();
    //Call five day forecast
    generateFiveDayForecast();
    // Commit city to local storage as button
    saveCityAndButtonToLocal();
}
);