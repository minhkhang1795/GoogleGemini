import recommendSample from "./recommend-sample.json"
import dessertRecommendSample from "./recommend-spot-dessert-bar.json"
import noMenuSample from "./recommend-no-menu.json"
import nearbyRestaurantsSample from "./nearby-restaurants.json"
import savedRestaurantsSample from "./saved-restaurants.json"
import trendingRestaurantsSample from "./trending-restaurants.json"
import searchRestaurantsSample from "./search-dessert-restaurants.json"
import {FetchWithCatch} from "../Utils/Utils";

const SpotDessertBarId = "ChIJ0QCeh5tZwokRh9J_3uvSPjU";

export const recommend = (formData) => {
    let query = `./recommend-sample.json`;
    return simulateNetworkCall(query, recommendSample, 3500);
}

export const recommendByRestaurant = (restaurantId, userProfile) => {
    let query = `./spot-dessert-bar.json?restaurantId=${restaurantId}`;
    if (restaurantId !== SpotDessertBarId) {
        return simulateNetworkCall(query, noMenuSample, 500);
    }

    return simulateNetworkCall(query, dessertRecommendSample, 3500);
}

export const searchRestaurants = (searchPrompt, location, userProfile) => {
    let query = `./search-dessert-restaurants.json`;
    return FetchWithCatch(query, simulateNetworkCallByQuery);
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
            return simulateNetworkCall(query, nearbyRestaurantsSample, 1000);
        case './saved-restaurants.json':
            return simulateNetworkCall(query, savedRestaurantsSample, 0);
        case `./trending-restaurants.json`:
            return simulateNetworkCall(query, trendingRestaurantsSample, 0);
        case `./search-dessert-restaurants.json`:
            return simulateNetworkCall(query, searchRestaurantsSample, 3000);
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