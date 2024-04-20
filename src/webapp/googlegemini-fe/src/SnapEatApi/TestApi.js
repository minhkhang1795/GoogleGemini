import recommendSample from "./recommend-sample.json"
import nearbyRestaurantSample from "./nearby-restaurant.json"


export const testRecommend = (formData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(recommendSample);
        }, 3000);
    });
}

export const testGetNearbyRestaurant = (location) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(nearbyRestaurantSample);
        }, 3000);
    });
}