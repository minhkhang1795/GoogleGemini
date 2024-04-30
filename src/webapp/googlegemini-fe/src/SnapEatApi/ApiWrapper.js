import * as TestApi from "./DemoApi";
import * as SnapEatApi from "./SnapEatApi";

// If there is a ?demo=true query, use test APIs. Otherwise, use the backend APIs.
const searchParams = new URLSearchParams(window.location.search);
const demo = searchParams.get('demo') === 'true';
const api = demo ? TestApi : SnapEatApi;

export const Recommend = (formData) => api.recommend(formData);
export const RecommendByRestaurant = (restaurantId, userProfile) => api.recommendByRestaurant(restaurantId, userProfile);
export const SearchRestaurants = (searchPrompt, location, userProfile) => api.searchRestaurants(searchPrompt, location, userProfile);
// These APIs are just for demo
export const GetNearbyRestaurants = (location) => TestApi.getNearbyRestaurants(location);
export const GetSavedRestaurants = (location) => TestApi.getSavedRestaurants(location);
export const GetTrendingRestaurants = (location) => TestApi.getTrendingRestaurants(location);
