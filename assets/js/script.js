

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
const npsRootUrl = 'https://developer.nps.gov/api/v1/';
const npsApiKey = 'AvrC614SiERYcGihHMcufgAu8yxa1IhxRJGCthwY';

const getParks = function(state, activity) {
    let endpoint = '';
    if (state) {
        endpoint += `stateCode=${state}&`;
    }
    
    let parkUrl = `${npsRootUrl}parks?${endpoint}api_key=${npsApiKey}`;

    let parkData = fetch(parkUrl)
        .then(response => {
            if (response.ok) {
                return response.json()
                    .then(data => {
                        let parks = [... data.data];
                        if (activity) {
                            parks = parks.filter(park => {
                                for (let i = 0; i < park.activities.length; i++) {
                                    if (park.activities[i].name === activity) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                        }
                        console.log(parks);
                    });
            }
        })
    
    return parkData;
}

let parkCardLinks = function(data) {
    // loop over the parks that have been filtered
    for (let i=0; i < data.length; i++) {
        // create a card for park info
        let parkLink = document.createElement('div');
        let parkCode = data[i].parkCode;
        parkLink.classList = "card flex-row align-center" + parkCode;
        // create header for park name
        let parkName = document.createElement('h4');
        parkName.classList = "park-header";
        parkName.textContent = data[i].name;
        // append to card
        parkLink.appendChild(parkName);
        // add a picture for the park
        let parkImg = document.createElement('img');
        parkImg.innerHTML = 'src=' + data[i].images[0].url + 'alt=' data[i].images[0].altText;
        // append to card
        parkLink.appendChild(parkImg);
        // add a description for the park
        let parkDescription = document.createElement('p');
        parkDescription.classList = 'park-descripton';
        parkDescription.textContent = data[i].description;
        // append to card
        parkLink.appendChild(parkDescription);

        // now append everything to the main div
        parkResultsEl.appendChild(parkLink);
    }
};

console.log(getParks('TX', 'Camping'));
