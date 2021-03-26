

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