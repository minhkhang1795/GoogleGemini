import recommendSample from "./recommend-sample.json"
import nearbyRestaurantsSample from "./nearby-restaurants.json"
import savedRestaurantsSample from "./nearby-restaurants.json"
import trendingRestaurantsSample from "./nearby-restaurants.json"


export const testRecommend = (formData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(recommendSample);
            console.log(recommendSample);
        }, 3000);
    });
}

export const testGetNearbyRestaurants = (location) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(nearbyRestaurantsSample);
            console.log(nearbyRestaurantsSample);
        }, 3000);
    });
}

export const testGetSavedRestaurants = (location) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(savedRestaurantsSample);
            console.log(savedRestaurantsSample);
        }, 3000);
    });
}

export const testGetTrendingRestaurants = (location) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(trendingRestaurantsSample);
            console.log(trendingRestaurantsSample);
        }, 3000);
    });
}