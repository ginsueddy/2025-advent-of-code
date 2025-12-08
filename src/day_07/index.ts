import fs from 'fs';

const input = fs.readFileSync('src/day_07/input.txt', 'utf-8');

const grid = input.split('\n').map((row) => row.split(''));

// A tachyon beam enters the manifold at the location marked S
// tachyon beams always move downward
// Tachyon beams pass freely through empty space (.)
// if a tachyon beam encounters a splitter (^), the beam is stopped
// a new tachyon beam continues from the immediate left and from the immediate right of the splitte
// How many times will the beam be split?

function puzzle1() {
  let numOfSplits = 0;
  const firstLine = grid[0];
  
  const beamPosX = new Set<number>();
  for (let i = 0; i < firstLine.length; i++) {
    if (firstLine[i] === 'S') {
      beamPosX.add(i);
      break;
    }
  }

  for (let i = 1; i < grid.length; i++) {
    beamPosX.forEach((beamPos) => {
      if (grid[i][beamPos] === '^') {     
        beamPosX.delete(beamPos);

        const left = beamPos - 1;
        const right = beamPos + 1;

        beamPosX.add(left);
        beamPosX.add(right);

        numOfSplits++
      } else {
        grid[i][beamPos] = '|'
      }
    })
  }

  console.log(numOfSplits)
  // for logging grid
  for (let i = 0; i < grid.length; i++) {
    let result = '';
    for (let j = 0; j < grid[i].length; j++) {
      result += grid[i][j]
    }
    console.log(result)
  }
}

function beamTraverse() {
  let cache: Record<string, number> = {};
  return function traverse(xPos: number, yPos: number): number {
    const cacheKey = `${xPos},${yPos}`;
    
    if (cacheKey in cache) {
      return cache[cacheKey];
    }


    let result = 1;
    for (let i = yPos; i < grid.length; i++) {
      if (grid[i][xPos] === '^') {
        result =  traverse(xPos - 1, i) + traverse(xPos + 1, i);
        break;
      }
    }

    cache[cacheKey] = result;

    return result;
  }
}

function puzzle2() {
  let numOfTimelines = 0;

  let beamPosX = -1;

  const firstLine = grid[0];
  for (let i = 0; i < firstLine.length; i++) {
    if (firstLine[i] === 'S') {
      beamPosX = i;
      break;
    }
  }

  const traverseFunc = beamTraverse();
  numOfTimelines = traverseFunc(beamPosX, 1);

  console.log(numOfTimelines)
}

// puzzle1();
puzzle2();
