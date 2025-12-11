import fs from 'fs';

const input = fs.readFileSync('src/day_11/input.txt', 'utf-8');
const inputArr = input.split('\n');

// Each line gives the name of a device followed by a list of the devices to which its outputs are attached.
// Data only ever flows from a device through its outputs; it can't flow backwards. (directed)
// focus on the devices starting with the one next to you (deviced labled you)
// ending with the main output to the reactor (which is the device with the label out).
// they need you to find every path from you to out.

function dfsTraverse1(nextDeviceName: string) {
  let total = 0;
  if (nextDeviceName === 'out') {
    total++;
  }

  for (let i = 0; i < inputArr.length; i++) {
    const [deviceName, outputPathsStr] = inputArr[i].split(':');

    if (deviceName === nextDeviceName) {
      const outputPaths = outputPathsStr.trim().split(' ');

      for (let j = 0; j < outputPaths.length; j++) {
        const path = outputPaths[j];
        total += dfsTraverse1(path);
      }

      break;
    }
  }

  return total;
}

function puzzle1() {
  const paths = dfsTraverse1('you');
  console.log(paths)
}

function dfsTraverse2() {
  const cache: Record<string, number> = {};
  
  return function traverseFunc(nextDeviceName: string, touchedDac: boolean, touchedFft: boolean): number {
    const cacheKey = `${nextDeviceName}|${touchedDac}|${touchedFft}`;

    if (cacheKey in cache) {
      return cache[cacheKey];
    }

    if (nextDeviceName === 'out') {
      return touchedDac && touchedFft ? 1 : 0;
    }

    let total = 0;
    for (let i = 0; i < inputArr.length; i++) {
      const [deviceName, outputPathsStr] = inputArr[i].split(':');

      if (deviceName === nextDeviceName) {
        const outputPaths = outputPathsStr.trim().split(' ');

        if (deviceName === 'dac') {
          touchedDac = true;
        }

        if (deviceName === 'fft') {
          touchedFft = true
        }

        for (let j = 0; j < outputPaths.length; j++) {
          const path = outputPaths[j];

          total += traverseFunc(path, touchedDac, touchedFft);
        }

        break;
      }
    }

    cache[cacheKey] = total;

    return total;
  }
}

// the paths you find must all also visit both dac and fft (in any order).
// Find all of the paths that lead from svr to out.
function puzzle2() {
  const traverseFunc = dfsTraverse2();
  const paths = traverseFunc('svr', false, false);

  console.log(paths)
}

// puzzle1();
puzzle2();