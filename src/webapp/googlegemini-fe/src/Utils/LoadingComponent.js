import React, {Component} from 'react';


class LoadingComponent extends Component {
    state = {
        message: '',
    };

    componentDidMount() {
        this.setState({message: this.props.loadingMessage})
        // Start adding messages every 10 seconds
        this.interval = setInterval(() => {
            if (this.props.additionalMessages && this.props.additionalMessages.length > 0) {
                console.log(this.props.additionalMessages);
                const nextMessage = this.props.additionalMessages.shift();
                console.log(nextMessage);
                this.setState(prevState => ({
                    message: nextMessage,
                }));
            }
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className={this.props.className} style={this.props.style}>
                <div className="loading-container"
                     style={{width: this.props.width ? this.props.width + 'px' : '140px'}}>
                    <div className="fork">
                        <img src={require("../assets/fork.jpg")} alt="fork for loading animation"></img>
                    </div>
                    <div className="dish">
                        <img src={require("../assets/dish.jpg")} alt="dish for loading animation"></img>
                    </div>
                    <div className="knife">
                        <img src={require("../assets/knife.jpg")} alt="knife for loading animation"></img>
                    </div>
                </div>
                <div className='mt-3'>
                    <p>{this.state.message}</p>
                </div>
                <a href="https://www.vecteezy.com/free-vector/plate" style={{display: 'none'}}>
                    Plate Vectors by Vecteezy
                </a>
            </div>
        )
    }
}

export default LoadingComponent