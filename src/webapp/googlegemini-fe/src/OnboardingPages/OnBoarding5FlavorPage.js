import React, {Component} from 'react';


const Flavors = ["BBQ", "Cheesy", "Spicy", "Less Spicy", "Herbal", "Fatty", "Sweet", "Less Sweet", "Salty",
    "Less Salty", "Peppery", "Smoky", "Sour", "Bitter", "Umami", "Tart", "Zesty", "Creamy", "Floral", "Aromatic",
    "Citrusy", "Fruity"]

class OnBoarding5FlavorPage extends Component {

    state = {
    };

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div className="mt-5">
                </div>
                <h2 className="my-3 text-dark">What are your preferred food flavors?</h2>
                <p className="my-4 text-dark">Please select three or more to proceed.</p>
                <div className="d-flex flex-wrap justify-content-between m-2 align-items-stretch"
                     style={{overflow: "auto", maxHeight: "50vh"}}>
                    {Flavors.map((diet) =>
                        <div key={diet}
                             className=""
                             style={{width: '100%', flex: '1 1 50%', boxSizing: 'border-box', padding: '.3rem'}}>
                            <input className="btn-check" id={diet} type="checkbox" color="light"
                                   onChange={(e) => this.props.handleCheckBoxChange(e, 'userFlavors')}/>
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

export default OnBoarding5FlavorPage;
