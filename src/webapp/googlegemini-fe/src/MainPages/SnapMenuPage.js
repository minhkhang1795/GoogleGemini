import React, {Component} from 'react';
import '../fileupload.css';
import {MDBTypography} from "mdb-react-ui-kit";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as SnapEatApi from "../SnapEatApi/ApiWrapper";
import SnapMenuResultComponent from "./SnapMenu/SnapMenuResultComponent";
import SnapMenuUploadAndPreviewComponent from "./SnapMenu/SnapMenuUploadAndPreviewComponent";
import {IsNonEmptyArray} from "../Utils/Utils";

const SnapMenuPageEnum = {
    Snap: 'Snap',
    Result: 'Result',
}

class SnapMenuPage extends Component {
    state = {
        pageTitle: 'Snap Menu',
        currentPage: SnapMenuPageEnum.Snap,
        result: {data: [], error: '', isLoading: false},
        previewImage: null,
        previewImageFile: null,
        showLoading: false,
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
            this.setState({previewImage: e.target.result, previewImageFile: file});
            console.log(e.target.result);
            console.log(this.state.previewImage);
        };

        reader.readAsDataURL(file);
    };

    handleSubmitMenu(event) {
        const formData = new FormData();
        formData.append('menuImage', this.state.previewImageFile);
        formData.append('userProfile', JSON.stringify(this.props.userProfile));
        this.setState({showLoading: true, currentPage: SnapMenuPageEnum.Result});
        this.setState({previewImage: null, previewImageFile: null});
        if (this.state.result.isLoading) {
            this.setState({result: {data: [], error: 'Please wait until your previous request to complete before sending a new one.', isLoading: true}});
            return;
        }

        this.setState({result: {data: [], error: '', isLoading: true}});
        SnapEatApi.Recommend(formData).then(data => {
            if (this.state.currentPage === SnapMenuPageEnum.Snap) {
                console.log('User goes back to Snap page, ignore the data.')
                this.setState({result: {data: [], error: '', isLoading: false}});
                return;
            }

            console.log(data)
            if (data && IsNonEmptyArray(data.result)) {
                this.setState({result: {data: data.result, error: '', isLoading: false}});
                return;
            }

            let error = data && data.error ? data.error : 'Server is busy right now. Please try again!';
            this.setState({result: {data: [], error: error, isLoading: false}});
        }).catch(ex => {
            console.log(ex);
            this.setState({result: {data: [], error: 'Server is busy right now. Please try again!', isLoading: false}});
        });
    }

    handleCancelMenu(event) {
        this.setState({previewImage: null, previewImageFile: null});
    }

    render() {
        return (
            <div>
                <div className='top-title'>
                    {/* Back button */}
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
                    <MDBTypography tag='div' className='text-center display-6 p-3 border-bottom text-dark'
                                   style={{fontWeight: '700'}}>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>

                {this.state.currentPage === SnapMenuPageEnum.Snap && <div>
                    <SnapMenuUploadAndPreviewComponent previewImage={this.state.previewImage}
                                                       pageTitle={this.state.pageTitle}
                                                       handleFileChange={(e) => this.handleFileChange(e)}
                                                       handleSubmitMenu={(e) => this.handleSubmitMenu(e)}
                                                       handleCancelMenu={(e) => this.handleCancelMenu(e)}/>
                </div>}

                {this.state.currentPage === SnapMenuPageEnum.Result && <div>
                    <SnapMenuResultComponent result={this.state.result}
                                             isLoading={this.state.result.isLoading}/>
                </div>}
            </div>
        )
    }
}

export default SnapMenuPage