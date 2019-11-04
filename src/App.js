import React, { Component } from 'react';
import {HashRouter} from 'react-router-dom';
import MainWin from './Comps/Containers/MainWin';

import './App.css';

class App extends Component {
  render() {
    return (
      
      <HashRouter>
        <div className="App">
          <MainWin/>
        </div>
      </HashRouter>
      
    );
  }
}

export default App;
