import React, {Component} from 'react';


class LoadingComponent extends Component {
    state = {};

    componentDidMount() {
    }

    render() {
        return (
            <div className={this.props.className} style={this.props.style}>
                <div className="loading-container"
                     style={{width: this.props.width ? this.props.width + 'px' : '140px'}}>
                    <div className="dish">
                        <img src={require("../assets/dish.jpg")} alt="dish for loading animation"></img>
                    </div>
                    <div className="utensils">
                        <div className="fork">
                            <img src={require("../assets/fork.jpg")} alt="fork for loading animation"></img>
                        </div>
                        <div className="knife">
                            <img src={require("../assets/knife.jpg")} alt="knife for loading animation"></img>
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <p>{this.props.loadingMessage}</p>
                </div>
                <a href="https://www.vecteezy.com/free-vector/plate" style={{display: 'none'}}>
                    Plate Vectors by Vecteezy
                </a>
            </div>
        )
    }
}

export default LoadingComponent