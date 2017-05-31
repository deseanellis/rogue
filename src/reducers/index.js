import { combineReducers } from 'redux';
import DungeonReducer from './reducer_dungeon';
import HeroReducer from './reducer_hero';

const rootReducer = combineReducers({
  dungeon: DungeonReducer,
  hero: HeroReducer
});

export default rootReducer;
