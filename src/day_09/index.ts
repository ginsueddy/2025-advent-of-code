import fs from 'fs';

const input = fs.readFileSync('src/day_09/input.txt', 'utf-8');
const inputArr = input.split('\n')

// would like to find the largest rectangle that uses red tiles for two of its opposite corners
// list of where the red tiles are located in the grid
// what is the largest area of any rectangle you can make?

function puzzle1() {
  let maxArea = -1;

  for (let i = 0; i < inputArr.length - 1; i++) {
    for (let j = i + 1; j < inputArr.length; j++) {
      const [xCoordAStr, yCoordAStr] = inputArr[i].split(',');
      const [xCorrdBStr, yCoordBStr] = inputArr[j].split(',');

      const xCoordA = Number(xCoordAStr);
      const yCoordA = Number(yCoordAStr);

      const xCoordB = Number(xCorrdBStr);
      const yCoordB = Number(yCoordBStr);

      const width = Math.abs(xCoordA - xCoordB) + 1;
      const length = Math.abs(yCoordA - yCoordB) + 1;

      const area = width * length;

      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  console.log(maxArea)
}

// In your list, every red tile is connected to the red tile before and after it by a straight line of green tiles
// The list wraps, so the first red tile is also connected to the last red tile
// tiles that are adjacent in your list will always be on either the same row or the same column.
// Using two red tiles as opposite corners, what is the largest area of any rectangle you can make using only red and green tiles?

function puzzle2() {
  const points = inputArr.map((inputLine) => {
    const [xCoordStr, yCoordStr] = inputLine.split(',');
    const xCoord = Number(xCoordStr);
    const yCoord = Number(yCoordStr);

    return {
      x: xCoord,
      y: yCoord
    }
  });

  const verticalEdges = [];
  let minY = +Infinity;
  let maxY = -Infinity;
  
  for (let i = 0; i < points.length; i++) {
    const pointA = points[i];
    const pointB = points[(i + 1) % points.length];

    minY = Math.min(minY, pointA.y);
    maxY = Math.max(maxY, pointA.y);

    // create vertical edge
    if (pointA.x === pointB.x) {
      const yLow = Math.min(pointA.y, pointB.y);
      const yHigh = Math.max(pointA.y, pointB.y);

      
      const verticalEdge = {
        x: pointA.x,
        yLow,
        yHigh,
      };

      verticalEdges.push(verticalEdge);
    }
  }

  const rowIntervals = new Map<number, Array<[number, number]>>()

  for (let y = minY; y < maxY; y++) {
    const xs: Array<number> = [];

    // find intersections with vertical edges
    verticalEdges.forEach((verticalEdge) => {
      if (verticalEdge.yLow <= y && y < verticalEdge.yHigh) {
        xs.push(verticalEdge.x);
      }
    })

    xs.sort((a, b) => {
      return a - b;
    });

    const intervals: Array<[number, number]> = [];

    for (let i = 0; i + 1 < xs.length; i += 2) {
      const left = xs[i];
      const right = xs[i + 1];

      intervals.push([left, right]);
    }

    rowIntervals.set(y, intervals);
  }

  let maxArea = -1;

  for (let i = 0; i < points.length - 1; i++) {
    const pointA = points[i];

    for (let j = i + 1; j < points.length; j++) {
      const pointB = points[j];

      const width = Math.abs(pointA.x - pointB.x) + 1
      const height = Math.abs(pointA.y - pointB.y) + 1;

      const area = width * height;

      let isValid = true;

      const xLeft = Math.min(pointA.x, pointB.x);
      const xRight = Math.max(pointA.x, pointB.x);
      const yTop = Math.min(pointA.y, pointB.y);
      const yBottom = Math.max(pointA.y, pointB.y);

      for (let y = yTop; y < yBottom; y++) {
        const intervals = rowIntervals.get(y);
        let rowsCoverd = false;

        if (intervals) {
          for (const [start, end] of intervals) {
            if (xLeft >= start && xRight <= end) {
              rowsCoverd = true;
              break;
            }
          }
        }

        if (!rowsCoverd) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        continue;
      }

      if (area > maxArea) {
        maxArea = area;
      }

    }
  }

  console.log(maxArea)
}

// puzzle1();
puzzle2();