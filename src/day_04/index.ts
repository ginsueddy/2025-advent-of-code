import fs from 'fs';

const input = fs.readFileSync('src/day_04/input.txt', 'utf-8');

// The rolls of paper (@) are arranged on a large grid
// forklifts can only access a roll of paper if there are fewer than four rolls of paper in the eight adjacent positions
// How many rolls of paper can be accessed by a forklift?

function puzzle1() {
  let totalPaperRollsCount = 0;

  const rows = input.split('\n');


  for (let i = 0; i < rows.length; i++) {
    const currentRow = rows[i];

    for (let j = 0; j < currentRow.length; j++) {
      const currentPos = rows[i][j];
      let count = 0;

      // check west
      if (j !== 0) {
        const westPos = rows[i][j - 1];

        if (westPos === '@') {
          count++;
        }
      }

      // check north west
      if (j !== 0 && i !== 0) {
        const northWestPos = rows[i - 1][j - 1];

        if (northWestPos === '@') {
          count++;
        }
      }

      // check north
      if (i !== 0) {
        const northPos = rows[i - 1][j];

        if (northPos === '@') {
          count++;
        }
      }

      // check north east
      if (j !== currentRow.length - 1 && i !== 0) {
        const northEastPos = rows[i - 1][j + 1];

        if (northEastPos === '@') {
          count++;
        }
      }

      // check east
      if (j !== currentRow.length - 1) {
        const eastPos = rows[i][j + 1];
        
        if (eastPos === '@') {
          count++;
        } 
      }

      // check south east
      if (i !== rows.length - 1 && j !== currentRow.length - 1) {
        const southEastPos = rows[i + 1][j + 1];

        if (southEastPos === '@') {
          count++;
        }
      }

      // check south
      if (i !== rows.length - 1) {
        const southPos = rows[i + 1][j];

        if (southPos === '@') {
          count++;
        }
      }

      // check south west 
      if (i !== rows.length - 1 && j !== 0) {
        const southWestPos = rows[i + 1][j - 1];

        if (southWestPos === '@') {
          count++;
        }
      }

      if (count < 4 && currentPos === '@') {
        totalPaperRollsCount++
      }

    }
  }

  console.log('totalPaper', totalPaperRollsCount)

}

function puzzle2() {
  let totalPaperRollsCount = 0;

  const grid = input.split('\n').map((row) => row.split(''));
  let numOfRollsRemoved = -1;

  do {
  numOfRollsRemoved = 0;
  const cellsToRemove = new Map<number, Array<number>>();

    for (let i = 0; i < grid.length; i++) {
      const currentRow = grid[i];

      for (let j = 0; j < currentRow.length; j++) {
        const currentPos = grid[i][j];
        let count = 0;

        // check west
        if (j !== 0) {
          const westPos = grid[i][j - 1];

          if (westPos === '@') {
            count++;
          }
        }

        // check north west
        if (j !== 0 && i !== 0) {
          const northWestPos = grid[i - 1][j - 1];

          if (northWestPos === '@') {
            count++;
          }
        }

        // check north
        if (i !== 0) {
          const northPos = grid[i - 1][j];

          if (northPos === '@') {
            count++;
          }
        }

        // check north east
        if (j !== currentRow.length - 1 && i !== 0) {
          const northEastPos = grid[i - 1][j + 1];

          if (northEastPos === '@') {
            count++;
          }
        }

        // check east
        if (j !== currentRow.length - 1) {
          const eastPos = grid[i][j + 1];
          
          if (eastPos === '@') {
            count++;
          } 
        }

        // check south east
        if (i !== grid.length - 1 && j !== currentRow.length - 1) {
          const southEastPos = grid[i + 1][j + 1];

          if (southEastPos === '@') {
            count++;
          }
        }

        // check south
        if (i !== grid.length - 1) {
          const southPos = grid[i + 1][j];

          if (southPos === '@') {
            count++;
          }
        }

        // check south west 
        if (i !== grid.length - 1 && j !== 0) {
          const southWestPos = grid[i + 1][j - 1];

          if (southWestPos === '@') {
            count++;
          }
        }

        if (count < 4 && currentPos === '@') {
          numOfRollsRemoved++
          

          if (!cellsToRemove.has(i)) {
            cellsToRemove.set(i, [j]);
          } else {
            cellsToRemove.get(i)?.push(j)
          }
        }

      }
    }

    totalPaperRollsCount += numOfRollsRemoved

    cellsToRemove.forEach((valueArr, key) => {
      valueArr.forEach((value) => {
        grid[key][value] = '.'
      })
    })
    

  } while (numOfRollsRemoved > 0);

  console.log('totalPaper', totalPaperRollsCount)
}


// puzzle1();
puzzle2();