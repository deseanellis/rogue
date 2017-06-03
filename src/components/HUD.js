import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { BuildDungeon, Lights } from '../actions';

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

  onNewGameClick(_this) {
    _this.props.BuildDungeon();
    _this.props.Lights(false);
  }

  render(){
    const {hero} = this.props;
    const {selectedEnemy} = this.props;
    const {floor} = this.props;


    return(
      <div className="HUD">
        {this.props.gameOver ? (
          <div className="game-over">
            <img src={`images/${this.props.result ==='win' ? 'You-Win' : 'You-Lose'}.png`} alt="result"/>
            {
              this.props.result === 'win' ? (
                <div className="restart-options">
                  The Princess' sister has been capture, go to the next dungeon? This dungeon will drain you of your gained powers.
                  <button onClick={() => this.onNewGameClick(this)}>Save The Princess' Sister?</button>
                </div>
              ) : (
                <div className="restart-options">
                  The Princess has been moved to another dungeon!
                  <button onClick={() => this.onNewGameClick(this)}>Tend To Your Wounds and Save Her?</button>
                </div>
              )
            }

          </div>
        ) : (
          <div className="HUD-stats">
            <div className="player-info">
              <div className="stats health progress">
                <div className="progress-bar progress-bar-success" role="progressbar" style={this.getHealth(hero)}>
                  Hero Health
                </div>
              </div>
              <div className="stats weapon"><i className="fa fa-eyedropper"></i> <span>Weapon:</span> {hero.weapon === null ? 'None' : hero.weapon} </div>
              <div className="stats attack"><i className="fa fa-crosshairs"></i> <span>Attack:</span> {hero.attack >= 1000000 ? `\u221e` : hero.attack}</div>
              <div className="stats defense"><i className="fa fa-shield"></i> <span>Guard:</span> {hero.defense >= 1000000 ? '\u221e' : hero.defense}</div>
              <div className="stats level"><i className="fa fa-user-circle"></i> <span>Level:</span> <span className="badge">{hero.level}</span></div>
              <div className="stats nextLevel"><i className="fa fa-level-up"></i> <span>Next Level:</span> {`${hero.nextLevelExp} EXP`} </div>
            </div>

            <div className="dungeon-info">
              <div className="stats health progress">
                <div className="progress-bar progress-bar-danger" role="progressbar" style={this.getHealth(selectedEnemy)}>
                  Enemy&nbsp;Health
                </div>
              </div>
              <div className="stats name"><i className="fa fa-user-circle"></i> <span>Name:</span> {(_.isEmpty(selectedEnemy)) ? 'No Selection' : selectedEnemy.name}</div>
              <div className="stats attack"><i className="fa fa-crosshairs"></i> <span>Attack:</span> {(_.isEmpty(selectedEnemy)) ? 'No Selection' : selectedEnemy.attack}</div>
              <div className="stats defense"><i className="fa fa-shield"></i> <span>Guard:</span> {(_.isEmpty(selectedEnemy)) ? 'No Selection' : selectedEnemy.defense}</div>
              <div className="stats defense"><i className="fa fa-plus-circle"></i> <span>EXP Points:</span> {(_.isEmpty(selectedEnemy)) ? 'No Selection' : selectedEnemy.expPoints}</div>
              <div className="stats dungeon"><i className="fa fa-fort-awesome"></i> <span>Dungeon Floor:</span> <span className="badge">{floor}</span></div>
            </div>
          </div>
        )}

      </div>
    );
  }
}

function mapStateToProps(state) {
  return(
    {
      hero: state.dungeon.hero,
      selectedEnemy: state.dungeon.selectedEnemy,
      floor: state.dungeon.floor,
      gameOver: state.dungeon.gameOver,
      result: state.dungeon.result
    }
  );
}

export default connect(mapStateToProps, { BuildDungeon, Lights })(HUD);
