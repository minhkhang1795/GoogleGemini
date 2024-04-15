import React, {Component} from 'react';
import './fileupload.css';
import {MDBBtn} from "mdb-react-ui-kit";
import * as SnapEatApi from "./SnapEatApi/SnapEatApi";

class SnapMenuComponent extends Component {
    state = {
        userProfile: "love Japanese foods, lactose intolerance, gluten free, love beef and meats",
        data: {},
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

    handleRemovePreview(event) {
        this.setState({previewImage: null});
        const formData = new FormData();
        formData.append('menuImage', this.state.previewImageFile);
        formData.append('userProfile', this.state.userProfile);
        SnapEatApi.recommend(this.previewImage).then(result => {
            this.setState({data: result});
        });
    }

    render() {
        return (
            <div>
                <div className="file-upload-wrapper">
                    <div className="file-upload" style={{height: "70vh"}}>
                        {!this.state.previewImage && <div>
                            <div className="file-upload-message"><i
                                className="fas fa-cloud-upload-alt file-upload-cloud-icon"></i><p
                                className="file-upload-default-message">Click to snap your menu!</p><p
                                className="file-upload-main-error"></p></div>
                            <div className="file-upload-mask"></div>
                            <ul className="file-upload-errors"></ul>
                            <input type="file" id="menu-input-file" className="file-upload-input"
                                   title="Upload your menu image" accept="image/*"
                                   onChange={(e) => this.handleFileChange(e)}/>
                        </div>}
                        {this.state.previewImage && <div className="file-upload-previews">
                            <img src={this.state.previewImage} className="file-upload-preview-image" alt="Preview"/>
                        </div>}
                    </div>
                </div>
                <div className='text-center'>
                    <MDBBtn onClick={(e) => this.handleRemovePreview(e)}>Submit</MDBBtn>
                </div>
            </div>
        )
    }
}

export default SnapMenuComponent