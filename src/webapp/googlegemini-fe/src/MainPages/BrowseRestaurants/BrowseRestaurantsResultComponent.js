import React, {Component} from 'react';
import '../../fileupload.css';
import LoadingComponent from "../../Utils/LoadingComponent";
import * as SnapEatApi from "../../SnapEatApi/ApiWrapper";
import {IsArray, IsNonEmptyArray} from "../../Utils/Utils";
import {FilterItems} from "../../SnapEatApi/ApiUtils";
import ItemPopUpModal from "../Common/ItemPopUpModal";
import ItemList from "../Common/ItemList";


class BrowseRestaurantsResultComponent extends Component {
    state = {
        currentCategory: "All",
        showModal: false,
        currentItem: null,
    };

    componentDidMount() {
        let id = this.props.restaurantId;
        if (!id) {
            console.log('Unexpected error when retrieving menu from restaurant');
            return;
        }

        // Get recommendation from cache
        console.log(this.props.restaurantDetailsCache);
        if (id in this.props.restaurantDetailsCache &&
            IsArray(this.props.restaurantDetailsCache[id]?.data)) {
            return;
        }

        // Call to get recommendation results
        this.props.updateRestaurantDetailsCache({data: [], error: '', isLoading: true})
        SnapEatApi.RecommendByRestaurant(id, JSON.stringify(this.props.userProfile)).then(data => {
            console.log(data);
            if (data && IsNonEmptyArray(data.result)) {
                this.props.updateRestaurantDetailsCache(id, {
                    data: FilterItems(data.result),
                    error: '',
                    isLoading: false
                })
                return;
            }

            let error = data && data.error ? data.error : 'Server is busy right now. Please try again!';
            this.props.updateRestaurantDetailsCache(id,
                {data: [], error: error, errorCode: data.errorCode, isLoading: false});
        }).catch(ex => {
            console.log(ex);
            this.props.updateRestaurantDetailsCache(id,
                {data: [], error: 'Server is busy right now. Please try again!', isLoading: false});
        });
    }

    getRestaurantResult() {
        if (this.props.restaurantId in this.props.restaurantDetailsCache) {
            return this.props.restaurantDetailsCache[this.props.restaurantId];
        } else {
            return {data: [], error: '', isLoading: true};
        }
    }

    popUpItemDetails(item) {
        this.setState({showModal: true, currentItem: item});
    }

    toggleModal(show) {
        this.setState({showModal: show});
    }

    render() {
        const result = this.getRestaurantResult();
        const isLoading = this.getRestaurantResult().isLoading;

        return (
            <div style={{overflowY: 'hidden'}}>
                {result.data && result.data.constructor === Array && result.data.length > 0 &&
                    <ItemList items={result.data}
                              popUpItemDetails={(item) => this.popUpItemDetails(item)}/>}
                {result.error && <div className="text-bg-danger text-center text-light">
                    {result.error}
                </div>}

                {result.errorCode === "NoMenu" && <div>
                    <div className="file-upload-wrapper">
                        <div className="file-upload p-5" style={{height: "70vh"}}>
                            <div className='w-100 h-100' style={{border: '2px dotted #000'}}>
                                <div className="file-upload-message">
                                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="50" fill="#E4E6E7"/>
                                        <path
                                            d="M28.585 32.4156V26.1818H32.8538V32.4156H39.257V36.5714H32.8538V42.8052H28.585V36.5714H22.1819V32.4156H28.585ZM34.9882 44.8831V38.6494H41.3914V32.4156H56.3321L60.238 36.5714H67.004C69.3518 36.5714 71.2728 38.4416 71.2728 40.7273V65.6623C71.2728 67.9481 69.3518 69.8182 67.004 69.8182H32.8538C30.506 69.8182 28.585 67.9481 28.585 65.6623V44.8831H34.9882ZM49.9289 63.5844C55.8198 63.5844 60.6009 58.9299 60.6009 53.1948C60.6009 47.4597 55.8198 42.8052 49.9289 42.8052C44.038 42.8052 39.257 47.4597 39.257 53.1948C39.257 58.9299 44.038 63.5844 49.9289 63.5844ZM43.0989 53.1948C43.0989 56.8727 46.1511 59.8442 49.9289 59.8442C53.7068 59.8442 56.759 56.8727 56.759 53.1948C56.759 49.5169 53.7068 46.5455 49.9289 46.5455C46.1511 46.5455 43.0989 49.5169 43.0989 53.1948Z"
                                            fill="#AFB4B6"/>
                                    </svg>
                                    <p className="pt-3 file-upload-default-message">Add Photo</p>
                                    <p className="file-upload-main-error"></p></div>
                                <ul className="file-upload-errors"></ul>
                                <input type="file" id="menu-input-file" className="file-upload-input"
                                       title="Upload your menu image" accept="image/*"/>
                            </div>
                        </div>
                    </div>
                </div>}

                {isLoading && <LoadingComponent className="text-center"
                                                style={{marginTop: '50%'}}
                                                loadingMessage='Our chef is preparing your menu!'/>}

                {/* Popup modal to show item detail */}
                <ItemPopUpModal showModal={this.state.showModal}
                                toggleModal={() => this.toggleModal()}
                                currentItem={this.state.currentItem}/>
            </div>
        )
    }
}

export default BrowseRestaurantsResultComponent