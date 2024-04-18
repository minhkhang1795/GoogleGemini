import React, {Component} from 'react';
import './fileupload.css';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";


class SnapMenuResultComponent extends Component {
    state = {
        userProfile: "love Japanese foods, lactose intolerance, gluten free, love beef and meats",
    };

    componentDidMount() {
    }

    getCategories(items) {
        let categories = [];
        if (items && items.length > 0) {
            for (const categoriesKey in items) {

            }
        }

        return categories;
    }

    render() {
        const result = this.props.result;

        return (
            <div>
                {result.data && result.data.constructor === Array && result.data.length > 0 &&
                    <div className="pt-3">
                        <div>
                            <MDBBtn rounded className='mx-2' color='dark'>
                                Dark
                            </MDBBtn>
                            <MDBBtn rounded className='text-grey' color='light'>
                                Light
                            </MDBBtn>
                        </div>

                        {result.data.map((item) =>
                        <MDBCard className='m-3'>
                            <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                          src={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : ""}
                                          position='top'
                                          alt={item.name}/>
                            <MDBCardBody>
                                <MDBCardTitle>{item.name}</MDBCardTitle>
                                <MDBCardText>
                                    {item.description}
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>)}
                    </div>
                }
                {result.error && <div>{result.error}</div>}
            </div>
        )
    }
}

export default SnapMenuResultComponent