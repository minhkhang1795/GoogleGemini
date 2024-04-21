import React, {Component} from 'react';
import {MDBTypography} from "mdb-react-ui-kit";
import LoadingComponent from "../Utils/LoadingComponent";

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

                <LoadingComponent className='p-5'/>
            </div>
        )
    }
}

export default UserProfilePage