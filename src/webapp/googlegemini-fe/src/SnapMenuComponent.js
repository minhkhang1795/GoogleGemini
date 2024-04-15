import React, {Component} from 'react';
import './fileupload.css';

class SnapMenuComponent extends Component {
    state = {
        userProfile: {},
        data: {},
        previewImage: {},
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
            const preview = document.createElement('div');
            preview.classList.add('file-upload-preview');

            // Add remove button
            const removeButton = document.createElement('div');
            removeButton.classList.add('file-upload-remove');
            removeButton.innerHTML = '<i class="fas fa-times"></i>';
            removeButton.addEventListener('click', () => {
                preview.remove();
                document.getElementById('menu-input-file').value = '';
            });
            preview.appendChild(removeButton);

            // Add preview image
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('file-upload-preview-image');
            preview.appendChild(img);

            document.querySelector('.file-upload-previews').appendChild(preview);
        };

        reader.readAsDataURL(file);
    };

    render() {
        return (
            <div>
                <div className="file-upload-wrapper">
                    <div className="file-upload" style={{height: "70vh"}}>
                        <div className="file-upload-message"><i
                            className="fas fa-cloud-upload-alt file-upload-cloud-icon"></i><p
                            className="file-upload-default-message">Click to snap your menu!</p><p
                            className="file-upload-main-error"></p></div>
                        <div className="file-upload-mask"></div>
                        <ul className="file-upload-errors"></ul>
                        <input type="file" id="menu-input-file" className="file-upload-input"
                               title="Upload your menu image" accept="image/*"
                               onChange={this.handleFileChange}/>
                        <div className="file-upload-previews"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SnapMenuComponent

