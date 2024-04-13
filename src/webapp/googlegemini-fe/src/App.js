import { Component } from 'react';

import './App.css';
import * as SnapEatApi from './SnapEatApi/SnapEatApi';

class App extends Component {

  state = {
    userProfile: {},
    data: {}
  };

  componentDidMount() {
    SnapEatApi.recommend(null).then(result => {
      this.setState({ data: result });
    });
  }

  render() {
    return (
      <div role="main">
        {this.state.data ? <p>{this.state.data.key}</p> : <p>Loading...</p>}
      </div>
    )
  }
}

export default App;
