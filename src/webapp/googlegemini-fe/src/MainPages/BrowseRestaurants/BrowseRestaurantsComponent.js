import React, {Component} from 'react';
import {MDBBtn} from "mdb-react-ui-kit";


class BrowseRestaurantsComponent extends Component {
    state = {
        pageTitle: 'Browse Restaurants',
        userProfile: {},
        currentCategory: "Near Me",
        restaurantCategories: ["Near Me", "Saved", "Trending"]
    };

    componentDidMount() {
    }

    getRestaurantsByCategory(category) {

    }

    render() {
        const result = this.props.result;

        return (
            <div style={{overflowY: 'hidden'}}>
                {result.data && result.data.constructor === Array && result.data.length > 0 &&
                    <div className="pt-3">
                        <div className='responsive'>
                            <div className='tabs tabs-center'>
                                {this.state.restaurantCategories.map((category) =>
                                    <MDBBtn key={category}
                                            rounded className='mx-2 tab'
                                            style={{boxShadow: 'none', textTransform: 'none'}}
                                            color={category === this.state.currentCategory ? 'dark' : 'light'}
                                            onClick={(e) => {
                                                this.setState({currentCategory: category})
                                            }}>
                                        {category}
                                    </MDBBtn>)}
                            </div>
                        </div>

                        {/*<div>*/}
                        {/*    {this.getRestaurantsByCategory(this.state.currentCategory).map((item) =>*/}
                        {/*        <MDBCard className='m-3' key={item.name}>*/}
                        {/*            <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}*/}
                        {/*                          src={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : ""}*/}
                        {/*                          position='top'*/}
                        {/*                          alt={item.name}/>*/}
                        {/*            <MDBCardBody>*/}
                        {/*                <MDBCardTitle>{item.name}</MDBCardTitle>*/}
                        {/*                <MDBCardText>*/}
                        {/*                    {item.description}*/}
                        {/*                </MDBCardText>*/}
                        {/*            </MDBCardBody>*/}
                        {/*        </MDBCard>)}*/}
                        {/*</div>*/}
                    </div>
                }
                {result.error && <div className="text-bg-danger text-center text-light">{result.error}</div>}
            </div>
        )
    }
}

export default BrowseRestaurantsComponent