$(document).foundation();

// global variables for targeted elements in html
const searchButtonEl = document.getElementById("park-search");
const parkEl = document.getElementById("park-results");
const parkModalEl = document.getElementById("park-modal");

// global variables for root urls and api keys of apis
const npsRootUrl = "https://developer.nps.gov/api/v1/";
const npsApiKey = "AvrC614SiERYcGihHMcufgAu8yxa1IhxRJGCthwY";
const weatherRootUrl = "https://api.openweathermap.org/data/2.5/";
const weatherApiKey = "d3a330e6929f9f784d6290a5c6be1892";

// parks previously clicked on and saved to localStorage
const savedParks = JSON.parse(localStorage.getItem("savedParks")) || {};

/**
 * handler function for search button on click
 * 1. store values of search params 
 * 2. validate the search params; unhide error modal and stop execution of search if no params selected
 * 3. call clearParkEl to clear parks div from previous search
 * 4. call getParks to get queried parks
 * 5. call generateParkCards to populate parks to parks div
 * 6. store the park data in local storage
 */
const searchButtonHandler = function(event) {
    event.preventDefault();

    const state = document.getElementById("state-dropdown").value;
    const activity = document.getElementById("activity-dropdown").value;
    const topic = document.getElementById("topic-dropdown").value;
    if (!state) {
        $("#search-error").foundation("open");
        return;
    }

    getParks(state, activity, topic)
        .then(data => {
            if (data.length === 0) {
                $('#no-results-error').foundation("open");
                return;
            }
            parkEl.innerHTML = "";
            const parkStorage = {};
            data.forEach(park => {
                const parkValue = {
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
                    parkCode: park.parkCode,
                    topics: park.topics,
                    url: park.url
                };
                parkStorage[park.parkCode] = parkValue;
            })
            localStorage.setItem("parkStorage", JSON.stringify(parkStorage));
            generateParkCards(parkStorage);
        });
};

/**
 * helper function for national park service api call
 * 1. create api endpoint from state input
 * 2. fetch api call using created url
 * 3. filter parks by activity input
 * 
 * @param {string} state input state from state dropdown menu
 * @param {string} activity input activity from activity dropdown menu
 * @return {object} parks array from national parks service api call
 */
 const getParks = function(state, activity, topic) {
    let stateCodeQuery = "";
    if (state) {
        stateCodeQuery += `stateCode=${state}&`;
    }
    
    const parkUrl = `${npsRootUrl}parks?${stateCodeQuery}limit=500&api_key=${npsApiKey}`;

    return fetch(parkUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })            
        .then(data => {
            let parks = [... data.data];
            
            // filter parks by activity, if user entered activity in search
            if (activity) {
                parks = parks.filter(park => park.activities.some(activityObj => activityObj.name === activity));
            }

            // filter parks by topic, if user entered topic in search
            if (topic) {
                parks = parks.filter(park => park.topics.some(topicObj => topicObj.name === topic));
            }

            return parks;
        });   
};

/**
 * helper function to create park cards and append park cards to parks div
 * 
 * @param {object} parks object of saved parks
 * @return {undefined}
 */
const generateParkCards = function(parks) {
    // create a card for park info
    for (park in parks) {
        const parkLink = document.createElement("div");
        parkLink.classList = "card row align-center park-card";
        parkLink.setAttribute("data-open", "park-modal");
        parkLink.setAttribute("data-park-code", parks[park].parkCode);
        
        // populate park card with park content
        parkLink.innerHTML = `
            <div class="large-4 medium-4 columns img-holder" data-park-code="${parks[park].parkCode}">
                <img class="img" src="${(parks[park].images[0]) ? parks[park].images[0].url : "./assets/images/no-image-available.png"}" alt="${(parks[park].images[0]) ? parks[park].images[0].altText : ""}" data-park-code="${parks[park].parkCode}" />
            </div>
            <div class="large-8 medium-8 columns park-info-holder" data-park-code="${parks[park].parkCode}">
                <h4 class="park-header" data-park-code="${parks[park].parkCode}">${parks[park].fullName}</h4>
                <p class="park-description" data-park-code="${parks[park].parkCode}">${parks[park].description}</p>
            </div>
        `;
        
        // add onclick to card that calls nationalParkHandler to create content and display it in park modal
        parkLink.addEventListener("click", nationalParkHandler);

        // append park card to park div
        parkEl.appendChild(parkLink);
    }
};

