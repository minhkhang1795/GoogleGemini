import React, {Component} from 'react';
import '../fileupload.css';
import {MDBTypography} from "mdb-react-ui-kit";
import * as SnapEatApi from "../SnapEatApi/SnapEatApi";
import SnapMenuResultComponent from "./SnapMenu/ScanMenuResultComponent";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SnapMenuComponent from "./SnapMenu/SnapMenuComponent";

const SnapMenuPageEnum = {
    Snap: 'Scan',
    Result: 'Result',
}

class SnapMenuPage extends Component {
    state = {
        pageTitle: 'Scan Menu',
        userProfile: "love Japanese foods, lactose intolerance, gluten free, love beef and meats",
        currentPage: SnapMenuPageEnum.Snap,
        result: {data: [], error: ''},
        previewImage: null,
        previewImageFile: null,
    };

    componentDidMount() {
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) {
            console.log('User cancelled file upload');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.setState({previewImage: e.target.result, previewImageFile: file}); // Update preview src with new image
            console.log(e.target.result);
            console.log(this.state.previewImage);
        };

        reader.readAsDataURL(file);
    };

    handleSubmitMenu(event) {
        const formData = new FormData();
        formData.append('menuImage', this.state.previewImageFile);
        formData.append('userProfile', this.state.userProfile);
        this.setState({currentPage: SnapMenuPageEnum.Result});
        SnapEatApi.Recommend(formData).then(result => {
            this.setState({result: {data: result, error: ''}});
            this.setState({previewImage: null, previewImageFile: null});
        }).catch(ex => {
            console.log(ex);
            this.setState({result: {data: [], error: 'Server is busy right now. Please try again!'}});
        });
    }

    render() {
        return (
            <div>
                <div className='top-title'>
                    <div className='d-flex align-items-center'
                         style={{width: '100%', height: '100%', position: 'absolute'}}>
                        {this.state.currentPage === SnapMenuPageEnum.Result &&
                            <FontAwesomeIcon className='p-3 fa-lg d-flex'
                                             icon={fas.faAngleLeft}
                                             onClick={(e) => {
                                                 this.setState({currentPage: SnapMenuPageEnum.Snap})
                                             }}/>
                        }
                    </div>
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom'>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>

                {this.state.currentPage === SnapMenuPageEnum.Snap && <div>
                    <SnapMenuComponent handleFileChange={(e) => this.handleFileChange(e)}
                                       handleSubmitMenu={(e) => this.handleSubmitMenu(e)}/>
                </div>}

                {this.state.currentPage === SnapMenuPageEnum.Result && <div>
                    <SnapMenuResultComponent result={this.state.result}/>
                </div>}
            </div>
        )
    }
}

export default SnapMenuPage