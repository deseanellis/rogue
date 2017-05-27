import _ from 'lodash';
export default class $$ {

  //Static Utility Functions
  static buildDungeon(arr = [40,80], type='floor') {
    var build = [];
    var [rows, cols] = arr;

    for (var i = 0; i < rows; i++) {
      build.push([]);
      for (var j = 0; j < cols; j++) {
        build[i].push({x: i, y: j, id: (i * cols) + j, type});
      }
    }

    return build;
  }

  static placeRooms(grid, count = 0, rooms = []) {
    //Initialising Variables
    //var rows = grid.length;
    //var cols = (grid.length > 0) ? grid[0].length : 0;
    var roomSize = [0,0];

    if (count === 0) {
      //Initial Room
      roomSize = this.roomSize([[8,10],[10,15]]);
    } else {
      //Additional roomSize
      roomSize = this.roomSize([[10,12],[12,16]]);
    }


    //Possible starting positions: top-left, top-right, bottom-left, bottom-right: row-cols
/*
    var startingPositions = [
      [_.random(1,3), _.random(1,3)],
      [_.random(1,3), _.random(cols-4,cols-2)],
      [_.random(rows-4,rows-2), _.random(1,3)],
      [_.random(rows-4,rows-2), _.random(cols-4, cols-2)]
    ];
*/

    var startingPositions = [
      [_.random(1,6), _.random(1,6)]
    ];

    //Randomly select a starting point
    let randomIndex = _.random(0,startingPositions.length -1);
    var startingPosition = startingPositions[randomIndex];

    //If index is 0 or 2 then build rooms from left-to-right (positive) else (negative)
    var buildDirectionCol = (randomIndex === 0 || randomIndex === 2) ? 'positive' : 'negative';
    var buildDirectionRow = (randomIndex === 2 || randomIndex === 3) ? 'positive' : 'negative';

    //Initalise Room Information: top-left, top-right, bottom-left, bottom-right
    rooms[count] = {coords: []};

    //Build Room Coordinates
    rooms[count].coords.push(startingPosition); //top-left
    rooms[count].coords.push([startingPosition[0],(roomSize[1] + startingPosition[1])-1]); //top-right
    rooms[count].coords.push([(roomSize[0] + startingPosition[0])-1, startingPosition[1]]); //bottom-left
    rooms[count].coords.push([(rooms[count].coords[2][0]),(rooms[count].coords[1][1])]); //bottom-right

    console.log(rooms[count].coords);

      for (let i = 0; i < roomSize[0]; i++) {
        //Iterate through rows
        for (let j = 0; j < roomSize[1]; j++) {
          //Iterate through cells for current row
            let row = 0;
            let col = 0;
            if (buildDirectionRow === 'positive') {
               row = (startingPosition[0])-i;
            } else {
              row = (startingPosition[0])+i;
            }
            if (buildDirectionCol === 'positive') {
              col = (startingPosition[1])+j;
            } else {
              col = (startingPosition[1])-j;
            }

            //[{row: [54,57], cols: [22,23,24,25]}]
            grid[row][col].type = 'room';

        }
      }

      return grid;
  }

  static roomSize(arr = [[3,6],[6,9]]) {
    var a = _.random(arr[0][0], arr[0][1]);
    var b = _.random(arr[1][0], arr[1][1]);
    return [a,b];
  }

  static buildCorridor() {

  }

}
