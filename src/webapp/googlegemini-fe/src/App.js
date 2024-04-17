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
                    <MDBTabsPane open={this.state.fillActive === 'tab1'}><SnapMenuComponent/></MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab2'}><BrowseRestaurantsComponent/></MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab3'}>Profile</MDBTabsPane>
                </MDBTabsContent>

                <div style={{bottom: "0px", position: "fixed", width: "100%"}}>
                    <MDBTabs fill>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab1')}
                                         active={this.state.fillActive === 'tab1'}>
                                <MDBIcon fas icon='camera' className='me-2'/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab2')}
                                         active={this.state.fillActive === 'tab2'}>
                                <MDBIcon fas icon='search' className='me-2'/>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink onClick={() => this.handleFillClick('tab3')}
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
