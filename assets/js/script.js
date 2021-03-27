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

console.log(getParks('TX', 'Camping'));