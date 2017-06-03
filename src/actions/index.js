export const BUILD_DUNGEON = 'BUILD_DUNGEON';
export const MOVE_PLAYER = 'MOVE_PLAYER';
export const VIEW_ENEMY = 'VIEW_ENEMY';
export const LIGHTS = 'LIGHTS';
export const START = 'START';
export const APPLY_CHEAT_CODE = 'APPLY_CHEAT_CODE';
export const MUSIC = 'MUSIC';

export function BuildDungeon(floor) {
  return(
    {
      type: BUILD_DUNGEON,
      payload: floor
    }
  );
}

export function ApplyCheatCode(cheatCode) {
  return(
    {
      type: APPLY_CHEAT_CODE,
      payload: cheatCode
    }
  );
}

export function MovePlayer(direction) {
  return(
    {
      type: MOVE_PLAYER,
      payload: direction
    }
  );
}

export function ViewEnemy(id) {
  return(
    {
      type: VIEW_ENEMY,
      payload: id
    }
  );
}

export function Lights(bool) {
  return(
    {
      type: LIGHTS,
      payload: bool
    }
  );
}

export function GameStart(cheatCode) {
  return(
    {
      type: START,
      payload: cheatCode
    }
  );
}

export function Music(floor, result) {
  return(
    {
      type: MUSIC,
      floor,
      result
    }
  );
}
