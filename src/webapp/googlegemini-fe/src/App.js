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
                    <MDBTabsPane open={this.state.fillActive === 'tab1'}>
                        <LandingPageComponent handleFillClick={(tab) => this.handleFillClick(tab)}/>
                    </MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab2'}>
                        <SnapMenuComponent/>
                    </MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab3'}>
                        <BrowseRestaurantsComponent/>
                    </MDBTabsPane>
                    <MDBTabsPane open={this.state.fillActive === 'tab4'}>
                        <UserProfileComponent/>
                    </MDBTabsPane>
                </MDBTabsContent>

                <div className='bottom-tab'>
                    <MDBTabs fill>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.fillActive === 'tab1' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleFillClick('tab1')}
                                         active={this.state.fillActive === 'tab1'}>
                                <FontAwesomeIcon className='fa-lg' icon={fas.faHouse}/>
                                {this.state.fillActive === 'tab1' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.fillActive === 'tab2' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleFillClick('tab2')}
                                         active={this.state.fillActive === 'tab2'}>
                                <FontAwesomeIcon className='fa-lg' icon={fas.faTableCellsLarge}/>
                                {this.state.fillActive === 'tab2' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.fillActive === 'tab3' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleFillClick('tab3')}
                                         active={this.state.fillActive === 'tab3'}>
                                <FontAwesomeIcon className='fa-lg' icon={fas.faMagnifyingGlass}/>
                                {this.state.fillActive === 'tab3' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.fillActive === 'tab4' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleFillClick('tab4')}
                                         active={this.state.fillActive === 'tab4'}>
                                {this.state.fillActive === 'tab4' ?
                                    <FontAwesomeIcon className='fa-lg' icon={fas.faUser}/> :
                                    <FontAwesomeIcon className='fa-lg' icon={far.faUser}/>}
                                {this.state.fillActive === 'tab4' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>
                </div>
            </div>
        )
    }
}

export default App;
