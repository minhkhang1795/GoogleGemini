import * as TestApi from "./TestApi";

// If there is a ?demo=true query, use test APIs. Otherwise, use the backend APIs.
const searchParams = new URLSearchParams(window.location.search);
const demo = searchParams.get('demo') === 'true';
const isLocal = window.location.hostname === 'localhost';
const domain = isLocal ? 'http://localhost:8000' : "https://snapeat.azurewebsites.net";

export const Recommend = demo ? TestApi.testRecommend : recommend;
export const GetNearbyRestaurants = demo ? TestApi.testGetNearbyRestaurant : getNearbyRestaurants;

function recommend(formData) {
    return fetch(`${domain}/recommend/`, {
        method: 'POST',
        body: formData // Set the FormData object as the body of the request
    })
        .then(res => res.json())
}

function getNearbyRestaurants(location) {
    return fetch(`${domain}/restaurants/nearby/?location=${location}`, {
        method: 'GET',
    })
        .then(res => res.json())
}