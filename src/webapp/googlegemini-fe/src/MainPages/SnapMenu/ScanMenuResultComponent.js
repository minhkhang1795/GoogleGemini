import React, {Component} from 'react';
import '../../fileupload.css';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";


class SnapMenuResultComponent extends Component {
    state = {
        userProfile: "love Japanese foods, lactose intolerance, gluten free, love beef and meats",
        currentCategory: "All"
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
        let uniqueCategories = Array.from(categories);
        uniqueCategories.unshift("All"); // Add "All" to the beginning of the array

        return uniqueCategories;
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

    render() {
        const result = this.props.result;

        return (
            <div style={{overflowY: 'hidden'}}>
                {result.data && result.data.constructor === Array && result.data.length > 0 &&
                    <div className="pt-3">
                        <div className='responsive'>
                            <div className='tabs tabs-center'>
                                {this.getCategories(result.data).map((category) =>
                                    <MDBBtn key={category}
                                            rounded className='mx-2 tab'
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
                                <MDBCard className='m-3' key={item.name}>
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
                    </div>
                }
                {result.error && <div className="text-bg-danger text-center text-light">{result.error}</div>}
            </div>
        )
    }
}

export default SnapMenuResultComponent