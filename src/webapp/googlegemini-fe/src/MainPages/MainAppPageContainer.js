import {Component} from 'react';

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
import SnapMenuPage from "./SnapMenuPage";
import BrowseRestaurantsPage from "./BrowseRestaurantsPage";
import LandingPage from "./LandingPage";
import UserProfilePage from "./UserProfilePage";

class MainAppPageContainer extends Component {

    state = {
        activeTab: 'tab1',
    };

    handleTabChange(tab) {
        if (tab === this.state.activeTab) {
            return;
        }

        this.setState({activeTab: tab});
    };

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <MDBTabsContent className='pb-5'>
                    <MDBTabsPane open={this.state.activeTab === 'tab1'}>
                        <LandingPage handleLandingTabs={(tab) => this.handleTabChange(tab)}/>
                    </MDBTabsPane>
                    <MDBTabsPane open={this.state.activeTab === 'tab2'}>
                        <SnapMenuPage userProfile={this.props.userProfile}/>
                    </MDBTabsPane>
                    <MDBTabsPane open={this.state.activeTab === 'tab3'}>
                        <BrowseRestaurantsPage userProfile={this.props.userProfile}/>
                    </MDBTabsPane>
                    <MDBTabsPane open={this.state.activeTab === 'tab4'}>
                        <UserProfilePage userProfile={this.props.userProfile}/>
                    </MDBTabsPane>
                </MDBTabsContent>

                <div className='bottom-tab'>
                    <MDBTabs fill>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.activeTab === 'tab1' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleTabChange('tab1')}
                                         active={this.state.activeTab === 'tab1'}>
                                <FontAwesomeIcon className='fa-lg' icon={fas.faHouse}/>
                                {this.state.activeTab === 'tab1' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.activeTab === 'tab2' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleTabChange('tab2')}
                                         active={this.state.activeTab === 'tab2'}>
                                <FontAwesomeIcon className='fa-lg' icon={fas.faCamera}/>
                                {this.state.activeTab === 'tab2' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.activeTab === 'tab3' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleTabChange('tab3')}
                                         active={this.state.activeTab === 'tab3'}>
                                <FontAwesomeIcon className='fa-lg' icon={fas.faMagnifyingGlass}/>
                                {this.state.activeTab === 'tab3' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem style={{backgroundColor: 'white'}}>
                            <MDBTabsLink className={this.state.activeTab === 'tab4' ? 'text-black' : 'text-body'}
                                         style={{borderBottom: 'none'}}
                                         onClick={() => this.handleTabChange('tab4')}
                                         active={this.state.activeTab === 'tab4'}>
                                {this.state.activeTab === 'tab4' ?
                                    <FontAwesomeIcon className='fa-lg' icon={fas.faUser}/> :
                                    <FontAwesomeIcon className='fa-lg' icon={far.faUser}/>}
                                {this.state.activeTab === 'tab4' && <div className="dot"></div>}
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>
                </div>
            </div>
        )
    }
}

export default MainAppPageContainer;
