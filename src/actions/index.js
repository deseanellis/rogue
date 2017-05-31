export const BUILD_DUNGEON = 'BUILD_DUNGEON';
export const MOVE_PLAYER = 'MOVE_PLAYER';
export const VIEW_ENEMY = 'VIEW_ENEMY';

export function BuildDungeon(floor) {
  return(
    {
      type: BUILD_DUNGEON,
      payload: floor
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
