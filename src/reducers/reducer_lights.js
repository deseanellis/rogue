import { LIGHTS } from '../actions';

const INITIAL_STATE = {
  on: false
};

const LightsReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case LIGHTS:
      return {...state, on: action.payload}
    default:
      return state;
  }
}

export default LightsReducer;
