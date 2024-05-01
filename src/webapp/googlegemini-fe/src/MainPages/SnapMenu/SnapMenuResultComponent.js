import React, {Component} from 'react';
import '../../fileupload.css';
import LoadingComponent from "../../Utils/LoadingComponent";
import ItemPopUpModal from "../Common/ItemPopUpModal";
import ItemList from "../Common/ItemList";


class SnapMenuResultComponent extends Component {
    state = {
        showModal: false,
        currentItem: null,
    };

    componentDidMount() {
    }

    toggleModal(show) {
        this.setState({showModal: show});
    }

    popUpItemDetails(item) {
        this.setState({showModal: true, currentItem: item});
    }

    render() {
        const result = this.props.result;
        const isLoading = this.props.isLoading;

        return (
            <div style={{overflowY: 'hidden'}}>
                {result.data && result.data.constructor === Array && result.data.length > 0 &&
                    <ItemList items={result.data}
                              popUpItemDetails={(item) => this.popUpItemDetails(item)}/>}
                {result.error && <div className="text-bg-danger text-center text-light">{result.error}</div>}
                {isLoading && <LoadingComponent className="text-center"
                                                style={{marginTop: '50%'}}
                                                loadingMessage='Our chef is preparing your menu!'
                                                additionalMessages={['Just a moment while we analyze your preferences.',
                                                    'Hm, interesting tastes!',
                                                    'Your personalized recommendations are simmering away!',
                                                    'Almost there! We\'re fine-tuning your culinary matches.',
                                                    'We\'re cooking up something special based on your tastes!']}/>}

                {/* Popup modal to show item detail */}
                <ItemPopUpModal showModal={this.state.showModal}
                                toggleModal={() => this.toggleModal()}
                                currentItem={this.state.currentItem}/>
            </div>
        )
    }
}

export default SnapMenuResultComponent