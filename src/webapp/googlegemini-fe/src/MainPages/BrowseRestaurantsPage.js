import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import BrowseRestaurantsComponent from "./BrowseRestaurants/BrowseRestaurantsComponent";
import BrowseRestaurantsResultComponent from "./BrowseRestaurants/BrowseRestaurantsResultComponent";

const BrowseRestaurantsPageEnum = {
    Browse: 'Browse',
    // Detail: 'Detail', TODO: add detail page for restaurant
    Result: 'Result'
}

class BrowseRestaurantsPage extends Component {
    state = {
        pageTitle: 'Find Restaurants',
        currentPage: BrowseRestaurantsPageEnum.Browse,
        restaurant: null,
        restaurantResultsCache: {}
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
                    <BrowseRestaurantsComponent setRestaurant={(restaurant) => this.setRestaurant(restaurant)}
                                                userProfile={this.props.userProfile}/>
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