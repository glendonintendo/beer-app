$(document).foundation();

const searchButtonEl = document.getElementById("park-search");
const parkEl = document.getElementById("park-results");
const parkModalEl = document.getElementById("park-modal");

const npsRootUrl = 'https://developer.nps.gov/api/v1/';
const npsApiKey = 'AvrC614SiERYcGihHMcufgAu8yxa1IhxRJGCthwY';

const searchButtonHandler = function(event) {
    event.preventDefault();

    let state = document.getElementById("state-dropdown").value;
    let activity = document.getElementById("activity-dropdown").value;

    if (!state && !activity) {
        $('#search-error').foundation('open');
        return;
    }

    clearParkEl();

    getParks(state, activity)
        .then(data => {
            parkCardLinks(data);
            let parkStorage = {};
            data.forEach(park => {
                let parkValue = {
                    activities: park.activities, 
                    addresses: park.addresses,
                    contacts: park.contacts,
                    description: park.description, 
                    directionsInfo: park.directionsInfo,
                    directionsUrl: park.directionsUrl,
                    fullName: park.fullName,
                    images: park.images,
                    name: park.name,
                    latitude: park.latitude,
                    longitude: park.longitude,
                    topics: park.topics,
                    url: park.url
                };
                parkStorage[park.parkCode] = parkValue;
            })
            localStorage.setItem("parkStorage", JSON.stringify(parkStorage));
        });
};

const nationalParkHandler = function(event) {
    clearParkModalEl();
        
    let parkCode = event.target.getAttribute("data-park-code");
    
    let parkInfo = getParkInfo(parkCode);
    createModalContent(parkInfo);
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
    // loop over next five days
    for (let i=1; i <= 5; i++) {
        let weatherCard = document.createElement('div');
        weatherCard.classList = 'card weather-forecast day-' + i;
        weatherCard.innerHTML = `
            <h4 class="forecast-date">${moment().add(i, 'days').format('MM/DD/YYYY')}</h4>
            <img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" />
            <ul class="weather-info">
                <li class="forecast-temp">Temperature: ${data.daily[i].temp.day} \u00B0F</li>
                <li class="forecast-humidity">Humidity: ${data.daily[i].humidity}%</li>
                <li class="forecast-uvi">UV Index: ${data.daily[i].uvi}</li>
            </ul>
        `      

        parkModalEl.appendChild(weatherCard);
    }
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
    let parksData = JSON.parse(localStorage.getItem("parkStorage"));
    return parksData[parkCode];
};

const createModalContent = function(parkData) {
    parkModalEl.innerHTML = `
        <img src="${parkData.images[0].url}" alt="${parkData.images[0].altText}" />
        <h4 class="park-header">${parkData.name}</h4>
        <p class="park-description">${parkData.description}</p>
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
    `

    const lat = parkData.latitude;
    const lon = parkData.longitude;
    getWeatherData(lat, lon)
        .then(weatherData => {
            displayWeatherData(weatherData);
        });
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
            <div class="large-4 medium-4 columns" data-park-code="${parkCode}">
                <img src="${data[i].images[0].url}" alt="${data[i].images[0].altText}" data-park-code="${parkCode}" />
            </div>
            <div class="large-8 medium-8 columns" data-park-code="${parkCode}">
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