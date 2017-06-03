import _ from 'lodash';

export const field = {
  ENEMY_RANGE: [3,5],
  HEALTH_RANGE: [2,4],
  SHIELD_RANGE: [1,3],
  LADDER: 1,
  WEAPONS: {
    1: [
      {
        name: 'Boxing Gloves',
        damage: 4,
        guard: 5,
        ratio: 10
      },
      {
        name: 'Brass Knuckles',
        damage: 6,
        guard: 3,
        ratio: 8
      },
      {
        name: 'Small Knife',
        damage: 8,
        guard: 1,
        ratio: 10
      }
    ],
    2: [
      {
        name: 'Double Sai',
        damage: 18,
        guard: 10,
        ratio: 15
      },
      {
        name: 'Long Sword and Shield',
        damage: 20,
        guard: 8,
        ratio: 15
      },
      {
        name: 'Bastard Sword',
        damage: 22,
        guard: 6,
        ratio: 20
      }
    ],
    3: [
      {
        name: 'Pistol',
        damage: 26,
        guard: 14,
        ratio: 25
      },
      {
        name: 'Battle Axe',
        damage: 28,
        guard: 12,
        ratio: 25
      },
      {
        name: 'Scythe',
        damage: 24,
        guard: 16,
        ratio: 15
      }
    ],
    4: [
      {
        name: 'Great Sword and Armor of Annihitation',
        damage: 30,
        guard: 20,
        ratio: 25
      },
      {
        name: 'VUG Mk2 Assault Rifle',
        damage: 34,
        guard: 16,
        ratio: 25
      },
      {
        name: "Elder's Wand",
        damage: 28,
        guard: 22,
        ratio: 35
      }
    ],
    5: [
      {
        name: "Mjolnir",
        damage: 40,
        guard: 25,
        ratio: 30
      },
      {
        name: "Infinity Guantlet",
        damage: 35,
        guard: 30,
        ratio: 30
      },
      {
        name: "Eye of Agamotto",
        damage: 30,
        guard: 45,
        ratio: 10
      }
    ]
  }
};

export const generateDungeon = () => {
  //Reference settings for easy use
  const s = {
    GRID_SIZE: [80, 40],
    ROOM_SIZE_RANGE: [7, 12],
    MAX_ROOM_COUNT: 20
  };

  const [gridWidth, gridHeight] = s.GRID_SIZE;

  //Helper Function to Place Room unto Grid
  const placeRooms = (grid, {x, y, height = 1, width = 1}, type = 'floor') => {
    //Begin by using rows, then change type for each cell in the current row
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        grid[i][j] = {...grid[i][j], type};
      }
    }
    //Return altered grid
    return grid;
  };

  //Check if the room can be placed succcessfully on the grid
  const isRoomValid = (grid, {x, y, height = 1, width = 1}) => {
    //Inspect Room to determine whether or not it is out of bounds
    if (y < 1 || y + height > grid.length - 1) {
      //For Rows/Height
			return false;
		}

		if (x < 1 || x + width > grid[0].length - 1) {
      //For Columns/Width
			return false;
		}

    //Inspect Room to determine is one-cell space is present and no overlapping is occuring
    for (let i = y - 1; i < y + height + 1; i++) {
      for (let j = x - 1; j < x + width + 1; j++) {
        if (grid[i][j].type === 'floor') {
          return false;
        }
      }
    }

    //If all checks pass
    return true;
  };

  /*******************************************************************************************
  ---------------------------------------START------------------------------------------------
    WORKING WITH RECURSIVE FUNCTION AND BUILDING ADDITIONAL ROOMS FOR DUNGEON USING STARTER
  *******************************************************************************************/

  const buildAdditionalRooms = (grid, {x, y, height, width}, range = s.ROOM_SIZE_RANGE) => {
    const [min, max] = range;

    //The rooms generated shall be placed into this array
    const genRooms = [];

    //Build Rooms: Left, Up, Right, Down of Starter Room
    const up = { height: _.random(min, max), width: _.random(min, max)};
    up.x = _.random(x, x + width - 1);
		up.y = y - up.height - 1;
		up.doorx = _.random(up.x, (Math.min(up.x + up.width, x + width)) - 1);
		up.doory = y - 1;
		genRooms.push(up);

    const right = { height: _.random(min, max), width: _.random(min, max)};
    right.x = x + width + 1;
		right.y = _.random(y, height + y - 1);
		right.doorx = right.x - 1;
		right.doory = _.random(right.y, (Math.min(right.y + right.height, y + height)) - 1);
		genRooms.push(right);

    const down = { height: _.random(min, max), width: _.random(min, max)};
    down.x = _.random(x, width + x - 1);
		down.y = y + height + 1;
		down.doorx = _.random(down.x, (Math.min(down.x + down.width, x + width)) - 1);
		down.doory = y + height;
		genRooms.push(down);

    const left = { height: _.random(min, max), width: _.random(min, max)};
    left.x = x - left.width - 1;
		left.y = _.random(y, height + y - 1);
		left.doorx = x - 1;
		left.doory = _.random(left.y, (Math.min(left.y + left.height, y + height)) - 1);
		genRooms.push(left);


    //Array of all rooms placed succcessfully on the grid
    const placedRooms = [];

    genRooms.forEach(room => {
      if (isRoomValid(grid, room)) {
				// place room
				grid = placeRooms(grid, room);
				// place door
				grid = placeRooms(grid, {x: room.doorx, y: room.doory}, 'door');
				// need placed room values for the next seeds
				placedRooms.push(room);
			}
    });

    return {grid, placedRooms};
  };

  //Build 2D Array of Objects that will be used as grid
  let grid = [];
  //Starting with height, add cells to each row
  for (let i = 0; i < gridHeight; i++) {
    grid.push([]); //Empty array to store row-cells
    for (let j = 0; j < gridWidth; j++) {
      grid[i].push({type: 'background', radius: false});
    }
  }

  //Build Starter Room
  const [min, max] = s.ROOM_SIZE_RANGE;
  const starterRoom = {
    x: _.random(1, (gridWidth - max - Math.floor((gridWidth -2)/3))),
    y: _.random(1, (gridHeight - max - Math.floor((gridHeight -2)/3))),
    height: _.random(min, max),
    width: _.random(min, max),
  };

  //Add Starter Room To Grid
  grid = placeRooms(grid, starterRoom);

  const developMap = (grid, starterRooms, count = 1, maxRooms = s.MAX_ROOM_COUNT) => {
    //If all possible rooms have be placed or list exhausted, return grid and end recursive function
    if (count + starterRooms.length > maxRooms || !starterRooms.length) {
      return grid;
    }

    //Grid is an object, with the currently altered grid and the placedRooms
		grid = buildAdditionalRooms(grid, starterRooms.pop());
    //Add placedRooms array elements to starterRooms for iterative process
		starterRooms.push(...grid.placedRooms);
		count += grid.placedRooms.length;
		return developMap(grid.grid, starterRooms, count);

  };

  //return grid;
  return developMap(grid, [starterRoom]);

  /*******************************************************************************************
  ---------------------------------------END------------------------------------------------
    WORKING WITH RECURSIVE FUNCTION AND BUILDING ADDITIONAL ROOMS FOR DUNGEON USING STARTER
  *******************************************************************************************/
};
