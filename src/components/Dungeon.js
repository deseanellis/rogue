import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { BuildDungeon, MovePlayer, ViewEnemy } from '../actions';

class Dungeon extends Component {

  constructor() {
    super();

    this.handlerKeyPress = this.handlerKeyPress.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.gameOver) {
      this.props.BuildDungeon();
    }

    if (this.props.floor !== prevProps.floor) {
      this.props.BuildDungeon(this.props.floor);
    }
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

  onCellClick(cell) {
    let regex = new RegExp("enemy");
    if (regex.test(cell.type)) {
      this.props.ViewEnemy(cell.id);
    }
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
                  <div
                    key={j}
                    style={{opacity: cell.opacity}}
                    className={`grid-cell ${cell.type}`}
                    onClick={() => this.onCellClick(cell)}
                  ></div>
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
    dungeon: state.dungeon.grid,
    gameOver: state.dungeon.gameOver,
    floor: state.dungeon.floor
  }
}

export default connect(mapStateToProps, { BuildDungeon, MovePlayer, ViewEnemy })(Dungeon);
