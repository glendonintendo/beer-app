$(document).foundation();

// global variables for targeted elements in html
const searchButtonEl = document.getElementById("park-search");
const parkEl = document.getElementById("park-results");
const parkModalEl = document.getElementById("park-modal");

let savedParksArr = [];


// global variables for root urls and api keys of apis
const npsRootUrl = "https://developer.nps.gov/api/v1/";
const npsApiKey = "AvrC614SiERYcGihHMcufgAu8yxa1IhxRJGCthwY";
const weatherRootUrl = "https://api.openweathermap.org/data/2.5/";
const weatherApiKey = "459a5e31598a1077257e521e66bb2960";

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
    if (!state) {
        $("#search-error").foundation("open");
        return;
    }

    clearParkEl();

    getParks(state, activity)
        .then(data => {
            generateParkCards(data);
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
        });
};

const saveParks = function(clickedParks) {
    localStorage.setItem('clickedParks', JSON.stringify(clickedParks));
}

const parkDashboard = function() {
    let savedParks = JSON.parse(localStorage.getItem("clickedParks"));
    
    if (!savedParks) {
        return;
    }

    // create elements for the saved parks
    let savedParkEl = document.createElement('div');
    savedParkEl.classList = 'park-dashboard';

    savedParkEl.innerHTML = "<h3 class='saved-parks'><strong>Previously Visited Parks<strong></h3>";

    for (let i=0; i < savedParks.length; i++) {
        let savedParkCard = document.createElement('div');
        savedParkCard.classList = 'card row align-center clicked-parks';
        savedParkCard.setAttribute("data-park-code", savedParks[i].parkInfo.parkCode);
        savedParkCard.setAttribute("data-open", "park-modal");
        savedParkCard.style.backgroundImage = "url(" + savedParks[i].parkInfo.images[0].url + ")";
        let cardHeader = document.createElement('h4');
        let savedParkName = savedParks[i].parkInfo.fullName;
        cardHeader.textContent = savedParkName;
        cardHeader.setAttribute("data-park-code", savedParks[i].parkInfo.parkCode);
        savedParkCard.appendChild(cardHeader);

        let savedParkLat = savedParks[i].parkInfo.latitude;
        let savedParkLon = savedParks[i].parkInfo.longitude;
        
        getWeatherData(savedParkLat, savedParkLon)
            .then(weatherData => {
                let savedParkTemp = weatherData.current.temp;
                let savedParkWeatherIcon = weatherData.current.weather[0].icon
                
                let savedTempEl = document.createElement('ul');
                savedTempEl.classList = 'saved-park-elements';
                savedTempEl.innerHTML = `
                    <li class="saved-temp" data-park-code="${savedParks[i].parkInfo.parkCode}"> Today's Temperature: ${savedParkTemp} </li>
                    <img src="https://openweathermap.org/img/wn/${savedParkWeatherIcon}@2x.png" data-park-code="${savedParks[i].parkInfo.parkCode}"/>
                `
                savedTempEl.setAttribute("data-park-code", savedParks[i].parkInfo.parkCode);
                savedParkCard.appendChild(savedTempEl);
            });

        savedParkCard.addEventListener("click", previouslyVisitedHandler);
        savedParkEl.appendChild(savedParkCard);
    }

    parkEl.appendChild(savedParkEl);
}

/**
 * helper function to clear parks div content
 */
const clearParkEl = function() {
    parkEl.innerHTML = "";
};


/**
 * helper function for national park service api call
 * 1. receive state and activity from user input in search
 * 2. create api endpoint from state input
 * 3. fetch api call using created url
 * 4. filter parks by activity input
 * 5. return array of filtered parks
 */
 const getParks = function(state, activity) {
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
            // filter parks by if activity is available at park, if user entered activity in search
            if (activity) {
                parks = parks.filter(park => park.activities.some(activityObj => activityObj.name === activity));
            }
            return parks;
        });   
};

/**
 * helper function to create park cards and append park cards to parks div
 * 1. receive parks array
 * 2. create park card for each park in parks array
 * 3. append park cards to parks div
 */
