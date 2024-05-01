import React, {Component} from 'react';
import {MDBBtn, MDBTypography} from "mdb-react-ui-kit";

class UserProfilePage extends Component {
    state = {
        pageTitle: 'Your Profile',
    };

    componentDidMount() {
    }

    getArrayStringOrNone(arr) {
        if (!arr || arr.length === 0) {
            return "None";
        }

        return arr.join(", ");
    }

    render() {
        const userProfile = this.props.userProfile;

        return (
            <div>
                <div>
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom text-dark'
                                   style={{fontWeight: '700'}}>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>

                <div className="p-4 text-dark">
                    <div>
                        <b>Diets: </b>{this.getArrayStringOrNone(userProfile.diets)}.
                        <br/>
                        <b>Allergies: </b>{this.getArrayStringOrNone(userProfile.allergies)}.
                        <br/>
                        <b>Cuisines: </b>{this.getArrayStringOrNone(userProfile.cuisines)}.
                        <br/>
                        <b>Flavors: </b>{this.getArrayStringOrNone(userProfile.flavors)}.
                    </div>

                    <div className="mt-5 text-center">
                        <MDBBtn outline rounded color='dark' className="w-100" style={{textTransform: 'none'}}
                            onClick={() => this.props.updateProfile()}>
                            Update Profile
                        </MDBBtn>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserProfilePage