import _ from 'lodash';
import { generateDungeon } from '../config/build';

import { field } from '../config/build';
import $$ from '../functions';

import { BUILD_DUNGEON, MOVE_PLAYER, VIEW_ENEMY, APPLY_CHEAT_CODE } from '../actions';
import { DIR } from './reducer_music';

const INITIAL_STATE = {
  grid: [],
  playerPosition: [],
  enemies: [],
  selectedEnemy: {},
  floor: 1,
  gameOver: false,
  result: "",
  hero: {
    health: 100,
    weapon: null,
    weaponStats: {
      damage: 0,
      guard: 0
    },
    attack: 5,
    attackMax: 6,
    criticalHitRatio: 5,
    criticalHitPercent: 50,
    defense: 5,
    level: 1,
    nextLevelExp: 100
   }
};

const DungeonReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case BUILD_DUNGEON:
      let {selectedEnemy, floor, hero, gameOver, result} = INITIAL_STATE;

      //Initialisation of Dungeon
      let grid = generateDungeon();

      //Place player on grid
      let playerPosition = $$.placePlayer(grid,  $$.findFloorCells(grid));

      //Place Units on grid
      let placeUnits = $$.placeUnits(_.clone(grid), state.floor);

      if (action.payload !== undefined) {
        return {...state, grid: placeUnits.grid, playerPosition, enemies: placeUnits.enemies, selectedEnemy, floor: action.payload};
      } else {
        return {...state, grid: placeUnits.grid, playerPosition, enemies: placeUnits.enemies, selectedEnemy, floor, hero, gameOver, result};
      }
    case APPLY_CHEAT_CODE:
      let cheatHero = _.clone(INITIAL_STATE.hero);
      switch (action.payload) {
        case 'ONE-PUNCH':
          cheatHero.attack = 1000000;
          cheatHero.attackMax = 1000000;
          cheatHero.defense = 1000000;
          cheatHero.criticalHitRatio = 99;
          cheatHero.criticalHitPercent = 100
          break;
        case 'ROCK-HARD-ABS':
          cheatHero.defense = 100;
          break;
        default:

      }
      return {...state, hero: cheatHero}

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
        let selectedEnemy = enemies[movedState.enemy];

        selectedEnemy.health -= (damageDealt(hero, selectedEnemy));
        hero.health -= (damageDealt(selectedEnemy, hero));


        //Play Audio for Attack
        playSfx(DIR, 'attack.wav');

        //If Enemy Dies
        if (selectedEnemy.health <= 0) {
          let [row, col] = selectedEnemy.pos;

          movedState.grid[row][col].type = movedState.grid[row][col].type.split(' ')[0];
          selectedEnemy = {}; //Empty Object is Death

          //Play Audio for Enemy Defeat
          playSfx(DIR, 'beat-enemy.wav');

          //Apply EXP Points
          let currentEXP = hero.nextLevelExp;
          let gainedEXP = enemies[movedState.enemy].expPoints;

          let newExp = addLevels(hero.level, currentEXP, gainedEXP);
          hero.nextLevelExp = newExp.currentEXP;

          //Check for Level Growth
          let growth = newExp.level - hero.level;

          if (growth > 0) {
            //Play Audio for Level Up
            playSfx(DIR, 'level.wav');
          }

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

        return {...state, grid: movedState.grid, enemies, hero, selectedEnemy, gameOver, result: 'lose'};
      }



      //-----------------Handle Princess--------------//
      if (movedState.hasOwnProperty('princess')) {
        let enemies = _.clone(state.enemies);
        let theBoss = enemies[0];
        let result = "";

        //Determine if boss is alive
        if (theBoss.health > 0) {
          //Is Alive
        } else {
          //Is Defeated
          gameOver = true;
          result = 'win';

          //Play Audio for Beat Boss
          playSfx(DIR, 'beat-boss.wav');
        }

        return {...state, grid: movedState.grid, gameOver, result};
      }


      //-----------------Handle Health---------------//
      if (movedState.hasOwnProperty('health')) {
        let hero = _.clone(state.hero);
        let healthGain = _.random(20, 50);
        hero.health = ((hero.health + healthGain) > 100) ? 100 : hero.health + healthGain;

        //Play Audio for Item
        playSfx(DIR, 'item.wav');

        return {...state, grid: movedState.grid, hero, playerPosition: movedState.playerPosition};
      }



      //-----------------Handle Weapon---------------//
      if (movedState.hasOwnProperty('weapon')) {
        let hero = _.clone(state.hero);
        let weaponSelected = field.WEAPONS[state.floor][_.random(field.WEAPONS[state.floor].length -1)];
        hero.weapon = weaponSelected.name;

        //Play Audio for Item
        playSfx(DIR, 'item.wav');

        //Remove Stats from last weapon
        hero.attack -= hero.weaponStats.damage;
        hero.attackMax -= hero.weaponStats.damage;
        hero.defense -= hero.weaponStats.guard;

        //Add Stats from New Weapon
        hero.attack += weaponSelected.damage;
        hero.attackMax += weaponSelected.damage;
        hero.defense += weaponSelected.guard;

        //Store Current Weapon Stats
        hero.weaponStats.damage = weaponSelected.damage;
        hero.weaponStats.guard = weaponSelected.guard;

        //Adjust Critical Hit Ratio
        hero.criticalHitRatio = weaponSelected.ratio;

        return {...state, grid: movedState.grid, hero, playerPosition: movedState.playerPosition};
      }


      //-----------------Handle Shield---------------//
      if (movedState.hasOwnProperty('shield')) {
        let hero = _.clone(state.hero);
        let shieldGain =_.random(1,4);
        hero.defense += shieldGain;

        //Play Audio for Item
        playSfx(DIR, 'item.wav');

        return {...state, grid: movedState.grid, hero, playerPosition: movedState.playerPosition};
      }

      //-----------------Handle Ladder---------------//
      if (movedState.hasOwnProperty('ladder')) {
        let floor = state.floor + 1;

        //Play Audio for Ladder
        playSfx(DIR, 'ladder.wav');

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

  let guard = rival.defense;
  guard /= 2;
  return Math.round(attackPts / guard);

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

function playSfx(DIR, file) {
  let sfx = document.getElementById('sfx');

  let src = `${DIR}sfx/${file}`;

  //Play Audio
  sfx.setAttribute("src", src);

  //Use timeout to stop React DOM Promise Error
  setTimeout(function() {
    sfx.play();
  }, 0);
}

export default DungeonReducer;
