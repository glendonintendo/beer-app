const searchButtonEl = document.getElementById("park-search");
const parkEl = document.getElementById("park-results");

const npsRootUrl = 'https://developer.nps.gov/api/v1/';
const npsApiKey = 'AvrC614SiERYcGihHMcufgAu8yxa1IhxRJGCthwY';

const searchButtonHandler = function(event) {
    event.preventDefault();
    
    let state = document.getElementById("state-dropdown").value;
    let activity = document.getElementById("activity-dropdown").value;

    getParks(state, activity)
        .then(data => {
            parkCardLinks(data);
        });
    // call Kale's function to populate the national parks to the page
}

const nationalParkHandler = function(event) {
    let element = event.target;
    
    // if event target doesn't have class of national park, return

    let parkCode = event.target.getAttribute("data-park-code");
    return getParkInfo(parkCode);
}

const getWeatherData = function(lat, lon) {
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
const displayWeatherData = function(data) {
    // loop over next five days
    for (let i=1; i <= 5; i++) {
        // create a card element for each day
        let weatherCard = document.createElement('div');
        weatherCard.classList('card weather-forecast day-' + i);
        // create a header for the date
        let cardHeader = document.createElement('h4');
        cardHeader.classList = 'forecast-date';
        let forecastDate = moment().add(i, 'days').format('MM/DD/YYYY');
        cardHeader.textContent = forecastDate;
        // add the weather icon
        let forecastImg = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';
        let forecastIcon = document.createElement('img');
        forecastIcon.setAttribute('src', forecastImg);
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
        // append the card to the modal
        parkModalEl.appendChild(weatherCard);
    }
};

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
}

const getParkInfo = function(parkCode) {
    return fetch(`${npsRootUrl}parks?parkCode=${parkCode}&api_key=${npsApiKey}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })
}

const createParkModal = function(data) {

}

searchButtonEl.addEventListener("click", searchButtonHandler);

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
        let parkImg = document.createElement('img')
        parkImg.setAttribute('src', data[i].images[0].url);
        parkImg.setAttribute('alt', data[i].images[0].altText);
        // append to card
        parkLink.appendChild(parkImg);
        // add a description for the park
        let parkDescription = document.createElement('p');
        parkDescription.classList = 'park-descripton';
        parkDescription.textContent = data[i].description;
        // append to card
        parkLink.appendChild(parkDescription);
        parkEl.appendChild(parkLink);
    }
}