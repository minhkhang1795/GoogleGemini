import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import BrowseRestaurantsComponent from "./BrowseRestaurants/BrowseRestaurantsComponent";
import BrowseRestaurantsResultComponent from "./BrowseRestaurants/BrowseRestaurantsResultComponent";
import {IsArray, IsInArray} from "../Utils/Utils";
import * as SnapEatApi from "../SnapEatApi/ApiWrapper";

const BrowseRestaurantsPageEnum = {
    Browse: 'Browse',
    // Detail: 'Detail', TODO: add detail page for restaurant
    Result: 'Result'
}

export const RestaurantCategoryEnum = {
    Nearby: 'Near Me',
    Saved: 'Saved',
    Trending: 'Trending',
    Search: 'Search'
}

class BrowseRestaurantsPage extends Component {
    state = {
        pageTitle: 'Find Restaurants',
        currentPage: BrowseRestaurantsPageEnum.Browse,
        currentTab: RestaurantCategoryEnum.Nearby,
        allTabs: [RestaurantCategoryEnum.Nearby, RestaurantCategoryEnum.Saved, RestaurantCategoryEnum.Trending],
        restaurant: null,
        restaurantResultsCache: {},
        searchTerm: '',
        nearbyResult: {data: [], error: null, isLoading: false},
        savedResult: {data: [], error: null, isLoading: false},
        trendingResult: {data: [], error: null, isLoading: false},
        searchResult: {data: [], error: null, isLoading: false},
    };

    componentDidMount() {
    }

    getPageTitle() {
        if (this.state.currentPage === BrowseRestaurantsPageEnum.Result && this.state.restaurant?.name) {
            return this.state.restaurant.name.substring(0, 16);
        }

        return this.state.pageTitle;
    }

    setRestaurant(restaurant) {
        console.log("Recommending menu for restaurant", restaurant);
        this.setState({restaurant: restaurant, currentPage: BrowseRestaurantsPageEnum.Result});
    }

    updateRestaurantResultsCache(id, restaurantResult) {
        this.setState(prevState => {
            let cache = prevState.restaurantResultsCache;
            cache[id] = restaurantResult;
            return {restaurantResultsCache: cache};
        });
    }

    updateDataForTab(tabName, updateFunction, forceUpdate = false) {
        if (this.state[tabName].data && this.state[tabName].data.length > 0) {
            return;
        }

        if (!this.state[tabName].isLoading) {
            this.setState({
                [tabName]: {
                    data: this.state[tabName].data,
                    error: this.state[tabName].error,
                    isLoading: true
                }
            });
            updateFunction.then(data => {
                if (data && data.result) {
                    this.setState({[tabName]: {data: data.result, error: '', isLoading: false}});
                    return;
                }

                let error = data && data.error ? data.error : 'Server is busy right now. Please try again!';
                console.log(tabName, data)
                this.setState({[tabName]: {data: [], error: error, isLoading: false}});
            }).catch(ex => {
                console.log(tabName, ex);
                this.setState({
                    [tabName]: {
                        data: [],
                        error: 'Server is busy right now. Please try again!',
                        isLoading: false
                    }
                });
            });
        }
    }

    getRestaurantResultByCurrentTab() {
        if (this.state.currentTab === RestaurantCategoryEnum.Nearby) {
            return this.state.nearbyResult;
        } else if (this.state.currentTab === RestaurantCategoryEnum.Saved) {
            return this.state.savedResult;
        } else if (this.state.currentTab === RestaurantCategoryEnum.Trending) {
            return this.state.trendingResult;
        } else {
            return this.state.searchResult;
        }
    }

    getRestaurantsByCategory() {
        let result = this.getRestaurantResultByCurrentTab();
        return IsArray(result.data) ? result.data : [];
    }

    changeTab(tab) {
        if (tab === RestaurantCategoryEnum.Nearby) {
            this.updateDataForTab('nearbyResult', SnapEatApi.GetNearbyRestaurants(''));
        } else if (tab === RestaurantCategoryEnum.Saved) {
            this.updateDataForTab('savedResult', SnapEatApi.GetSavedRestaurants(''));
        } else if (tab === RestaurantCategoryEnum.Trending) {
            this.updateDataForTab('trendingResult', SnapEatApi.GetTrendingRestaurants(''));
        } else if (tab === RestaurantCategoryEnum.Search) {
            this.updateDataForTab("searchResult", SnapEatApi.SearchRestaurants(this.state.searchTerm, '', this.props.userProfile))
        }

        this.setState({currentTab: tab});
    }

    onSearchSubmit(e) {
        e.preventDefault();
        if (!e.target[0] || !e.target[0].value) {
            return;
        }

        console.log('Search term:', e.target[0].value);
        this.setState({searchTerm: e.target[0].value});
        this.setState(prevState => {
            if (IsInArray(prevState.allTabs, RestaurantCategoryEnum.Search))
                return;
            const newCategories = prevState.allTabs;
            newCategories.push(RestaurantCategoryEnum.Search);
            return {allTabs: newCategories};
        });
        this.changeTab(RestaurantCategoryEnum.Search);
    }

    render() {
        return (
            <div>
                <div className='top-title'>
                    <div className='d-flex align-items-center'
                         style={{width: '100%', height: '100%', position: 'absolute'}}>
                        {this.state.currentPage === BrowseRestaurantsPageEnum.Result &&
                            <FontAwesomeIcon className='p-3 fa-lg d-flex'
                                             icon={fas.faAngleLeft}
                                             onClick={(e) => {
                                                 this.setState({currentPage: BrowseRestaurantsPageEnum.Browse})
                                             }}/>
                        }
                    </div>
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom text-dark'
                                   style={{fontWeight: '700'}}>
                        {this.getPageTitle()}
                    </MDBTypography>
                </div>

                {this.state.currentPage === BrowseRestaurantsPageEnum.Browse && <div>
                    <BrowseRestaurantsComponent
                        userProfile={this.props.userProfile}
                        allTabs={this.state.allTabs}
                        currentTab={this.state.currentTab}
                        changeTab={(category) => this.changeTab(category)}
                        getRestaurantResultByCurrentTab={() => this.getRestaurantResultByCurrentTab()}
                        updateDataForTab={(tabName, updateFunction, forceUpdate) => this.updateDataForTab(tabName, updateFunction, forceUpdate)}
                        onSearchSubmit={(e) => this.onSearchSubmit(e)}
                        setRestaurant={(restaurant) => this.setRestaurant(restaurant)}/>
                </div>}

                {this.state.currentPage === BrowseRestaurantsPageEnum.Result && <div>
                    <BrowseRestaurantsResultComponent restaurantId={this.state.restaurant.google_place_id}
                                                      restaurantResultsCache={this.state.restaurantResultsCache}
                                                      updateRestaurantResultsCache={(id, r) => this.updateRestaurantResultsCache(id, r)}/>
                </div>}
            </div>
        )
    }
}

export default BrowseRestaurantsPage