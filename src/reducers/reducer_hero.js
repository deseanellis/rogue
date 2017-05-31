import _ from 'lodash';

const INITIAL_STATE = {health: 100, weapon: null, level: 0, nextLevelExp: 100 };

const HeroReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ATTACK_ENEMY':
      return {...state}
    default:
      return state;

  }
}

export default HeroReducer;
