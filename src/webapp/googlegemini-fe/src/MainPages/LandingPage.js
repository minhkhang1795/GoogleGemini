import React, {Component} from 'react';
import {MDBBtn, MDBCol, MDBRow, MDBTypography} from "mdb-react-ui-kit";

class LandingPage extends Component {
    state = {
        pageTitle: 'SnapEat',
        userProfile: {},
    };

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div>
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom text-dark'
                                   style={{fontWeight: '700'}}>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>
                <div className='py-4 px-4 text-center'>
                    <h2 className='my-3 text-dark'>Your perfect plate.<br/>One Snap away!</h2>
                    <p className="my-4 text-dark">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <MDBRow className="my-5">
                        <MDBCol size='6'>
                            <MDBBtn className='w-100' rounded color='dark' style={{textTransform: 'none'}}
                                    onClick={() => this.props.handleLandingTabs('tab2')}>
                                Snap Menu
                            </MDBBtn>
                        </MDBCol>
                        <MDBCol size='6'>
                            <MDBBtn outline rounded className='w-100' color='dark' style={{textTransform: 'none'}}
                                    onClick={() => this.props.handleLandingTabs('tab3')}>
                                Find Restaurants
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </div>
            </div>
        )
    }
}

export default LandingPage