

let getWeatherData = function(lat, lon) {
    // format the api url
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=459a5e31598a1077257e521e66bb2960"

    fetch(weatherApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // send to function to create the html
                displayWeatherData(data);
            });
        }
    });
};

// function to display all of the weather data on the page
let displayWeatherData = function(data) {

    // retrieve temperature
    let currentTemp = data.current.temp;
    // lt element = $('<element>').addClass('current-temp').text('The current temperature is: ' + currenTemp + ' F');

    // retrieve humidity
    let currentHumidity = data.current.humidity;
    // let element = $('<element>').addClass('current-humudity').text('The current humidity is: ' + currentHumidity ' %');

    // retrieve wind speed
    let windSpeed = data.current.wind_speed;
    // let element = $('<element>').addClass('current-wind').text('The current wind speed is: ' + windSpeed + 'MPH');

    // retrieve uv index
    let currentUv = data.current.uvi;
    // let element = $('<element>').addClass('current-uv').text('The current UV index is: ' + currentUv);

}
