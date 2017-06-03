import { combineReducers } from 'redux';
import DungeonReducer from './reducer_dungeon';
import LightsReducer from './reducer_lights';
import StartReducer from './reducer_start';
import MusicReducer from './reducer_music';

const rootReducer = combineReducers({
  dungeon: DungeonReducer,
  lights: LightsReducer,
  start: StartReducer,
  music: MusicReducer
});

export default rootReducer;
