import React, {Component} from 'react';
import {ReactComponent as Burger} from '../assets/burger.svg';
import {ReactComponent as Pizza} from '../assets/pizza.svg';
import {ReactComponent as IceCream} from '../assets/ice cream.svg';
import {ReactComponent as Donut} from '../assets/donut.svg';
import {ReactComponent as FrenchFries} from '../assets/french fries.svg';
import {ReactComponent as Cake} from '../assets/cake.svg';

class OnBoarding1WelcomePage extends Component {

    state = {
        userProfile: {}
    };

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div className="mt-5">
                </div>
                <h1 className="my-3 text-dark">Build your foodie profile</h1>
                <p className="my-4 text-dark">Let's build your food preferences to personalize your recommendation.</p>
                <div className="d-flex flex-column align-items-stretch" style={{gap: "10px"}}>
                    <div className="d-flex justify-content-center align-items-center flex-row flex-grow-1"
                         style={{gap: "11px"}}>
                        <Burger/>
                        <IceCream/>
                        <Donut/>
                    </div>
                    <div className="d-flex justify-content-center align-items-center flex-row flex-grow-1"
                         style={{gap: "10px"}}>
                        <Pizza/>
                        <FrenchFries/>
                    </div>
                    <div className="d-flex justify-content-center align-items-center flex-row flex-grow-1"
                         style={{gap: "12px"}}>
                        <Cake/>
                    </div>
                </div>
            </div>
        )
    }
}

export default OnBoarding1WelcomePage;
