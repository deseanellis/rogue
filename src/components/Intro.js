import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GameStart } from '../actions';

import Help from './subs/Help';

import { DIR } from '../reducers/reducer_music';

class Intro extends Component {

  constructor(props) {
    super(props);

    this.state = {
      option: 1,
      maxOptions: 2,
      showHelp: false,
      cheatCode: ""
    };

    this.handlerKeyPress = this.handlerKeyPress.bind(this);
    this.onCheatCodeChange = this.onCheatCodeChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handlerKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlerKeyPress);
  }

  onCheatCodeChange(e) {
    let cheatCode = e.target.value;
    this.setState({
      cheatCode
    });
  }

  handlerKeyPress(e) {
    let newPos = 0;
    let sfx = document.getElementById('sfx');
    var src = `${DIR}audio/sfx/select.wav`;
    console.log(src);

    //Set Audio Source
    sfx.setAttribute("src", src);

    switch (e.key) {
      case "ArrowUp":
          sfx.play();
          newPos = this.state.option - 1;
          if (newPos > 0) {
            this.setState({
              option: newPos
            });
          }
        break;
      case "ArrowDown":
        sfx.play();
        newPos = this.state.option + 1;
        if (newPos <= this.state.maxOptions) {
          this.setState({
            option: newPos
          });
        }
        break;
      case "Enter":
        if (this.state.option === 1) {
          this.props.GameStart(this.state.cheatCode);
        } else if (this.state.option === 2) {
          this.setState({
            showHelp: !this.state.showHelp
          });
        }
        break;
      default:
        return false;

    }
  }

  render(){
    return(
      <div className="title-screen">
        <img className="logo" src={`${DIR}images/Block-Dungeon.png`} alt="logo" />
        <div className="intro">
          <div className="options">
            <div
              className={`option-item ${this.state.option === 1 ? 'animated infinite flash' : ''}`}>
              <i className={`${this.state.option === 1 ? 'fa fa-caret-right' : ''}`}></i> Start Game
            </div>
            <div className={`option-item ${this.state.option === 2 ? 'animated infinite flash' : ''}`}>
              <i className={`${this.state.option === 2 ? 'fa fa-caret-right' : ''}`}></i> Controls / Help
            </div>
            <div className={`option-item`}>
               <input type="text" className="cheat-codes" onChange={(e) => this.onCheatCodeChange(e)} value={this.state.cheatCode} />
               <p className="help-block">Cheat Code</p>
            </div>
          </div>
          {this.state.showHelp && <Help />}
        </div>
      </div>
    );
  }
}

export default connect(null, { GameStart })(Intro);
