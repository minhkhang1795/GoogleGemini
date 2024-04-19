import React, {Component} from 'react';
import '../../fileupload.css';
import {MDBBtn} from "mdb-react-ui-kit";


class SnapMenuComponent extends Component {
    state = {
        userProfile: "love Japanese foods, lactose intolerance, gluten free, love beef and meats",
        currentCategory: "All"
    };

    componentDidMount() {
    }

    render() {
        const previewImage = this.props.previewImage;

        return (
            <div>
                <div className="file-upload-wrapper">
                    <div className="file-upload" style={{height: "70vh"}}>
                        {!previewImage && <div>
                            <div className="file-upload-message"><i
                                className="fas fa-cloud-upload-alt file-upload-cloud-icon"></i><p
                                className="file-upload-default-message">Click to snap your menu!</p><p
                                className="file-upload-main-error"></p></div>
                            <div className="file-upload-mask"></div>
                            <ul className="file-upload-errors"></ul>
                            <input type="file" id="menu-input-file" className="file-upload-input"
                                   title="Upload your menu image" accept="image/*"
                                   onChange={(e) => this.props.handleFileChange(e)}/>
                        </div>}
                        {previewImage && <div className="file-upload-previews">
                            <img src={previewImage} className="file-upload-preview-image" alt="Preview"/>
                        </div>}
                    </div>
                </div>
                <div className='text-center'>
                    <MDBBtn onClick={(e) => this.props.handleSubmitMenu(e)}>Submit</MDBBtn>
                </div>
            </div>
        )
    }
}

export default SnapMenuComponent