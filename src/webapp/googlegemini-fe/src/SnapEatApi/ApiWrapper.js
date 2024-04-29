import * as TestApi from "./DemoApi";
import * as SnapEatApi from "./SnapEatApi";

// If there is a ?demo=true query, use test APIs. Otherwise, use the backend APIs.
const searchParams = new URLSearchParams(window.location.search);
const demo = searchParams.get('demo') === 'true';
const api = demo ? TestApi : SnapEatApi;

export const Recommend = api.recommend;
export const RecommendByRestaurant = api.recommendByRestaurant;
export const SearchRestaurants = api.searchRestaurants;
// These APIs are just for demo
export const GetNearbyRestaurants = TestApi.getNearbyRestaurants;
export const GetSavedRestaurants = TestApi.getSavedRestaurants;
export const GetTrendingRestaurants = TestApi.getTrendingRestaurants;
