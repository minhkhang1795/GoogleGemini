import * as TestApi from "./TestApi";
import {testGetSavedRestaurants} from "./TestApi";

// If there is a ?demo=true query, use test APIs. Otherwise, use the backend APIs.
const searchParams = new URLSearchParams(window.location.search);
const demo = searchParams.get('demo') === 'true';
const isLocal = window.location.hostname === 'localhost';
const domain = isLocal ? 'http://localhost:8000' : "https://snapeat.azurewebsites.net";

export const Recommend = demo ? TestApi.testRecommend : recommend;
export const GetNearbyRestaurants = demo ? TestApi.testGetNearbyRestaurants : getNearbyRestaurants;
export const GetSavedRestaurants = demo ? TestApi.testGetSavedRestaurants : getSavedRestaurants;
export const GetTrendingRestaurants = demo ? TestApi.testGetTrendingRestaurants : getTrendingRestaurants;

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

function getSavedRestaurants(userId) {
    return fetch(`${domain}/restaurants/saved/?userId=${userId}`, {
        method: 'GET',
    })
        .then(res => res.json())
}

function getTrendingRestaurants(location) {
    return fetch(`${domain}/restaurants/trending/?location=${location}`, {
        method: 'GET',
    })
        .then(res => res.json())
}

function searchRestaurants(query, location) {
    return fetch(`${domain}/restaurants/search/?location=${location}&query=${query}`, {
        method: 'GET',
    })
        .then(res => res.json())
}