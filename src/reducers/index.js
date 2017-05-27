import { combineReducers } from 'redux';
import DungeonReducer from './reducer_dungeon';

const rootReducer = combineReducers({
  dungeon: DungeonReducer
});

export default rootReducer;
