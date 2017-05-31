export const BUILD_DUNGEON = 'BUILD_DUNGEON';
export const MOVE_PLAYER = 'MOVE_PLAYER';

export function BuildDungeon() {
  return(
    {
      type: BUILD_DUNGEON
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
