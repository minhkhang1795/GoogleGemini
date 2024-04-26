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
        userProfile: {diets: new Set(), allergies: new Set(), cuisine: new Set(), users: new Set()},
        currentPage: AppPageEnum.OnBoarding,
    };

    componentDidMount() {
        caches.open('SnapEatCache')
            .then(cache => {
                cache.keys().then(keys => {
                    keys.forEach(key => {
                        cache.delete(key);
                    });
                });
            });
    }

    updateProfile() {
        this.setState({currentPage: AppPageEnum.OnBoarding});
    }

    handleSkipProfile() {
        this.setState({currentPage: AppPageEnum.MainPage});
    }

    handleFinishOnboarding(userProfile) {
        this.setState({userProfile: userProfile, currentPage: AppPageEnum.MainPage});
    }

    render() {
        return (
            <div role="main">
                {this.state.currentPage === AppPageEnum.OnBoarding &&
                    <OnBoardingHolder handleSkipProfile={() => this.handleSkipProfile()}
                                      handleFinishOnboarding={(userProfile) => this.handleFinishOnboarding(userProfile)}/>}
                {this.state.currentPage === AppPageEnum.MainPage &&
                    <MainAppPageContainer userProfile={this.state.userProfile}
                                          updateProfile={() => this.updateProfile()}/>}
            </div>
        )
    }
}

export default App;
