import _ from 'lodash';
import $$ from '../functions';

import { BUILD_DUNGEON } from '../actions';
import { GRID_SIZE } from '../config';

const INITIAL_STATE = {grid: []};

const DungeonReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case BUILD_DUNGEON:
      //Initialisation of Dungeon
      let grid = $$.buildDungeon(GRID_SIZE);
      let gridRooms = $$.placeRooms(_.clone(grid));

      return {...state, grid: gridRooms }
    default:
      return state;

  }
}

export default DungeonReducer;
