import React, {Component} from 'react';
import {MDBBtn, MDBCol, MDBRow, MDBTypography} from "mdb-react-ui-kit";

class LandingPageComponent extends Component {
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
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom'>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>
                <div className='py-5 px-4'>
                    <h1 className='pb-3'><b>Find your new fav place</b></h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <MDBRow>
                        <MDBCol size='6'>
                            <MDBBtn className='w-100' color='dark' style={{textTransform: 'none'}}
                                    onClick={() => this.props.handleFillClick('tab2')}>
                                Scan Menu
                            </MDBBtn>
                        </MDBCol>
                        <MDBCol size='6'>
                            <MDBBtn outline className='w-100' color='dark' style={{textTransform: 'none'}}
                                    onClick={() => this.props.handleFillClick('tab3')}>
                                Browse Restaurant
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </div>
            </div>
        )
    }
}

export default LandingPageComponent