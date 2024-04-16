import {Component} from 'react';

import './App.css';
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBIcon,
    MDBTypography
} from 'mdb-react-ui-kit';
import * as SnapEatApi from './SnapEatApi/SnapEatApi';
import SnapMenuComponent from "./SnapMenuComponent";
import BrowseRestaurantsComponent from "./BrowseRestaurantsComponent";

class App extends Component {

    state = {
        pageTitle: 'Scan Menu',
        fillActive: 'tab1',
        userProfile: {},
        data: {}
    };

    handleFillClick(tab, pageTitle) {
        if (tab === this.state.fillActive) {
            return;
        }

        this.setState({fillActive: tab, pageTitle: pageTitle});
    };

    componentDidMount() {
    }

    render() {
        return (
            <div role="main">
                <div className='text-center'>
                    <MDBTypography tag='div' className='display-6 p-3 border-bottom'>
                        {this.state.pageTitle}
                    </MDBTypography>
                </div>

                <MDBTabsContent className='pb-7'>
                    <MDBTabsPane open={this.state.fillActive === 'tab1'}><SnapMenuComponent/></MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab2'}><BrowseRestaurantsComponent/></MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab3'}>Profile</MDBTabsPane>
                </MDBTabsContent>

                <div style={{bottom: "0px", position: "fixed", width: "100%"}}>
                    <MDBTabs fill>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab1', 'Scan Menu')}
                                         active={this.state.fillActive === 'tab1'}>
                                <MDBIcon fas icon='camera' className='me-2'/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab2', 'Browse Restaurants')}
                                         active={this.state.fillActive === 'tab2'}>
                                <MDBIcon fas icon='search' className='me-2'/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab3', 'Profile')}
                                         active={this.state.fillActive === 'tab3'}>
                                <MDBIcon fas icon='user' className='me-2'/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>
                </div>
            </div>
        )
    }
}

export default App;
