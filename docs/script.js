//API Key: https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=c53f64d488e1a3a434d5df4073ee05e5

// API Call: api.openweathermap.org/data/2.5/weather?q={city name}&appid={c53f64d488e1a3a434d5df4073ee05e5}

// Global Variables
var getToday = document.querySelector("#today");
var momentToday = moment().format("[Today is] dddd, MMMM Do");

//Display Today
// // Current Day and Time with Moment.js
getToday.innerHTML = momentToday;