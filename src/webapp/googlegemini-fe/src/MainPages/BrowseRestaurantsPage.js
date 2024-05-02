import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import BrowseRestaurantsComponent from "./BrowseRestaurants/BrowseRestaurantsComponent";
import BrowseRestaurantsResultComponent from "./BrowseRestaurants/BrowseRestaurantsResultComponent";
import {IsInArray, IsNonEmptyArray} from "../Utils/Utils";
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
        allTabs: [RestaurantCategoryEnum.Nearby, RestaurantCategoryEnum.Trending, RestaurantCategoryEnum.Saved],
        restaurant: null,
        restaurantDetailsCache: {},
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
        let id = restaurant.google_place_id;
        this.setState({restaurant: restaurant, currentPage: BrowseRestaurantsPageEnum.Result});
        // Call to get recommendation results
        this.updateRestaurantDetailsCache({data: [], error: '', isLoading: true})
        SnapEatApi.RecommendByRestaurant(id, JSON.stringify(this.props.userProfile)).then(data => {
            console.log(data);
            if (data && IsNonEmptyArray(data.result)) {
                this.updateRestaurantDetailsCache(id, {
                    data: data.result,
                    error: '',
                    isLoading: false
                })
                return;
            }

            let error = data && data.error ? data.error : 'Server is busy right now. Please try again!';
            this.updateRestaurantDetailsCache(id,
                {data: [], error: error, errorCode: data.errorCode, isLoading: false});
        }).catch(ex => {
            console.log(ex);
            this.updateRestaurantDetailsCache(id,
                {data: [], error: 'Server is busy right now. Please try again!', isLoading: false});
        });
    }

    updateRestaurantDetailsCache(id, restaurantDetail) {
        this.setState(prevState => {
            let cache = prevState.restaurantDetailsCache;
            cache[id] = restaurantDetail;
            return {restaurantDetailsCache: cache};
        });
    }

    updateDataForTab(tabName, updateFunction, forceUpdate = false) {
        if (!forceUpdate && this.state[tabName].data && this.state[tabName].data.length > 0) {
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

    changeTab(tab) {
        this.setState({currentTab: tab}, () => {
            if (tab === RestaurantCategoryEnum.Nearby) {
                this.updateDataForTab('nearbyResult', SnapEatApi.GetNearbyRestaurants(''));
                // Scroll tab to start
                const tabContainer = document.getElementById('restaurantTabId');
                tabContainer.scrollLeft = 0;
            } else if (tab === RestaurantCategoryEnum.Saved) {
                this.updateDataForTab('savedResult', SnapEatApi.GetSavedRestaurants(''));
            } else if (tab === RestaurantCategoryEnum.Trending) {
                this.updateDataForTab('trendingResult', SnapEatApi.GetTrendingRestaurants(''));
            } else if (tab === RestaurantCategoryEnum.Search) {
                this.updateDataForTab("searchResult", SnapEatApi.SearchRestaurants(this.state.searchTerm, '', JSON.stringify(this.props.userProfile)), true);
                // Scroll tab to end
                const tabContainer = document.getElementById('restaurantTabId');
                tabContainer.scrollLeft = tabContainer.scrollWidth;
            }
        });
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
                    <BrowseRestaurantsResultComponent userProfile={this.props.userProfile}
                                                      restaurantId={this.state.restaurant.google_place_id}
                                                      restaurantDetailsCache={this.state.restaurantDetailsCache}/>
                </div>}
            </div>
        )
    }
}

export default BrowseRestaurantsPage