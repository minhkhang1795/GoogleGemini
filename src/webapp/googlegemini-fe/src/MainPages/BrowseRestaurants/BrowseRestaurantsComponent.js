import React, {Component} from 'react';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import * as SnapEatApi from "../../SnapEatApi/SnapEatApi";
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
        console.log('a')
        if (!this.state.nearbyResult.isLoading) {
            this.setState({nearbyResult: {data: this.state.nearbyResult.data, error: this.state.nearbyResult.error, isLoading: true}});
            SnapEatApi.GetNearbyRestaurants('').then(data => {
                if (data && data.result) {
                    this.setState({nearbyResult: {data: data.result, error: '', isLoading: false}});
                    return;
                }

                let error = data && data.error ? data.error : 'Server is busy right now. Please try again!';
                console.log(data)
                this.setState({nearbyResult: {data: [], error: error, isLoading: false}});
            }).catch(ex => {
                console.log(ex);
                this.setState({nearbyResult: {data: [], error: 'Server is busy right now. Please try again!', isLoading: false}});
            });
        }

        if (!this.state.savedResult.isLoading) {
            this.setState({savedResult: {data: this.state.savedResult.data, error: this.state.savedResult.error, isLoading: true}});
            SnapEatApi.GetSavedRestaurants('').then(data => {
                if (data && data.result) {
                    this.setState({savedResult: {data: data.result, error: '', isLoading: false}});
                    return;
                }

                let error = data && data.error ? data.error : 'Server is busy right now. Please try again!';
                console.log(data)
                this.setState({savedResult: {data: [], error: error, isLoading: false}});
            }).catch(ex => {
                console.log(ex);
                this.setState({savedResult: {data: [], error: 'Server is busy right now. Please try again!', isLoading: false}});
            });
        }

        if (!this.state.trendingResult.isLoading) {
            this.setState({trendingResult: {data: this.state.trendingResult.data, error: this.state.trendingResult.error, isLoading: true}});
            SnapEatApi.GetTrendingRestaurants('').then(data => {
                if (data && data.result) {
                    this.setState({trendingResult: {data: data.result, error: '', isLoading: false}});
                    return;
                }

                let error = data && data.error ? data.error : 'Server is busy right now. Please try again!';
                console.log(data)
                this.setState({trendingResult: {data: [], error: error, isLoading: false}});
            }).catch(ex => {
                console.log(ex);
                this.setState({trendingResult: {data: [], error: 'Server is busy right now. Please try again!', isLoading: false}});
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
        return IsList(result.data) ? result.data: [];
    }

    render() {
        return (
            <div style={{overflowY: 'hidden'}}>
                <div className="pt-3">
                    <div className='responsive'>
                        <div className='tabs tabs-center'>
                            {this.state.restaurantCategories.map((category) =>
                                <MDBBtn key={category}
                                        rounded className='mx-2 tab'
                                        style={{boxShadow: 'none', textTransform: 'none'}}
                                        color={category === this.state.currentCategory ? 'dark' : 'light'}
                                        onClick={(e) => {
                                            this.setState({currentCategory: category})
                                        }}>
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
                {this.getResultByCategory() && this.getResultByCategory().isLoading && <LoadingComponent className="text-center"
                                                  style={{marginTop: '50%'}}
                                                  loadingMessage='Looking for your fav place!'/>}
            </div>
        )
    }
}

export default BrowseRestaurantsComponent