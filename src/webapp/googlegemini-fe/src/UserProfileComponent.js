import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";

class UserProfileComponent extends Component {
    state = {
        pageTitle: 'User Profile',
        userProfile: {},
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
            </div>
        )
    }
}

export default UserProfileComponent