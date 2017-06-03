import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Music } from '../actions';

import Intro from './Intro';
import Dungeon from './Dungeon';
import Hints from './Hints';
import HUD from './HUD';

class App extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.start && !this.props.gameOver) {
      //Game has started, change the music
      this.props.Music(this.props.floor);
    }

    if (this.props.gameOver !== prevProps.gameOver) {
      //Play Winning or Losing Music
      if (this.props.gameOver) {
        this.props.Music(null, this.props.result);
      }

    }
  }

  render() {
    {

      let audioEl = document.getElementById('bg-music');
      audioEl.setAttribute("src", this.props.music);
      audioEl.pause();
      //Use timeout to stop React DOM Promise Error
      setTimeout(function() {
        audioEl.play();
      }, 0);

    }

    return (
      <div id="wrapper">
        {
          this.props.start &&
          <HUD  />
        }
        {
          this.props.start &&
          <Dungeon />
        }
        {
          this.props.start &&
          <Hints />
        }
        {!this.props.start && <Intro />}
      </div>
    );
  }

}

function mapStateToProps(state) {
  return(
    {
      start: state.start.game,
      floor: state.dungeon.floor,
      music: state.music.background,
      gameOver: state.dungeon.gameOver,
      result: state.dungeon.result
    }
  );
}
export default connect(mapStateToProps, { Music })(App);
