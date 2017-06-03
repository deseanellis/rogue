import { MUSIC } from '../actions';

export const DIR = 'https://cdn.rawgit.com/deseanellis/rogue/a35f1f9a/public/audio/';

const INITIAL_STATE = {
  background: `${DIR}floors/title.mp3`
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
              background = `${DIR}floors/dungeon${action.floor}.mp3`;
            break;
          default:
            background = state.background;
        }
      } else {
        switch (action.result) {
          case 'win':
            background = `${DIR}sfx/win.mp3`;
            break;
          default:
            background = `${DIR}sfx/lose.wav`;
        }
      }
        return {...state, background}
    default:
      return state;
  }
}

export default MusicReducer;
