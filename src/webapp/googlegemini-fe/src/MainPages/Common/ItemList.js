import React, {Component} from 'react';
import {
    MDBBtn, MDBCard, MDBCardBody,
    MDBCardImage, MDBCardText, MDBCardTitle,
} from "mdb-react-ui-kit";
import {GenerateRandomId} from "../../Utils/Utils";

class ItemList extends Component {
    state = {
        currentCategory: "All",
        categories: [],
        id: GenerateRandomId(),
    };

    componentDidMount() {
        this.setState({categories: this.getCategories(this.props.items)});
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

    changeTab(tab) {
        this.setState({currentCategory: tab}, () => {
            if (tab === this.state.categories[0]) {
                // Scroll tab to start
                const tabContainer = document.getElementById(this.state.id);
                tabContainer.scrollLeft = 0;
            } else if (tab === this.state.categories[this.state.categories.length - 1]) {
                // Scroll tab to end
                const tabContainer = document.getElementById(this.state.id);
                tabContainer.scrollLeft = tabContainer.scrollWidth;
            }
        });
    }

    render() {
        const items = this.props.items;

        return (
            <div className="pt-3">
                <div className='responsive' id={this.state.id}>
                    <div className='tabs ms-3'>
                        {this.state.categories.map((category) =>
                            <MDBBtn key={category}
                                    rounded className='me-2 tab'
                                    style={{textTransform: 'capitalize'}}
                                    color={category === this.state.currentCategory ? 'dark' : 'light'}
                                    onClick={() => this.changeTab(category)}>
                                {category}
                            </MDBBtn>)}
                    </div>
                </div>

                <div>
                    {this.getItemsByCategory(items).map((item) =>
                        <MDBCard className='m-3' key={item.name}
                                 onClick={() => this.props.popUpItemDetails(item)}>
                            <MDBCardImage style={{maxHeight: '30vh', objectFit: 'cover'}}
                                          src={item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : ""}
                                          position='top'
                                          alt={item.name}/>
                            <MDBCardBody>
                                <MDBCardTitle className="text-dark" style={{textTransform: 'capitalize'}}>{item.name?.toLowerCase()}</MDBCardTitle>
                                <MDBCardText>
                                    {item.description}
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>)}
                </div>
            </div>
        )
    }
}

export default ItemList