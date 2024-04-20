import React, {Component} from 'react';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import * as SnapEatApi from "../../SnapEatApi/SnapEatApi";
import {IsList, Wait} from "../../Utils";

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
        nearbyResult: {},
        savedResult: {},
        trendingResult: {},
    };

    componentDidMount() {
        SnapEatApi.GetNearbyRestaurants('').then(data => {
            if (data && data.result) {
                this.setState({nearbyResult: {data: data.result, error: ''}});
                return;
            }

            let error = 'Server is busy right now. Please try again!';
            if (data && data.error) {
                console.log(data.error);
                error = data.error
            }

            this.setState({nearbyResult: {data: [], error: error}});
        }).catch(ex => {
            console.log(ex);
            this.setState({nearbyResult: {data: [], error: 'Server is busy right now. Please try again!'}});
        });
    }

    getRestaurantsByCategory() {
        let places = [];
        if (this.state.currentCategory === RestaurantCategoryEnum.Nearby) {
            places = IsList(this.state.nearbyResult.data) ? this.state.nearbyResult.data : [];
        } else if (this.state.currentCategory === RestaurantCategoryEnum.Saved) {
            places = IsList(this.state.savedResult.data) ? this.state.savedResult.data : [];
        } else {
            places = IsList(this.state.trendingResult.data) ? this.state.trendingResult.data : [];
        }
        return places;
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
                {this.getRestaurantsByCategory() && this.getRestaurantsByCategory().error &&
                    <div className="text-bg-danger text-center text-light">{this.getRestaurantsByCategory().error}
                    </div>}
            </div>
        )
    }
}

export default BrowseRestaurantsComponent