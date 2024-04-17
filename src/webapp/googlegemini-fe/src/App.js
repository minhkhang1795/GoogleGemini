import {Component} from 'react';

import './App.css';
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
} from 'mdb-react-ui-kit';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import SnapMenuComponent from "./SnapMenuComponent";
import BrowseRestaurantsComponent from "./BrowseRestaurantsComponent";
import LandingPageComponent from "./LandingPageComponent";
import UserProfileComponent from "./UserProfileComponent";

class App extends Component {

    state = {
        fillActive: 'tab1',
        userProfile: {},
        data: {}
    };

    handleFillClick(tab) {
        if (tab === this.state.fillActive) {
            return;
        }

        this.setState({fillActive: tab});
    };

    componentDidMount() {
    }

    render() {
        return (
            <div role="main">
                <MDBTabsContent className='pb-5'>
                    <MDBTabsPane open={this.state.fillActive === 'tab1'}><LandingPageComponent/></MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab2'}><SnapMenuComponent/></MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab3'}><BrowseRestaurantsComponent/></MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab4'}><UserProfileComponent/></MDBTabsPane>
                </MDBTabsContent>

                <div style={{bottom: "0px", position: "fixed", width: "100%"}}>
                    <MDBTabs fill>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab1')}
                                         active={this.state.fillActive === 'tab1'}>
                                <FontAwesomeIcon icon={fas.faTableCellsLarge}/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab2')}
                                         active={this.state.fillActive === 'tab2'}>
                                <FontAwesomeIcon icon={fas.faHouse}/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab3')}
                                         active={this.state.fillActive === 'tab3'}>
                                <FontAwesomeIcon icon={fas.faMagnifyingGlass}/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab4')}
                                         active={this.state.fillActive === 'tab4'}>
                                {this.state.fillActive === 'tab4' ? <FontAwesomeIcon icon={fas.faUser}/> :
                                    <FontAwesomeIcon icon={far.faUser}/>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>
                </div>
            </div>
        )
    }
}

export default App;
