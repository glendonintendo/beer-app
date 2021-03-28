$(document).foundation();

const searchButtonEl = document.getElementById("park-search");
const parkEl = document.getElementById("park-results");
const parkModalEl = document.getElementById("park-modal");

const npsRootUrl = 'https://developer.nps.gov/api/v1/';
const npsApiKey = 'AvrC614SiERYcGihHMcufgAu8yxa1IhxRJGCthwY';

const searchButtonHandler = function(event) {
    event.preventDefault();
    
    clearParkEl();

    let state = document.getElementById("state-dropdown").value;
    let activity = document.getElementById("activity-dropdown").value;

    getParks(state, activity)
        .then(data => {
            parkCardLinks(data);
        });
};

const nationalParkHandler = function(event) {
    clearParkModalEl();
        
    let parkCode = event.target.getAttribute("data-park-code");
    
    getParkInfo(parkCode)
        .then(data => createModalContent(data));
};

const getWeatherData = function(lat, lon) {
    // format the api url
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=459a5e31598a1077257e521e66bb2960"

    return fetch(weatherApiUrl)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })
        .then(data => data);
};

// function to display all of the weather data on the page
const displayWeatherData = function(data) {

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

const getParks = function(state, activity) {
    let endpoint = '';
    if (state) {
        endpoint += `stateCode=${state}&`;
    }
    
    let parkUrl = `${npsRootUrl}parks?${endpoint}limit=500&api_key=${npsApiKey}`;

    return fetch(parkUrl)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })            
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
            return parks;
        });   
};

const getParkInfo = function(parkCode) {
    return fetch(`${npsRootUrl}parks?parkCode=${parkCode}&api_key=${npsApiKey}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        });
};

const createModalContent = function(data) {
    const selectedPark = data.data[0];
    parkModalEl.innerHTML = `
        <img src="${selectedPark.images[0].url}" alt="${selectedPark.images[0].altText}" data-park-code="${selectedPark.parkCode}" />
        <h4 class="park-header" data-park-code="${selectedPark.parkCode}">${selectedPark.name}</h4>
        <p class="park-description" data-park-code="${selectedPark.parkCode}">${selectedPark.description}</p>
    `

    const lat = selectedPark.latitude;
    const lon = selectedPark.longitude;
    getWeatherData(lat, lon)
        .then(weatherData => {
            displayWeatherData(weatherData)
        })
};

const parkCardLinks = function(data) {
    // loop over the parks returned from search
    for (let i=0; i < data.length; i++) {
        // create a card for park info
        let parkLink = document.createElement('div');
        let parkCode = data[i].parkCode;
        parkLink.classList = "card row align-center park-card";
        parkLink.setAttribute("data-open", "park-modal");
        parkLink.setAttribute("data-park-code", parkCode);
        
        // populate park card with park content
        parkLink.innerHTML = `
            <div class="large-4 medium-4 columns">
                <img src="${data[i].images[0].url}" alt="${data[i].images[0].altText}" data-park-code="${parkCode}" />
            </div>
            <div class="large-8 medium-8 columns>
                <h4 class="park-header" data-park-code="${parkCode}">${data[i].name}</h4>
                <p class="park-description" data-park-code="${parkCode}">${data[i].description}</p>
            </div>
        `;
 
        parkLink.addEventListener("click", nationalParkHandler);
        parkEl.appendChild(parkLink);
    }
};

const clearParkEl = function() {
    parkEl.innerHTML = "";
};

const clearParkModalEl = function() {
    parkModalEl.innerHTML = "";
};

searchButtonEl.addEventListener("click", searchButtonHandler);

const getSun = function(lat, lon) {
    fetch("https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => console.log(data));
};