/**
 * handler function for national park card on click
 * 1. clear parkModalEl of content
 * 2. get park code from card stored in data-park-code attribute
 * 3. get park data from saved parks or getParkInfo call if park not in saved parks
 * 4. set park data to savedParks and add savedParks to localStorage
 * 5. call getWeatherData passing in latitude and longitude from parkInfo to get weather data
 * 6. call generateWeatherCards to populate weather information to park modal
 * 
 * @param {object} event event object created from park card onclick
 * @return {undefined}
 */
const nationalParkHandler = function(event) {
    event.preventDefault();

    parkModalEl.innerHTML = "";
        
    const parkCode = event.target.getAttribute("data-park-code");
    const parkInfo = savedParks[parkCode] || getParkInfo(parkCode);
    generateParkModalContent(parkInfo);
    
    savedParks[parkCode] = parkInfo;
    localStorage.setItem('savedParks', JSON.stringify(savedParks));
      
    const lat = parkInfo.latitude;
    const lon = parkInfo.longitude;
    getWeatherData(lat, lon)
        .then(weatherData => generateWeatherCards(weatherData));
};

/**
 * helper function to get information about parks stored in LocalStorage
 * 
 * @param {string} parkCode unique park indentifier
 * @return {object} park data object
 */
const getParkInfo = function(parkCode) {
    const parksData = JSON.parse(localStorage.getItem("parkStorage"));
    return parksData[parkCode];
};

/**
 * helper function to create park information for park modal
 * 
 * @param {object} parkData park data object
 * @return {undefined}
 */
const generateParkModalContent = function(parkData) {
    parkModalEl.innerHTML = `
        <img src="${(parkData.images[0]) ? parkData.images[0].url : "./assets/images/no-image-available.png"}" alt="${(parkData.images[0]) ? parkData.images[0].altText : ""}" />
        <h4 class="park-header">${parkData.fullName}</h4>
        <p class="park-description">${parkData.description}</p>
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
};

/**
 * helper function for open weather api call
 * 1. create api endpoint from latitude and longitude
 * 2. fetch api call using created url
 * 
 * @param {number} lat latitude of location
 * @param {number} lon longitude of location
 * @return {object} weather data object
 */
const getWeatherData = function(lat, lon) {
    const weatherApiUrl = `${weatherRootUrl}onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

    return fetch(weatherApiUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
};

/**
 * helper function to create weather cards and append weather cards to park modal
 * 
 * @param {object} data weather data
 * @return {undefined}
 */
const generateWeatherCards = function(data) {
    for (let i = 1; i <= 5; i++) {
        const weatherCard = document.createElement("div");
        weatherCard.classList = "card weather-forecast day-" + i;
        weatherCard.innerHTML = `
            <h4 class="forecast-date">${moment().add(i, "days").format("MM/DD/YYYY")}</h4>
            <img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" />
            <ul class="weather-info">
                <li class="forecast-temp">Temperature: ${data.daily[i].temp.day} \u00B0F</li>
                <li class="forecast-humidity">Humidity: ${data.daily[i].humidity}%</li>
                <li class="forecast-uvi">UV Index: ${data.daily[i].uvi}</li>
            </ul>
        `;     

        parkModalEl.appendChild(weatherCard);
    }
};

/**
 * handler function to create dashboard from savedParks on webpage load
 * 
 * @param {object} savedParks park data object
 * @return {undefined}
 */
const savedParksDashBoardHandler = function(savedParks) {
    if (Object.keys(savedParks).length === 0) {
        return;
    }

    // create elements for the saved parks
    const savedParkEl = document.createElement('div');
    savedParkEl.classList = 'park-dashboard';
    savedParkEl.innerHTML = "<h3 class='saved-parks'><strong>Previously Visited Parks<strong></h3>";
    parkEl.appendChild(savedParkEl);

    generateParkCards(savedParks);
};

searchButtonEl.addEventListener("click", searchButtonHandler);
window.addEventListener("load", savedParksDashBoardHandler(savedParks));