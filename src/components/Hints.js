import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import { Lights } from '../actions';

class Hints extends Component {
  constructor() {
    super();

    this.state = {
      message: "",
      intervalId: 0,
      lightClass: 'btn-default'
    };

    this.onClickLights = this.onClickLights.bind(this);

  }

  componentDidUpdate(prevProps) {
    if (this.props.lights !== prevProps.lights) {
      this.setState(
        {
          lightClass: !this.props.lights ? 'btn-default' : 'btn-gold'
        }
      );
    }
  }

  componentDidMount() {
    const messages = [
      "Use the direction keys to move the player throughout the dungeon.",
      "Silver blocks are shields, these add points to your current defense stat.",
      "Try to defeat all enemies, this will give you EXP to increase your level and stats.",
      "Use the light switch to reveal the entire map.",
      "Search entire floor before advancing to the next, this will help boost your player stats."
    ];

    //Set First Message on Mount
    this.scrollMessages(messages, 0);

    //Set Next Messages on delay iteration
    var _this = this;
    let index = 1;
    var intervalId = setInterval(function(){
        _this.scrollMessages(messages, index);
        ((index + 1) >= messages.length) ? index = 0 : index++;
    }, 5000);

    this.setState({
      intervalId
    });

  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    return (
      <div className="hints">
        <div className="messages">
          {this.state.message}
        </div>
        <div className="controls">
          <button
            onClick={() => this.onClickLights(this.props.lights)}
            className={`btn ${this.state.lightClass} btn-sm`}>
            <i className="fa fa-lightbulb-o"></i>
          </button>
        </div>
      </div>
    );
  }

  scrollMessages(arr, index) {
    let message = arr[index];

    this.setState({
      message
    });
  }

  onClickLights(bool) {
    let lightClass = (!bool) ? 'btn-gold' : 'btn-default';

    this.setState({
      lightClass
    });
    this.props.Lights(!bool);
  }

}

function mapStateToProps(state) {
  return(
    {
      lights: state.lights.on
    }
  );
}

export default connect(mapStateToProps, { Lights })(Hints);
