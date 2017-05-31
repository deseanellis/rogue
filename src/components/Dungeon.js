import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { BuildDungeon, MovePlayer } from '../actions';

class Dungeon extends Component {

  constructor() {
    super();

    this.handlerKeyPress = this.handlerKeyPress.bind(this);
  }

  componentDidMount() {
    this.props.BuildDungeon();
    window.addEventListener('keydown', _.throttle(this.handlerKeyPress, 100));
  }

  componentWillUnmount() {
		window.removeEventListener('keydown', _.throttle(this.handlerKeyPress, 100));
	}

  handlerKeyPress(e) {
    this.props.MovePlayer(e.key);
  }

  render() {
    let { dungeon } = this.props;
    return(
      <div className="map">
        {dungeon.map((row, i) => {
          return (
            <div key={i} className="grid-row">
              {row.map((cell, j) => {
                return (
                  <div key={j} style={{opacity: cell.opacity}} className={`grid-cell ${cell.type}`}></div>
                )
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dungeon: state.dungeon.grid
  }
}

export default connect(mapStateToProps, { BuildDungeon, MovePlayer })(Dungeon);
