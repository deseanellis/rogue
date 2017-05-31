import _ from 'lodash';
import { field } from '../config/build';
const ENEMY_NAMES = [
    'Ninja',
    'Samurai',
    'Wizard',
    'Ghoul',
    'Warewolf',
    'Zombie',
    'Vampire',
    'Viking'
];

class Enemy {
  constructor(dungeon, id, name, x, y) {
    this.id = id;
    this.pos = [x, y];
    this.name = name;
    this.health = 100;
    this.attack = _.random((5 * dungeon),(10 * dungeon));
    this.defense = 1 + (dungeon * _.random(1,3));
    this.criticalHitRatio = 5 * dungeon;
    this.criticalHitPercent = 50;
  }
}

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

  static placeUnits(grid, dungeon = 1) {
    let min = 0;
    let max = 0;
    let index = 0;
    let range = 0;
    let roomCells = [];
    let enemies = [];

    /******************************************************
    PLACE ENEMIES, HEALTH. LADDERS
    ******************************************************/

    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place enemies first

    //--------------ENEMIES------------//

    [min, max] = field.ENEMY_RANGE; //min and max for amount of enemy units
    range = _.random(min, max);

    //Build Random Enemy Locations
    for (let i = 0; i < range; i++) {
      //Find a random location
      index = _.random(roomCells.length);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      //Make the cell an enemy cell
      grid[x][y].type = `${grid[x][y].type} enemy`;
      grid[x][y].id = i;

      //Give a random name and add necessary calculated properties
      let name = ENEMY_NAMES[_.random(0, ENEMY_NAMES.length - 1)];
      let enemy = new Enemy(dungeon, i, name, x, y);
      enemy.expPoints = (enemy.attack + enemy.defense) * 8;
      enemy.attackMax = enemy.attack + Math.round(enemy.attack * 0.20);

      //Add to enemies array
      enemies.push(enemy);
    }



    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place health after


    //--------------HEALTH------------//

    [min, max] = field.HEALTH_RANGE; //min and max for amount of health units
    range = _.random(min, max);

    //Build Random Health Locations
    for (let i = 0; i < range; i++) {
      //Find a random location
      index = _.random(roomCells.length);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      //Make the cell a health cell
      grid[x][y].type = `${grid[x][y].type} health`;
    }





    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place sheilds after


    //--------------SHIELD------------//

    [min, max] = field.SHIELD_RANGE; //min and max for amount of shield units
    range = _.random(min, max);

    //Build Random Shield Locations
    for (let i = 0; i < range; i++) {
      //Find a random location
      index = _.random(roomCells.length);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      //Make the cell a health cell
      grid[x][y].type = `${grid[x][y].type} shield`;
    }



    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place weapons after


    //--------------WEAPON------------//

      //Find a random location
      index = _.random(roomCells.length);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      //Make the cell a weapon cell, only one per floor
      grid[x][y].type = `${grid[x][y].type} weapon`;



    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place ladder after


    //--------------LADDER------------//

    //Build Random Ladder Locations
    for (let i = 0; i < field.LADDER; i++) {
      //Find a random location
      index = _.random(roomCells.length);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      //Make the cell a ladder cell
      grid[x][y].type = `${grid[x][y].type} ladder`;
    }

      //=================== ALL UNITS PLACED ===================//
      return {grid, enemies};

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
    } else if (grid[row][col].type === 'background') {
      //Wall Boundary
      return {grid, playerPosition: currentPosition};
    } else {
      let enemyRegex = new RegExp('enemy');
      let healthRegex = new RegExp('health');
      let shieldRegex = new RegExp('shield');
      let weaponRegex = new RegExp('weapon');
      let ladderRegex = new RegExp('ladder');

      let isEnemy = enemyRegex.test(grid[row][col].type);
      let isHealth = healthRegex.test(grid[row][col].type);
      let isShield = shieldRegex.test(grid[row][col].type);
      let isWeapon = weaponRegex.test(grid[row][col].type);
      let isLadder = ladderRegex.test(grid[row][col].type);

      if (isEnemy) {
        //Determine enemy attack points
        return {grid, playerPosition: [row, col], enemy: grid[row][col].id};
      }

      //Remove Player from current position
      grid[currentPosition[0]][currentPosition[1]].type = grid[currentPosition[0]][currentPosition[1]].type.split(' ')[0];

      //Clear health class and add player class
      grid[row][col].type = grid[row][col].type.split(' ')[0];
      grid[row][col].type = `${grid[row][col].type} player`;

      if (isHealth) {

        return {grid, playerPosition: [row, col], health: isHealth};
      }

      if (isShield) {

        return {grid, playerPosition: [row, col], shield: isShield};
      }

      if (isWeapon) {

        return {grid, playerPosition: [row, col], weapon: isWeapon};
      }

      if (isLadder) {

        return {grid, playerPosition: [row, col], ladder: isLadder};
      }

      return {grid, playerPosition: [row, col]};
    }
  }
}
