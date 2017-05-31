import _ from 'lodash';
import { generateDungeon } from '../config/build';
import $$ from '../functions';

import { BUILD_DUNGEON, MOVE_PLAYER } from '../actions';

const INITIAL_STATE = {grid: [], playerPosition: []};

const DungeonReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case BUILD_DUNGEON:
      //Initialisation of Dungeon
      let grid = generateDungeon();
      //Place player on grid
      let playerPosition = $$.placePlayer(grid,  $$.findFloorCells(grid));
      let placeEnemies = $$.placeUnits(grid, $$.findFloorCells(grid), 'enemy');
      $$.placeUnits(grid, $$.findFloorCells(placeEnemies), 'health');
      return {...state, grid, playerPosition}
    case MOVE_PLAYER:
      let movedState = $$.movePlayer(_.clone(state.grid), state.playerPosition, action.payload);
      console.log(movedState);
      return {...state, grid: movedState.grid, playerPosition: movedState.playerPosition}
    default:
      return state;

  }
}

export default DungeonReducer;
