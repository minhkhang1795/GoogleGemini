import React, {Component} from 'react';
import {MDBBtn} from "mdb-react-ui-kit";
import OnBoarding1WelcomePage from "./OnBoarding1WelcomePage";

class OnBoardingPageContainer extends Component {

    state = {
        userProfile: {},
        onboardingStep: 1,
    };

    componentDidMount() {
    }

    handleNextClick() {
        if (this.state.onboardingStep === 4) {
            this.props.handleFinishOnboarding(this.userProfile);
            return;
        }

        this.setState({onboardingStep: this.state.onboardingStep + 1});
    }

    getOnboardingPage() {
        if (this.state.onboardingStep === 1)
            return <OnBoarding1WelcomePage />;
        else if (this.state.onboardingStep === 2)
            return <OnBoarding1WelcomePage />;
        else if (this.state.onboardingStep === 3)
            return <OnBoarding1WelcomePage />;
        else
            return <OnBoarding1WelcomePage />;
    }

    render() {
        return (
            <div className="flex flex-column h-100 w-100 text-center p-4">
                {this.getOnboardingPage()}
                <div className="d-flex flex-row w-100 justify-content-between align-items-stretch"
                     style={{gap: "10px", position: "absolute", bottom: "0", left: "0", padding: "3rem"}}>
                    <MDBBtn outline color='dark' style={{textTransform: 'none'}}
                            onClick={() => this.props.handleSkipProfile()}>
                        Skip
                    </MDBBtn>
                    <MDBBtn color='dark' style={{textTransform: 'none'}}
                            onClick={() => this.handleNextClick()}>
                        Next
                    </MDBBtn>
                </div>
            </div>
        )
    }
}

export default OnBoardingPageContainer;
