import React, {Component} from 'react';
import {
    MDBBtn,
    MDBCardImage,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog, MDBModalFooter
} from "mdb-react-ui-kit";

class ItemPopUpModal extends Component {
    state = {
    };

    componentDidMount() {
    }

    render() {
        const item = this.props.currentItem;

        return (
            <MDBModal tabIndex='-1' open={this.props.showModal} onClose={() => this.props.toggleModal()}>
                <MDBModalDialog centered scrollable>
                    <MDBModalContent>
                        <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                      src={item?.image_urls && item?.image_urls.length > 0 ? item?.image_urls[0] : ""}
                                      position='top'
                                      alt={item?.name}/>
                        <MDBModalBody>
                            <h3 className="text-dark" style={{textTransform: 'capitalize'}}>{item?.name?.toLowerCase()}</h3>
                            <p>
                                {item?.description}
                                <br/>
                                <br/>
                                <b className="text-dark">Why we recommend this?</b>
                                <br/>
                                {item?.match_explanation}
                            </p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn rounded color='dark'
                                    style={{textTransform: 'none'}}
                                    onClick={() => this.props.toggleModal()}>
                                Close
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        )
    }
}

export default ItemPopUpModal