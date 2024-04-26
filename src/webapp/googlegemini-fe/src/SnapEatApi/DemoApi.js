import recommendSample from "./recommend-sample.json"
import nearbyRestaurantsSample from "./nearby-restaurants.json"
import savedRestaurantsSample from "./saved-restaurants.json"
import trendingRestaurantsSample from "./trending-restaurants.json"
import {FetchWithCatch} from "../Utils/Utils";


export const recommend = (formData) => {
    let query = `./recommend-sample.json`;
    return simulateNetworkCall(query, recommendSample, 3000);
}

export const getNearbyRestaurants = (location) => {
    let query = `./nearby-restaurants.json`;
    return FetchWithCatch(query, simulateNetworkCallByQuery);
}

export const getSavedRestaurants = (userId) => {
    let query = `./saved-restaurants.json`;
    return FetchWithCatch(query, simulateNetworkCallByQuery);
}

export const getTrendingRestaurants = (location) => {
    let query = `./trending-restaurants.json`;
    return FetchWithCatch(query, simulateNetworkCallByQuery);
}

function simulateNetworkCallByQuery(query) {
    switch (query) {
        case './nearby-restaurants.json':
            return simulateNetworkCall(query, nearbyRestaurantsSample, 3000);
        case './saved-restaurants.json':
            return simulateNetworkCall(query, savedRestaurantsSample, 1000);
        case `./trending-restaurants.json`:
            return simulateNetworkCall(query, trendingRestaurantsSample, 1000);
        default:
            return simulateNetworkCall(query, recommendSample, 3000);
    }
}

function simulateNetworkCall(query, returnedFile, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            const response = new Response(JSON.stringify(returnedFile), {
                headers: {
                    'content-type': 'application/json'
                },
            });

            // Cache the response
            if (response.ok) {
                console.log("adding to cache: ", query)
                const clonedResponse = response.clone();
                caches.open('SnapEatCache')
                    .then(cache => {
                        cache.put(query, clonedResponse);
                    });
            }
            resolve(response);
            console.log(returnedFile);
        }, delay)
    }).then(res => res.json());
}