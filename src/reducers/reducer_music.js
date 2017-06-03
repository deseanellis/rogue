import { MUSIC } from '../actions';

const DIR = 'audio/floors/';
const INITIAL_STATE = {
  background: `${DIR}title.mp3`
};

const MusicReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case MUSIC:
      let {background} = INITIAL_STATE;
      if (action.floor !== null) {
        switch (action.floor) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
              background = `${DIR}dungeon${action.floor}.mp3`;
            break;
          default:
            background = state.background;
        }
      } else {
        switch (action.result) {
          case 'win':
            background = 'audio/sfx/win.mp3';
            break;
          default:
            background = 'audio/sfx/lose.wav';
        }
      }
        return {...state, background}
    default:
      return state;
  }
}

export default MusicReducer;
