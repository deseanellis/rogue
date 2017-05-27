import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BuildDungeon } from '../actions';

class Dungeon extends Component {

  componentDidMount() {
    this.props.BuildDungeon();
  }

  render() {
    
    return(
      <div className="map">
        {this.props.dungeon.map((row, i) => {
          return (
            <div key={i} className="grid-row">
              {row.map((cell, j) => {
                return (
                  <div key={j} className={`grid-cell ${cell.type}`}></div>
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

export default connect(mapStateToProps, { BuildDungeon })(Dungeon);
