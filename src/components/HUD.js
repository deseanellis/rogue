import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

class HUD extends Component {
  getHealth(unit) {
    if (_.isEmpty(unit)) {
      return {
        width: '0%'
      }
    } else {
      return {
        width: `${unit.health}%`
      }
    }
  }

  render(){
    const {hero} = this.props;
    const {selectedEnemy} = this.props;
    const {floor} = this.props;


    return(
      <div className="HUD">

        <div className="player-info">
          <div className="stats health progress">
            <div className="progress-bar progress-bar-success" role="progressbar" style={this.getHealth(hero)}>
              {`Health: ${hero.health}%`}
            </div>
          </div>
          <div className="stats weapon">Weapon: {hero.weapon === null ? 'None' : hero.weapon} </div>
          <div className="stats attack">Attack: {hero.attack}</div>
          <div className="stats defense">Defense: {hero.defense}</div>
          <div className="stats level">Level: {hero.level}</div>
          <div className="stats nextLevel">Next Level: {`${hero.nextLevelExp} EXP`} </div>
        </div>

        <div className="dungeon-info">
          <div className="stats health progress">
            <div className="progress-bar progress-bar-danger" role="progressbar" style={this.getHealth(selectedEnemy)}>
              {`Health: ${(_.isEmpty(selectedEnemy)) ? '0%' : selectedEnemy.health}%`}
            </div>
          </div>
          <div className="stats name">Name: {(_.isEmpty(selectedEnemy)) ? 'None' : selectedEnemy.name}</div>
          <div className="stats attack">Attack: {(_.isEmpty(selectedEnemy)) ? 'None' : selectedEnemy.attack}</div>
          <div className="stats defense">Defense: {(_.isEmpty(selectedEnemy)) ? 'None' : selectedEnemy.defense}</div>
          <div className="stats defense">EXP Points: {(_.isEmpty(selectedEnemy)) ? 'None' : selectedEnemy.expPoints}</div>
          <div className="stats dungeon">Dungeon Floor: {floor}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return(
    {
      hero: state.dungeon.hero,
      selectedEnemy: state.dungeon.selectedEnemy,
      floor: state.dungeon.floor
    }
  );
}

export default connect(mapStateToProps)(HUD);
