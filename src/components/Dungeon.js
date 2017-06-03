import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { BuildDungeon, MovePlayer, ViewEnemy, ApplyCheatCode } from '../actions';

class Dungeon extends Component {

  constructor() {
    super();
    this.state = {
      lights: {
        backgroundColor: 'black',
        borderColor: 'black'
      }
    };

    this.handlerKeyPress = this.handlerKeyPress.bind(this);
  }

  componentDidUpdate(prevProps) {

    if (this.props.floor !== prevProps.floor) {
      this.props.BuildDungeon(this.props.floor);
    }

    if (this.props.lights !== prevProps.lights) {
      let color = this.props.lights ? '' : 'black';
      this.setState({
        lights: {
          backgroundColor: color,
          borderColor: color
        }
      });

    }
  }

  componentDidMount() {
    this.props.BuildDungeon();
    this.props.ApplyCheatCode(this.props.cheatCode);
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
                    style={cell.radius ? {} : this.state.lights}
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
    floor: state.dungeon.floor,
    lights: state.lights.on,
    cheatCode: state.start.cheatCode
  }
}

export default connect(mapStateToProps, { BuildDungeon, MovePlayer, ViewEnemy, ApplyCheatCode })(Dungeon);
