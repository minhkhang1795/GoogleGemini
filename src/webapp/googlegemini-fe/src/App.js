import {Component} from 'react';

import './App.css';
import MainAppPageContainer from "./MainPages/MainAppPageContainer";
import OnBoardingHolder from "./OnboardingPages/OnBoardingHolder";

const AppPageEnum = {
    OnBoarding: 'OnBoarding',
    MainPage: 'MainPage',
}
class App extends Component {

    state = {
        userProfile: {},
        currentPage: AppPageEnum.OnBoarding,
    };

    componentDidMount() {
    }

    handleSkipProfile() {
        console.log("here")
        this.setState({userProfile: {}, currentPage: AppPageEnum.MainPage});
    }

    handleFinishOnboarding(userProfile) {
        this.setState({userProfile: userProfile, currentPage: AppPageEnum.MainPage});
        console.log("User profile: " + userProfile);
    }

    render() {
        return (
            <div role="main">
                {this.state.currentPage === AppPageEnum.OnBoarding &&
                    <OnBoardingHolder handleSkipProfile={() => this.handleSkipProfile()}
                                      handleFinishOnboarding={(userProfile) => this.handleFinishOnboarding(userProfile)}/>}
                {this.state.currentPage === AppPageEnum.MainPage &&
                    <MainAppPageContainer/>}
            </div>
        )
    }
}

export default App;
