import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";

class UserProfilePage extends Component {
    state = {
        pageTitle: 'User Profile',
        userProfile: {},
    };

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div>
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom'>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>
            </div>
        )
    }
}

export default UserProfilePage