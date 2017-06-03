import { START } from '../actions';

const INITIAL_STATE = {
  game: false,
  cheatCode: null
};

const StartReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case START:
      return {...state, game: true, cheatCode: action.payload}
    default:
      return state;

  }
}

export default StartReducer;
