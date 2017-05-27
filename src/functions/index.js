import _ from 'lodash';
export default class $$ {

  constructor() {

  }

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

  static placeRooms(grid) {
    //Initialising Variables
    var rows = grid.length;
    var cols = (grid.length > 0) ? grid[0].length : 0;

    var initialRoomSize = this.initialRoomSize([[8,10],[10,15]]);

    //Possible starting positions: top-left, top-right, bottom-left, bottom-right: row-cols
    var startingPositions = [
      [_.random(1,3), _.random(1,3)],
      [_.random(1,3), _.random(cols-4,cols-2)],
      [_.random(rows-4,rows-2), _.random(1,3)],
      [_.random(rows-4,rows-2), _.random(cols-4, cols-2)]
    ];

    //Randomly select a starting point
    let randomIndex = _.random(0,startingPositions.length -1);
    var startingPosition = startingPositions[randomIndex];

    //If index is 0 or 2 then build rooms from left-to-right (positive) else (negative)
    var buildDirectionCol = (randomIndex === 0 || randomIndex === 2) ? 'positive' : 'negative';
    var buildDirectionRow = (randomIndex === 2 || randomIndex === 3) ? 'positive' : 'negative';

      for (let i = 0; i < initialRoomSize[0]; i++) {
        //Iterate through rows
        for (let j = 0; j < initialRoomSize[1]; j++) {
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

            grid[row][col].type = 'room';

        }
      }

      return grid;
  }

  static initialRoomSize(arr = [[3,6],[6,9]]) {
    var a = _.random(arr[0][0], arr[0][1]);
    var b = _.random(arr[1][0], arr[1][1]);
    return [a,b];
  }

}
