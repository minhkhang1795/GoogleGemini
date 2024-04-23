import React, {Component} from 'react';
import {MDBBtn} from "mdb-react-ui-kit";
import OnBoarding1WelcomePage from "./OnBoarding1WelcomePage";
import OnBoarding2DietPage from "./OnBoarding2DietPage";
import OnBoarding3AllergyPage from "./OnBoarding3AllergyPage";
import OnBoarding5FlavorPage from "./OnBoarding5FlavorPage";
import OnBoarding4CuisinePage from "./OnBoarding4CusinePage";

class OnBoardingPageContainer extends Component {

    state = {
        userDiets: new Set(),
        userAllergies: new Set(),
        userCuisines: new Set(),
        userFlavors: new Set(),
        onboardingStep: 1,
    };

    componentDidMount() {
    }

    getOnboardingPage() {
        if (this.state.onboardingStep === 1)
            return <OnBoarding1WelcomePage/>;
        if (this.state.onboardingStep === 2)
            return <OnBoarding2DietPage
                handleCheckBoxChange={(e, listName) => this.handleCheckBoxChange(e, listName)}/>;
        if (this.state.onboardingStep === 3)
            return <OnBoarding3AllergyPage
                handleCheckBoxChange={(e, listName) => this.handleCheckBoxChange(e, listName)}/>;
        if (this.state.onboardingStep === 4)
            return <OnBoarding4CuisinePage
                handleCheckBoxChange={(e, listName) => this.handleCheckBoxChange(e, listName)}/>;

        return <OnBoarding5FlavorPage
            handleCheckBoxChange={(e, listName) => this.handleCheckBoxChange(e, listName)}/>;
    }

    handleNextClick() {
        if (this.state.onboardingStep === 5) {
            let userProfile =
                    {
                        diets: this.state.userDiets,
                        allergies: this.state.userAllergies,
                        cuisines: this.state.userCuisines,
                        flavors: this.state.userFlavors,
                    };
            this.props.handleFinishOnboarding(userProfile);
            console.log(this.state);
            return;
        }

        this.setState({onboardingStep: this.state.onboardingStep + 1});
        console.log(this.state);
    }

    handleCheckBoxChange(e, setName) {
        let item = e.target.id;
        console.log(setName);
        if (e.target.checked) {
            this.setState(prevState => {
                const newSet = new Set(prevState[setName]);
                newSet.add(item);
                return {[setName]: newSet};
            });
        } else {
            this.setState(prevState => {
                const newSet = new Set(prevState[setName]);
                newSet.delete(item);
                return {[setName]: newSet};
            });
        }
    }

    shouldDisableSkip() {
        return this.state.onboardingStep !== 1;
    }

    shouldDisableNext() {
        return this.state.onboardingStep >= 4 && this.getItemCount() < 3;
    }

    getItemCount() {
        if (this.state.onboardingStep === 2)
            return this.state.userDiets.size;
        if (this.state.onboardingStep === 3)
            return this.state.userAllergies.size;
        if (this.state.onboardingStep === 4)
            return this.state.userCuisines.size;
        if (this.state.onboardingStep === 5)
            return this.state.userFlavors.size;

        return 0;
    }

    render() {
        return (
            <div className="flex flex-column h-100 w-100 text-center p-4">
                {this.getOnboardingPage()}
                <div className="d-flex flex-row w-100 justify-content-between align-items-stretch"
                     style={{gap: "10px", position: "absolute", bottom: "0", left: "0", padding: "3rem"}}>
                    <p className="m-0 align-self-center"
                       style={{position: 'absolute', opacity: `${this.shouldDisableNext() ? "1" : "0"}`, zIndex: 0}}>
                        {this.getItemCount()} of 3 selected
                    </p>
                    <MDBBtn outline rounded color='dark'
                            style={{
                                textTransform: 'none',
                                opacity: `${this.shouldDisableSkip() ? "0" : "1"}`,
                                zIndex: 1
                            }}
                            disabled={this.shouldDisableSkip()}
                            onClick={() => this.props.handleSkipProfile()}>
                        Skip
                    </MDBBtn>
                    <MDBBtn rounded color='dark' style={{textTransform: 'none'}}
                            disabled={this.shouldDisableNext()}
                            onClick={() => this.handleNextClick()}>
                        Next
                    </MDBBtn>
                </div>
            </div>
        )
    }
}

export default OnBoardingPageContainer;
