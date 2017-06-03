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
    switch (dungeon) {
      case 1:
        this.multiplier = 1;
        break;
      case 2:
        this.multiplier = 2;
        break;
      case 3:
        this.multiplier = 4;
        break;
      case 4:
        this.multiplier = 6;
        break;
      default:
        this.multiplier = 1;
    }

    this.id = id;
    this.pos = [x, y];
    this.name = name;
    this.health = 100;
    this.attack = _.random((8 * this.multiplier),(8 * this.multiplier)+4);
    this.defense = dungeon + (this.multiplier * _.random(4,8));
    this.criticalHitRatio = 5 * dungeon;
    this.criticalHitPercent = 50;

    if (name === 'THE BOSS') {
      this.attack = _.random(65,70);
      this.defense = _.random(65,70);
    }

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
    let index = _.random(roomCells.length -1);
    let [i, j] = roomCells[index];

    grid[i][j].type = `${grid[i][j].type} player`;

    $$.playerRadius(grid, [i, j], true);
    return [i, j];
  }

  static playerRadius(grid, playerPosition, bool) {
    var rows = grid.length;
    var cols = grid[0].length;
    let [x, y] = playerPosition;

    let radiusCells = [
      [x, y],
      [x, y-1], [x, y-2], [x, y-3],
      [x, y+1], [x, y+2], [x, y+3],

      [x-1, y],
      [x-1, y-1], [x-1, y-2], [x-1, y-3],
      [x-1, y+1], [x-1, y+2], [x-1, y+3],

      [x-2, y],
      [x-2, y-1], [x-2, y-2],
      [x-2, y+1], [x-2, y+2],

      [x-3, y],
      [x-3, y-1],
      [x-3, y+1],

      [x+1, y],
      [x+1, y-1], [x+1, y-2], [x+1, y-3],
      [x+1, y+1], [x+1, y+2], [x+1, y+3],

      [x+2, y],
      [x+2, y-1], [x+2, y-2],
      [x+2, y+1], [x+2, y+2],


      [x+3, y],
      [x+3, y+1],
      [x+3, y-1]

    ];

    radiusCells = radiusCells.filter((cell) => {
      return (cell[0] < rows && cell[0] >= 0) && (cell[1] < cols && cell[1] >= 0);
    });

    for (let i = 0; i < radiusCells.length; i++) {
      let [row, col] = radiusCells[i];
      grid[row][col].radius = bool;
    }

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

    if (dungeon === 5) {
      //If on last dungeon then place one enemy: THE BOSS
      range = 1;
    }

    //Build Random Enemy Locations
    for (let i = 0; i < range; i++) {
      //Find a random location
      index = _.random(roomCells.length -1);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      //Make the cell an enemy cell
      grid[x][y].type = `${grid[x][y].type} enemy`;
      grid[x][y].id = i;

      //Give a random name and add necessary calculated properties
      let name = ENEMY_NAMES[_.random(0, ENEMY_NAMES.length - 1)];

      if (dungeon === 5) {
        //If on last dungeon then place one enemy: THE BOSS
        name = 'THE BOSS';
      }

      let enemy = new Enemy(dungeon, i, name, x, y);
      enemy.expPoints = (enemy.attack + enemy.defense) * 8;
      enemy.attackMax = enemy.attack + Math.round(enemy.attack * 0.20);

      //Add to enemies array
      enemies.push(enemy);
    }



    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place Princess after


    //--------------PRINCESS------------//


      if (dungeon === 5) {
        // Only add Princess if the player is on the last dungeon

        //Find a random location
        index = _.random(roomCells.length -1);

        //Get coords for the selected cell
        let [x, y] = roomCells[index];

        //Place Princess
        grid[x][y].type = `${grid[x][y].type} princess`;
      }




    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place health after


    //--------------HEALTH------------//

    [min, max] = field.HEALTH_RANGE; //min and max for amount of health units
    range = _.random(min, max);

    //Build Random Health Locations
    for (let i = 0; i < range; i++) {
      //Find a random location
      index = _.random(roomCells.length -1);

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
      index = _.random(roomCells.length -1);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      //Make the cell a health cell
      grid[x][y].type = `${grid[x][y].type} shield`;
    }



    //Using Grid, find room Cells
    roomCells = this.findFloorCells(grid); //Use this to place weapons after


    //--------------WEAPON------------//

      //Find a random location
      index = _.random(roomCells.length -1);

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
      index = _.random(roomCells.length -1);

      //Get coords for the selected cell
      let [x, y] = roomCells[index];

      if (dungeon !== 5) {
        // Only add a ladder if the player is not on the last dungeon
        grid[x][y].type = `${grid[x][y].type} ladder`;
      }

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
      let princessRegex = new RegExp('princess');
      let healthRegex = new RegExp('health');
      let shieldRegex = new RegExp('shield');
      let weaponRegex = new RegExp('weapon');
      let ladderRegex = new RegExp('ladder');

      let isEnemy = enemyRegex.test(grid[row][col].type);
      let isPrincess = princessRegex.test(grid[row][col].type);
      let isHealth = healthRegex.test(grid[row][col].type);
      let isShield = shieldRegex.test(grid[row][col].type);
      let isWeapon = weaponRegex.test(grid[row][col].type);
      let isLadder = ladderRegex.test(grid[row][col].type);

      if (isEnemy) {
        //Determine enemy attack points
        return {grid, playerPosition: [row, col], enemy: grid[row][col].id};
      }

      if (isPrincess) {
        return {grid, playerPosition: [row, col], princess: isPrincess};
      }

      if (isLadder) {
        return {grid, playerPosition: [row, col], ladder: isLadder};
      }

      //Remove Player from current position
      grid[currentPosition[0]][currentPosition[1]].type = grid[currentPosition[0]][currentPosition[1]].type.split(' ')[0];

      //Clear Radius
      $$.playerRadius(grid, [currentPosition[0], currentPosition[1]], false);

      //Clear health class and add player class
      grid[row][col].type = grid[row][col].type.split(' ')[0];
      grid[row][col].type = `${grid[row][col].type} player`;

      //Add New Radius
      $$.playerRadius(grid, [row, col], true);

      if (isHealth) {

        return {grid, playerPosition: [row, col], health: isHealth};
      }

      if (isShield) {

        return {grid, playerPosition: [row, col], shield: isShield};
      }

      if (isWeapon) {

        return {grid, playerPosition: [row, col], weapon: isWeapon};
      }



      return {grid, playerPosition: [row, col]};
    }
  }
}
