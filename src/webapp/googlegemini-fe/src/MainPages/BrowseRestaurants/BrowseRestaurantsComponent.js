import React, {Component} from 'react';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import * as SnapEatApi from "../../SnapEatApi/ApiWrapper";
import LoadingComponent from "../../Utils/LoadingComponent";
import {IsNonEmptyArray} from "../../Utils/Utils";

class BrowseRestaurantsComponent extends Component {
    state = {};

    componentDidMount() {
        this.props.updateDataForTab('nearbyResult', SnapEatApi.GetNearbyRestaurants(''));
        this.props.updateDataForTab('savedResult', SnapEatApi.GetSavedRestaurants(''));
        this.props.updateDataForTab('trendingResult', SnapEatApi.GetTrendingRestaurants(''));
    }

    getRestaurantsByCategory() {
        let result = this.props.getRestaurantResultByCurrentTab();
        return IsNonEmptyArray(result.data) ? result.data : [];
    }

    render() {
        const restaurantResults = this.props.getRestaurantResultByCurrentTab();

        return (
            <div style={{overflowY: 'hidden'}}>
                <div>
                    <div className='m-3'>
                        <form noValidate autoComplete="off" onSubmit={(e) => this.props.onSearchSubmit(e)}>
                            <input className="form-control rounded-pill" placeholder="Search" minLength="4"
                                   maxLength="50"/>
                        </form>
                    </div>
                    <div className='responsive' id='restaurantTabId'>
                        <div className='tabs ms-3'>
                            {this.props.allTabs.map((tab) =>
                                <MDBBtn key={tab}
                                        rounded className='me-2 tab'
                                        style={{boxShadow: 'none', textTransform: 'none'}}
                                        color={tab === this.props.currentTab ? 'dark' : 'light'}
                                        onClick={(e) => this.props.changeTab(tab)}>
                                    {tab}
                                </MDBBtn>)}
                        </div>
                    </div>

                    <div>
                        {this.getRestaurantsByCategory().length > 0 && this.getRestaurantsByCategory().map((place) =>
                            <MDBCard className='m-3'
                                     key={place.name}
                                     onClick={() => this.props.setRestaurant(place)}>
                                <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                              src={place.image_urls && place.image_urls.length > 0 ? place.image_urls[0] : ""}
                                              position='top'
                                              alt={place.name}/>
                                <MDBCardBody>
                                    <MDBCardTitle className="text-dark"
                                                  style={{textTransform: 'capitalize'}}>{place.name?.toLowerCase()}
                                    </MDBCardTitle>
                                    <MDBCardText>
                                        {place.description}
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>)}
                    </div>
                </div>
                {!restaurantResults?.isLoading && restaurantResults?.error &&
                    <div className="text-bg-danger text-center text-light">
                        {restaurantResults.error}
                    </div>}
                {restaurantResults?.isLoading &&
                    <LoadingComponent className="text-center"
                                      style={{marginTop: '40%'}}
                                      loadingMessage='Looking for your fav place!'
                                      additionalMessages={['Exploring eateries that cater to your unique palate.',
                                          'Delving deep into our database to find a restaurant that suits your individual tastes',
                                          'Venturing into the culinary scene to discover a top pick tailored just for you.']}/>}
            </div>
        )
    }
}

export default BrowseRestaurantsComponent