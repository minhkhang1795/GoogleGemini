import React, {Component} from 'react';
import '../../fileupload.css';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBModal, MDBModalBody, MDBModalContent,
    MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle
} from "mdb-react-ui-kit";
import LoadingComponent from "../../Utils/LoadingComponent";


class SnapMenuResultComponent extends Component {
    state = {
        userProfile: "love Japanese foods, lactose intolerance, gluten free, love beef and meats",
        currentCategory: "All",
        showModal: false,
        currentItem: null,
    };

    componentDidMount() {
    }

    getCategories(items) {
        let categories = new Set();
        if (items && items.length > 0) {
            for (const item of items) { // Use 'of' instead of 'in' to iterate over array elements
                if (item.category) {
                    categories.add(item.category);
                }
            }
        }
        let categoriesWithAll = Array.from(categories);
        categoriesWithAll.unshift("All"); // Add "All" to the beginning of the array

        return categoriesWithAll;
    }

    getItemsByCategory(items) {
        let categories = [];
        for (const item of items) { // Use 'of' instead of 'in' to iterate over array elements
            if (this.state.currentCategory === "All" || item.category === this.state.currentCategory) {
                categories.push(item);
            }
        }

        return categories;
    }

    popUpItemDetails(item) {
        this.setState({showModal: true, currentItem: item});
    }

    toggleModal(show) {
        this.setState({showModal: show});
    }

    render() {
        const result = this.props.result;
        const isLoading = this.props.isLoading;

        return (
            <div style={{overflowY: 'hidden'}}>
                {result.data && result.data.constructor === Array && result.data.length > 0 &&
                    <div className="pt-3">
                        <div className='responsive'>
                            <div className='tabs ms-3'>
                                {this.getCategories(result.data).map((category) =>
                                    <MDBBtn key={category}
                                            rounded className='me-2 tab'
                                            style={{textTransform: 'none'}}
                                            color={category === this.state.currentCategory ? 'dark' : 'light'}
                                            onClick={(e) => {
                                                this.setState({currentCategory: category})
                                            }}>
                                        {category}
                                    </MDBBtn>)}
                            </div>
                        </div>

                        <div>
                            {this.getItemsByCategory(result.data).map((item) =>
                                <MDBCard className='m-3' key={item.name}
                                         onClick={() => this.popUpItemDetails(item)}>
                                    <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                                  src={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : ""}
                                                  position='top'
                                                  alt={item.name}/>
                                    <MDBCardBody>
                                        <MDBCardTitle className="text-dark">{item.name}</MDBCardTitle>
                                        <MDBCardText>
                                            {item.description}
                                        </MDBCardText>
                                    </MDBCardBody>
                                </MDBCard>)}
                        </div>
                    </div>
                }
                {result.error && <div className="text-bg-danger text-center text-light">{result.error}</div>}
                {isLoading && <LoadingComponent className="text-center"
                                                style={{marginTop: '50%'}}
                                                loadingMessage='Our chef is preparing your menu!'/>}

                {/* Popup modal to show item detail */}
                <MDBModal tabIndex='-1' open={this.state.showModal} onClose={() => this.toggleModal()}>
                    <MDBModalDialog centered scrollable>
                        <MDBModalContent>
                            <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                          src={this.state.currentItem?.imageUrls && this.state.currentItem?.imageUrls.length > 0 ? this.state.currentItem?.imageUrls[0] : ""}
                                          position='top'
                                          alt={this.state.currentItem?.name}/>
                            {/*<MDBBtn className='btn-close' color='none' onClick={() => this.toggleModal()}></MDBBtn>*/}
                            <MDBModalBody>
                                <h3 className="text-dark">{this.state.currentItem?.name}</h3>
                                <p>
                                    {this.state.currentItem?.description}
                                    <br/>
                                    <br/>
                                    <b className="text-dark">Why we recommend this?</b>
                                    <br/>
                                    {this.state.currentItem?.matchExplanation}
                                </p>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn rounded color='dark' onClick={() => this.toggleModal()}>
                                    Close
                                </MDBBtn>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </div>
        )
    }
}

export default SnapMenuResultComponent