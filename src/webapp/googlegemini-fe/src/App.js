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
        this.setState({userProfile: {}, currentPage: AppPageEnum.MainPage});
    }

    handleFinishOnboarding(userProfile) {
        this.setState({userProfile: userProfile, currentPage: AppPageEnum.MainPage});
    }

    render() {
        return (
            <div role="main">
                {this.state.currentPage === AppPageEnum.OnBoarding &&
                    <OnBoardingHolder handleSkipProfile={() => this.handleSkipProfile()}
                                      handleFinishOnboarding={() => this.handleFinishOnboarding()}/>}
                {this.state.currentPage === AppPageEnum.MainPage &&
                    <MainAppPageContainer/>}
            </div>
        )
    }
}

export default App;