const generateParkCards = function(data) {
    // loop over the parks returned from search
    data.forEach(park => {
        // create a card for park info
        const parkLink = document.createElement("div");
        parkLink.classList = "card row align-center park-card";
        parkLink.setAttribute("data-open", "park-modal");
        parkLink.setAttribute("data-park-code", park.parkCode);
        
        // populate park card with park content
        parkLink.innerHTML = `
            <div class="large-4 medium-4 columns img-holder" data-park-code="${park.parkCode}">
                <img class="img" src="${park.images[0].url}" alt="${park.images[0].altText}" data-park-code="${park.parkCode}" />
            </div>
            <div class="large-8 medium-8 columns park-info-holder" data-park-code="${park.parkCode}">
                <h4 class="park-header" data-park-code="${park.parkCode}">${park.name}</h4>
                <p class="park-description" data-park-code="${park.parkCode}">${park.description}</p>
            </div>
        `;
        
        // add onclick to card that calls nationalParkHandler to create content and display it in park modal
        parkLink.addEventListener("click", nationalParkHandler);

        // append park card to park div
        parkEl.appendChild(parkLink);
    });
};

/**
 * handler function for national park card on click
 * 1. call clearParkModalEl to clear contents of park modal
 * 2. get park code from card stored in data-park-code attribute
 * 3. call getParkInfo retrieve park information from localStorage
 * 4. call generateParkModalContent to populate park information to park modal and unhide modal
 * 5. call getWeatherData passing in latitude and longitude from parkInfo to get weather data
 * 6. call generateWeatherCards to populate weather information to park modal
 */
const nationalParkHandler = function(event) {
    event.preventDefault();

    clearParkModalEl();
        
    const parkCode = event.target.getAttribute("data-park-code");
    
    const parkInfo = getParkInfo(parkCode);
    generateParkModalContent(parkInfo);
    
    savedParksArr.push({parkInfo});
    saveParks(savedParksArr);
  
    const lat = parkInfo.latitude;
    const lon = parkInfo.longitude;
    getWeatherData(lat, lon)
        .then(weatherData => generateWeatherCards(weatherData));
};

/**
 * helper function to clear park modal content
 */
const clearParkModalEl = function() {
    parkModalEl.innerHTML = "";
};

/**
 * helper function to get information about parks stored in LocalStorage
 * 1. receive parkCode
 * 2. parse parkStorage object in localStorage
 * 3. return park object with key of parkCode from parkStorage object
 */
const getParkInfo = function(parkCode) {
    const parksData = JSON.parse(localStorage.getItem("parkStorage"));
    return parksData[parkCode];
};

/**
 * helper function to append park information to park modal
 * 1. receive parkData
 * 2. change park modal innerHTML to include park data
 */
const generateParkModalContent = function(parkData) {
    parkModalEl.innerHTML = `
        <img src="${parkData.images[0].url}" alt="${parkData.images[0].altText}" />
        <h4 class="park-header">${parkData.name}</h4>
        <p class="park-description">${parkData.description}</p>
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
    `
};

/**
 * helper function for open weather api call
 * 1. receive latitude and longitude
 * 2. create api endpoint from latitude and longitude
 * 3. fetch api call using created url
 * 4. return weather data object
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
 * 1. receive weather data object
 * 2. create weather card for each day of 5-day forecast from weather data object
 * 3. append weather cards to parkModal
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

const previouslyVisitedHandler = function(event) {
    event.preventDefault();

    clearParkModalEl();

    const parkCode = event.target.getAttribute("data-park-code");
    const savedParks = JSON.parse(localStorage.getItem("clickedParks"));

    const clickedParkData = savedParks.filter(park => park.parkInfo.parkCode === parkCode)[0].parkInfo;
    generateParkModalContent(clickedParkData);
};

searchButtonEl.addEventListener("click", searchButtonHandler);
parkDashboard();

// const getSun = function(lat, lon) {
//     fetch("https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400")
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             }
//         })
//         .then(data => console.log(data));
// };