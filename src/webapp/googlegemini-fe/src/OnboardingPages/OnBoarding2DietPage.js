import React, {Component} from 'react';


const Dietaries = ["Soft Diet", "Liquid Diet", "Low Calories", "Low Fat", "Vegan", "Vegetarian",
    "Low Sodium", "Low Sugar", "Halal", "No Beef", "No Pork", "No Red Meat"]

class OnBoarding2DietPage extends Component {

    state = {
    };

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div className="mt-5">
                </div>
                <h2 className="my-3 text-dark">Let's select your dietary if applicable</h2>
                <p className="my-4 text-dark">You can select one of multiple dietaries.</p>
                <div className="d-flex flex-wrap justify-content-between m-2 align-items-stretch"
                     style={{overflow: "auto", maxHeight: "50vh"}}>
                    {Dietaries.map((diet) =>
                        <div key={diet}
                             className=""
                             style={{width: '100%', flex: '1 1 50%', boxSizing: 'border-box', padding: '.3rem'}}>
                            <input className="btn-check" id={diet} type="checkbox" color="light"
                                   onChange={(e) => this.props.handleCheckBoxChange(e, 'userDiets')}/>
                            <label className="btn btn-light" htmlFor={diet}
                                   style={{textTransform: "none", width: '100%', height: '4rem'}}>
                                <p className="w-100 h-100" style={{alignContent: 'center'}}>{diet}</p>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default OnBoarding2DietPage;
