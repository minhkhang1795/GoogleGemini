export const IsArray = (array) => {
    return array && array.constructor === Array;
}

export const IsNonEmptyArray = (array) => {
    return array && array.constructor === Array && array.length > 0;
}

export const IsInArray = (array, value) => {
    return array.indexOf(value) > -1;
}

export const GenerateRandomId = () => {
    // Generate a random number and convert it to a hexadecimal string
    return 'component_' + Math.random().toString(36);
}

export const FetchWithCatch = (query, fetchCall) => {
    return fetchDataFromCache(query)
        .then(cachedData => {
            if (cachedData) {
                console.log("Retrieved from cache: ", query);
                return cachedData; // Return cached data if available
            } else {
                console.log("Fetching call: ", query)
                return fetchCall(query); // Fetch data from network if not available in cache
            }
        })
}

// Function to fetch data from cache
function fetchDataFromCache(query) {
    return caches.open('SnapEatCache')
        .then(cache => cache.match(query))
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse.json();
            }

            return null;
        });
}