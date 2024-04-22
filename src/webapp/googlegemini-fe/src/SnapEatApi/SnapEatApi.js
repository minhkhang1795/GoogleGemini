import {FetchWithCatch} from "../Utils/Utils";
const isLocal = window.location.hostname === 'localhost';
const domain = isLocal ? 'http://localhost:8000' : "https://snapeat.azurewebsites.net";

export const recommend = (formData) => {
    return fetch(`${domain}/recommend/`, {
        method: 'POST',
        body: formData // Set the FormData object as the body of the request
    })
        .then(res => res.json())
}

export const getNearbyRestaurants = (location) => {
    let query = `${domain}/restaurants/nearby/?location=${location}`;
    return FetchWithCatch(query, fetchDataFromNetwork);
}

export const getSavedRestaurants = (userId) => {
    let query = `${domain}/restaurants/saved/?userId=${userId}`;
    return FetchWithCatch(query, fetchDataFromNetwork);
}

export const getTrendingRestaurants = (location) => {
    let query = `${domain}/restaurants/trending/?location=${location}`;
    return FetchWithCatch(query, fetchDataFromNetwork);
}

export const searchRestaurants = (prompt, location) => {
    let query = `${domain}/restaurants/search/?location=${location}`;
    return FetchWithCatch(query, fetchDataFromNetwork);
}

// Function to fetch data from the network
function fetchDataFromNetwork(query) {
    return fetch(query)
        .then(response => {
            // Cache the response
            if (response.ok) {
                console.log("adding to cache: ", query)
                const clonedResponse = response.clone();
                caches.open('SnapEatCache')
                    .then(cache => {
                        cache.put(query, clonedResponse);
                    });
            }
            return response.json();
        });
}