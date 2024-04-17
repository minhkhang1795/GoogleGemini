import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";

class BrowseRestaurantsComponent extends Component {
    state = {
        pageTitle: 'Browse Restaurants',
        userProfile: {},
        data: {}
    };

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div className='text-center'>
                    <MDBTypography tag='div' className='display-6 p-3 border-bottom'>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>
                Browse Restaurants
            </div>
        )
    }
}

export default BrowseRestaurantsComponent