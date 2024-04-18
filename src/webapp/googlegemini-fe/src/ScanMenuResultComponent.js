import React, {Component} from 'react';
import './fileupload.css';
import {MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";


class SnapMenuResultComponent extends Component {
    state = {
        userProfile: "love Japanese foods, lactose intolerance, gluten free, love beef and meats",
    };

    componentDidMount() {
    }

    render() {
        const result = this.props.result;

        return (
            <div>
                {result.data && result.data.constructor === Array && result.data.map((item) =>
                    <MDBCard className='m-3'>
                        <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                      src={item.imageUrls[0]} position='top' alt={item.name} />
                        <MDBCardBody>
                            <MDBCardTitle>{item.name}</MDBCardTitle>
                            <MDBCardText>
                                {item.description}
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                )}
                {result.error && <div>{result.error}</div>}
            </div>
        )
    }
}

export default SnapMenuResultComponent