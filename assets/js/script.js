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

    console.log(state, activity)

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
    // loop over next five days
    for (let i=1; i <= 5; i++) {
        // create a card element for each day
        let weatherCard = document.createElement('div');
        weatherCard.classList = 'card weather-forecast day-' + i;
        // create a header for the date
        let cardHeader = document.createElement('h4');
        cardHeader.classList = 'forecast-date';
        let forecastDate = moment().add(i, 'days').format('MM/DD/YYYY');
        cardHeader.textContent = forecastDate;
        // append to container
        weatherCard.appendChild(cardHeader);
        // add the weather icon
        let forecastImg = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';
        let forecastIcon = document.createElement('img');
        forecastIcon.setAttribute('src', forecastImg);
        // append to container
        weatherCard.appendChild(forecastIcon);
        // create an unordered list to add weather items
        let weatherInfo = document.createElement('ul');
        weatherInfo.classList = 'weather-info';
        // create a temperature item
        let forecastTemp = document.createElement('li');
        forecastTemp.classList = 'forecast-temp';
        forecastTemp.textContent = data.daily[i].temp.day + ' \u00B0F';
        // append to the list
        weatherInfo.appendChild(forecastTemp);
        // create a humidity item
        let forecastHumidity = document.createElement('li');
        forecastHumidity.classList = 'forecast-humidity';
        forecastHumidity.textContent = data.daily[i].humidity + '%';
        // append to the list
        weatherInfo.appendChild(forecastHumidity);
        // create a uv element
        let forecastUvi = document.createElement('li');
        forecastUvi.classList = 'forecast-uvi';
        forecastUvi.textContent = data.daily[i].uvi;
        // append to the list
        weatherInfo.appendChild(forecastUvi);

        // append the list to the card
        weatherCard.appendChild(weatherInfo);
        // append the card to the modalgit
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
            console.log(parks);
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
            displayWeatherData(weatherData);
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