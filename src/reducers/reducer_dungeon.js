import _ from 'lodash';
import { generateDungeon } from '../config/build';

import { field } from '../config/build';
import $$ from '../functions';

import { BUILD_DUNGEON, MOVE_PLAYER, VIEW_ENEMY } from '../actions';

const INITIAL_STATE = {
  grid: [],
  playerPosition: [],
  enemies: [],
  selectedEnemy: {},
  floor: 1,
  gameOver: false,
  hero: {
    health: 100,
    weapon: null,
    attack: 5,
    attackMax: 6,
    criticalHitRatio: 5,
    criticalHitPercent: 50,
    defense: 1,
    level: 1,
    nextLevelExp: 100
   }
};

const DungeonReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case BUILD_DUNGEON:
      let {selectedEnemy} = INITIAL_STATE;
      let {floor} = INITIAL_STATE;
      let {hero} = INITIAL_STATE;

      //Initialisation of Dungeon
      let grid = generateDungeon();

      //Place player on grid
      let playerPosition = $$.placePlayer(grid,  $$.findFloorCells(grid));

      //Place Units on grid
      let placeUnits = $$.placeUnits(_.clone(grid), state.floor);

      if (action.payload !== undefined) {
        return {...state, grid: placeUnits.grid, playerPosition, enemies: placeUnits.enemies, selectedEnemy, floor: action.payload};
      } else {
        return {...state, grid: placeUnits.grid, playerPosition, enemies: placeUnits.enemies, selectedEnemy, floor, hero, gameOver: false};
      }


    case MOVE_PLAYER:
      if (state.gameOver) {
        return state;
      }
      let movedState = $$.movePlayer(_.clone(state.grid), state.playerPosition, action.payload);

      //----------------Handle Enemies-----------------//
      if (movedState.hasOwnProperty('enemy')) {

        let gameOver = false;
        let enemies = _.clone(state.enemies);
        let hero = _.clone(state.hero);

        enemies[movedState.enemy].health -= (damageDealt(hero, enemies[movedState.enemy]));
        hero.health -= (damageDealt(enemies[movedState.enemy], hero));
        let selectedEnemy = enemies[movedState.enemy];

        //If Enemy Dies
        if (enemies[movedState.enemy].health <= 0) {
          let [row, col] = enemies[movedState.enemy].pos;

          movedState.grid[row][col].type = movedState.grid[row][col].type.split(' ')[0];
          selectedEnemy = {};

          //Apply EXP Points
          let currentEXP = hero.nextLevelExp;
          let gainedEXP = enemies[movedState.enemy].expPoints;

          let newExp = addLevels(hero.level, currentEXP, gainedEXP);
          hero.nextLevelExp = newExp.currentEXP;

          //Check for Level Growth
          let growth = newExp.level - hero.level;

          //Apply New Stats
          for (let i = 0; i < growth; i++) {
            let newAttack = _.random(1, 3);
            let newDefense = _.random(1, 3);
            let newHealth = _.random(10, 30);

            hero.level++;
            hero.attack += newAttack;
            hero.defense += newDefense;
            hero.health += newHealth;
          }

          hero.health = (hero.health > 100) ? 100 : hero.health;

        }

        //If Hero Dies
        if (hero.health <= 0) {
          gameOver = true;
        }

        return {...state, grid: movedState.grid, enemies, hero, selectedEnemy, gameOver};
      }


      //-----------------Handle Health---------------//
      if (movedState.hasOwnProperty('health')) {
        let hero = _.clone(state.hero);

        hero.health = ((hero.health + 20) > 100) ? 100 : hero.health + 20;

        return {...state, grid: movedState.grid, hero, playerPosition: movedState.playerPosition};
      }



      //-----------------Handle Weapon---------------//
      if (movedState.hasOwnProperty('weapon')) {
        let hero = _.clone(state.hero);
        hero.weapon = field.WEAPONS[state.floor].name;
        hero.attack += field.WEAPONS[state.floor].damage;
        hero.attackMax += field.WEAPONS[state.floor].damage;

        return {...state, grid: movedState.grid, hero, playerPosition: movedState.playerPosition};
      }


      //-----------------Handle Shield---------------//
      if (movedState.hasOwnProperty('shield')) {
        let hero = _.clone(state.hero);

        hero.defense += 2;

        return {...state, grid: movedState.grid, hero, playerPosition: movedState.playerPosition};
      }

      //-----------------Handle Ladder---------------//
      if (movedState.hasOwnProperty('ladder')) {
        let floor = state.floor + 1;
        console.log(floor);
        return {...state, floor};
      }


      return {...state, grid: movedState.grid, playerPosition: movedState.playerPosition}

    case VIEW_ENEMY:
      return {...state, selectedEnemy: state.enemies[action.payload]};
    default:
      return state;

  }
}

function damageDealt(unit, rival) {
  //Get Attack Points
  let attackPts = _.random(unit.attack, unit.attackMax);

  //Check if critical hit
  let criticalChance = _.random(0, 100);
  attackPts = (criticalChance <= unit.criticalHitRatio) ? attackPts + (attackPts * unit.criticalHitPercent/100) : attackPts;

  return Math.round(attackPts / rival.defense);

}

function addLevels(level, currentEXP, gainedEXP){
  if (gainedEXP >= currentEXP) {
    let diffEXP = currentEXP - gainedEXP;
    level++;
    currentEXP = (100 * level) + diffEXP;
    if (currentEXP <= 0) {
      level++;
      return addLevels(level, (100 * level), (currentEXP * -1));
    } else {
      return {level, currentEXP};
    }

  } else {
    currentEXP -= gainedEXP;
    return {level, currentEXP};
  }
}

export default DungeonReducer;
