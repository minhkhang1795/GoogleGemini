import {Component} from 'react';

import './App.css';
import MainAppPageContainer from "./MainPages/MainAppPageContainer";
import OnBoardingHolder from "./OnboardingPages/OnBoardingHolder";

class App extends Component {

    state = {
        userProfile: {}
    };

    componentDidMount() {
    }

    render() {
        return (
            <div role="main">
                {/*<OnBoardingHolder/>*/}
                <MainAppPageContainer/>
            </div>
        )
    }
}

export default App;
