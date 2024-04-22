export const IsList = (list) => {
    if (list && list.constructor === Array && list.length > 0) {
        return true;
    }
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