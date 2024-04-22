import React, {Component} from 'react';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import * as SnapEatApi from "../../SnapEatApi/ApiWrapper";
import {IsList} from "../../Utils/Utils";
import LoadingComponent from "../../Utils/LoadingComponent";

const RestaurantCategoryEnum = {
    Nearby: 'Near Me',
    Saved: 'Saved',
    Trending: 'Trending'
}

class BrowseRestaurantsComponent extends Component {
    state = {
        pageTitle: 'Browse Restaurants',
        userProfile: {},
        currentCategory: RestaurantCategoryEnum.Nearby,
        restaurantCategories: [RestaurantCategoryEnum.Nearby, RestaurantCategoryEnum.Saved, RestaurantCategoryEnum.Trending],
        nearbyResult: {data: [], error: null, isLoading: false},
        savedResult: {data: [], error: null, isLoading: false},
        trendingResult: {data: [], error: null, isLoading: false},
    };

    componentDidMount() {
        this.updateDataForTab('nearbyResult', SnapEatApi.GetNearbyRestaurants(''));
    }

    updateDataForTab(tabName, updateFunction) {
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
        } else {
            return this.state.trendingResult;
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
        }
        this.setState({currentCategory: category});
    }

    render() {
        return (
            <div style={{overflowY: 'hidden'}}>
                <div>
                    <div className='m-3'>
                        <input className="form-control rounded-pill" placeholder="Search"/>
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
                        {this.getRestaurantsByCategory().length > 0 && this.getRestaurantsByCategory().map((place) =>
                            <MDBCard className='m-3' key={place.name}>
                                <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                              src={place.image_urls && place.image_urls.length > 0 ? place.image_urls[0] : ""}
                                              position='top'
                                              alt={place.name}/>
                                <MDBCardBody>
                                    <MDBCardTitle>{place.name}</MDBCardTitle>
                                    <MDBCardText>
                                        {place.address}
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>)}
                    </div>
                </div>
                {this.getResultByCategory() && this.getResultByCategory().error &&
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