import _ from 'lodash';
import { field } from '../config/build';

export default class $$ {
  static findFloorCells(grid) {
    let arr = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j].type === 'floor') {
          arr.push([i,j]);
        }
      }
    }
    return arr;
  }

  static placePlayer(grid, roomCells) {
    let index = _.random(roomCells.length);
    let [i, j] = roomCells[index];

    grid[i][j].type = `${grid[i][j].type} player`;

    return [i, j];
  }

  static placeUnits(grid, roomCells, type) {
    let min = 0;
    let max = 0;
    let index = 0;

    switch (type) {
      case "enemy":
        [min, max] = field.ENEMY_RANGE;
        const enemyRange = _.random(min, max);

        //Build Random Enemy Locations
        for (let i = 0; i < enemyRange; i++) {
          index = _.random(roomCells.length);
          let [x, y] = roomCells[index];
          grid[x][y].type = `${grid[x][y].type} enemy`;
        }
        return grid;
      case "health":
        [min, max] = field.HEALTH_RANGE;
        const healthRange = _.random(min, max);

        //Build Random Health Locations
        for (let i = 0; i < healthRange; i++) {
          index = _.random(roomCells.length);
          let [x, y] = roomCells[index];
          grid[x][y].type = `${grid[x][y].type} health`;
        }
        return grid;
      default:

    }






    //Build Array of Random Health Locations
  }

  static movePlayer(grid, currentPosition, direction) {

    let [row, col] = currentPosition;
    switch (direction) {
      case 'ArrowLeft':
          col--;
        break;
      case 'ArrowUp':
          row--;
        break;
      case 'ArrowRight':
          col++;
        break;
      case 'ArrowDown':
          row++;
        break;
      default:
    }

    if (col < 0 || row < 0) {
      //Out of grid
      return {grid, playerPosition: currentPosition};
    } else if (grid[row][col].type !== 'floor' && grid[row][col].type !== 'door') {
      //Wall Boundary
      return {grid, playerPosition: currentPosition};
    } else {
      grid[currentPosition[0]][currentPosition[1]].type = grid[currentPosition[0]][currentPosition[1]].type.split(' ')[0];
      grid[row][col].type = `${grid[row][col].type} player`;
      return {grid, playerPosition: [row, col]};
    }
  }
}
