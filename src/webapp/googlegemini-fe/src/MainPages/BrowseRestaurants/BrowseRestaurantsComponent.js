import React, {Component} from 'react';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import * as SnapEatApi from "../../SnapEatApi/ApiWrapper";
import {IsInArray, IsList} from "../../Utils/Utils";
import LoadingComponent from "../../Utils/LoadingComponent";
import {SearchRestaurants} from "../../SnapEatApi/ApiWrapper";

const RestaurantCategoryEnum = {
    Nearby: 'Near Me',
    Saved: 'Saved',
    Trending: 'Trending',
    Search: 'Search'
}

class BrowseRestaurantsComponent extends Component {
    state = {
        pageTitle: 'Browse Restaurants',
        userProfile: {},
        searchTerm: '',
        currentCategory: RestaurantCategoryEnum.Nearby,
        restaurantCategories: [RestaurantCategoryEnum.Nearby, RestaurantCategoryEnum.Saved, RestaurantCategoryEnum.Trending],
        nearbyResult: {data: [], error: null, isLoading: false},
        savedResult: {data: [], error: null, isLoading: false},
        trendingResult: {data: [], error: null, isLoading: false},
        searchResult: {data: [], error: null, isLoading: false},
    };

    componentDidMount() {
        this.updateDataForTab('nearbyResult', SnapEatApi.GetNearbyRestaurants(''));
        this.updateDataForTab('nearbyResult', SnapEatApi.GetNearbyRestaurants(''));
        this.updateDataForTab('savedResult', SnapEatApi.GetSavedRestaurants(''));
    }

    updateDataForTab(tabName, updateFunction, force=false) {
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

    getResultByCategory() {
        if (this.state.currentCategory === RestaurantCategoryEnum.Nearby) {
            return this.state.nearbyResult;
        } else if (this.state.currentCategory === RestaurantCategoryEnum.Saved) {
            return this.state.savedResult;
        } else if (this.state.currentCategory === RestaurantCategoryEnum.Trending) {
            return this.state.trendingResult;
        } else {
            return this.state.searchResult;
        }
    }

    getRestaurantsByCategory() {
        let result = this.getResultByCategory();
        return IsList(result.data) ? result.data : [];
    }

    changeCategory(category) {
        if (category === RestaurantCategoryEnum.Nearby) {
            this.updateDataForTab('nearbyResult', SnapEatApi.GetNearbyRestaurants(''));
        } else if (category === RestaurantCategoryEnum.Saved) {
            this.updateDataForTab('savedResult', SnapEatApi.GetSavedRestaurants(''));
        } else if (category === RestaurantCategoryEnum.Trending) {
            this.updateDataForTab('trendingResult', SnapEatApi.GetTrendingRestaurants(''));
        } else if (category === RestaurantCategoryEnum.Search) {
            this.updateDataForTab("searchResult", SnapEatApi.SearchRestaurants(this.state.searchTerm, '', this.state.userProfile))
        }

        this.setState({currentCategory: category});
    }

    onSearchSubmit(e) {
        e.preventDefault();
        if (!e.target[0] || !e.target[0].value) {
            return;
        }

        console.log('Search term:', e.target[0].value);
        this.setState({searchTerm: e.target[0].value});
        this.setState(prevState => {
            if (IsInArray(prevState.restaurantCategories, RestaurantCategoryEnum.Search))
                return;
            const newCategories = prevState.restaurantCategories;
            newCategories.push(RestaurantCategoryEnum.Search);
            return {restaurantCategories: newCategories};
        });
        this.changeCategory(RestaurantCategoryEnum.Search);
    }

    render() {
        return (
            <div style={{overflowY: 'hidden'}}>
                <div>
                    <div className='m-3'>
                        <form noValidate autoComplete="off" onSubmit={(e) => this.onSearchSubmit(e)}>
                            <input className="form-control rounded-pill" placeholder="Search" minLength="4"
                                   maxLength="50"/>
                        </form>
                    </div>
                    <div className='responsive'>
                    <div className='tabs ms-3'>
                            {this.state.restaurantCategories.map((category) =>
                                <MDBBtn key={category}
                                        rounded className='me-2 tab'
                                        style={{boxShadow: 'none', textTransform: 'none'}}
                                        color={category === this.state.currentCategory ? 'dark' : 'light'}
                                        onClick={(e) => this.changeCategory(category)}>
                                    {category}
                                </MDBBtn>)}
                        </div>
                    </div>

                    <div>
                        {!this.getResultByCategory().isLoading && this.getRestaurantsByCategory().length > 0 && this.getRestaurantsByCategory().map((place) =>
                            <MDBCard className='m-3' key={place.name}>
                                <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                              src={place.image_urls && place.image_urls.length > 0 ? place.image_urls[0] : ""}
                                              position='top'
                                              alt={place.name}/>
                                <MDBCardBody>
                                    <MDBCardTitle className="text-dark">{place.name}</MDBCardTitle>
                                    <MDBCardText>
                                        {place.address}
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>)}
                    </div>
                </div>
                {!this.getResultByCategory().isLoading && this.getResultByCategory() && this.getResultByCategory().error &&
                    <div className="text-bg-danger text-center text-light">{this.getRestaurantsByCategory().error}
                    </div>}
                {this.getResultByCategory() && this.getResultByCategory().isLoading &&
                    <LoadingComponent className="text-center"
                                      style={{marginTop: '50%'}}
                                      loadingMessage='Looking for your fav place!'/>}
            </div>
        )
    }
}

export default BrowseRestaurantsComponent