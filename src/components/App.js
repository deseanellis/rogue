import React, { Component } from 'react';
import Dungeon from './Dungeon';
import HUD from './HUD';

class App extends Component {

  render() {
    return (
      <div id="wrapper">
          <HUD />
          <Dungeon  />
      </div>
    );
  }
}

export default App;
