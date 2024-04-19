import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";

const BrowseRestaurantsPageEnum = {
    Browse: 'Browse',
    // Detail: 'Detail', TODO: add detail page for restaurant
    Result: 'Result'
}

class BrowseRestaurantsPage extends Component {
    state = {
        pageTitle: 'Browse Restaurants',
        currentPage: '',
        userProfile: {},
        restaurantResult: {}
    };

    componentDidMount() {
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
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom'>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>

                {/*{this.state.currentPage === BrowseRestaurantsPage.Browse && <div>*/}
                {/*    <SnapMenuResultComponent result={this.state.restaurantResult}/>*/}
                {/*</div>}*/}

                {/*{this.state.currentPage === BrowseRestaurantsPage.Result && <div>*/}
                {/*    <SnapMenuResultComponent result={this.state.restaurantResult}/>*/}
                {/*</div>}*/}
            </div>
        )
    }
}

export default BrowseRestaurantsPage