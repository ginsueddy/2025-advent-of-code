import fs from 'fs';

const input = fs.readFileSync('src/day_08/input.txt', 'utf-8');
const inputArr = input.split('\n')

// Each position is given as X,Y,Z coordinates
// like to focus on connecting pairs of junction boxes that are as close together as possible according to straight-line distance
// Your list contains many junction boxes; connect together the 1000 pairs of junction boxes which are closest together.
// what do you get if you multiply together the sizes of the three largest circuits?

function calculateDistance(pointACoordStr: string, pointBCoordStr: string) {
  const pointACoord = pointACoordStr.split(',').map(Number);
  const pointBCoord = pointBCoordStr.split(',').map(Number);

  const dX = pointBCoord[0] - pointACoord[0];
  const dY = pointBCoord[1] - pointACoord[1];
  const dZ = pointBCoord[2] - pointACoord[2];

  return Math.sqrt(dX*dX + dY*dY + dZ*dZ);
}

function puzzle1() {
  const edgeStorage = [];

  for (let i = 0; i < inputArr.length - 1; i++) {
    for (let j = i + 1; j < inputArr.length; j++) {
      const pointA = inputArr[i];
      const pointB = inputArr[j];

      const distance = calculateDistance(pointA, pointB);

      const connectionInfo = {
        aIndex: i,
        bIndex: j,
        distance,
      }

      edgeStorage.push(connectionInfo)
    }
  }

  edgeStorage.sort((a, b) => {
    return a.distance - b.distance;
  })

  const circuitMap = new Map<number, Set<number>>();

  const nodeToCircuit = new Map<number, number>();
  let circuitId = 1;

  for (let i = 0; i < 1000; i++) {
    const { aIndex, bIndex } = edgeStorage[i];

    const circuitA = nodeToCircuit.get(aIndex);
    const circuitB = nodeToCircuit.get(bIndex);

    if (circuitA === undefined && circuitB === undefined) {
      nodeToCircuit.set(aIndex, circuitId);
      nodeToCircuit.set(bIndex, circuitId);

      const nodeSet = new Set([aIndex, bIndex]);
      circuitMap.set(circuitId, nodeSet)
      circuitId++;

      continue;
    }
    
    if (circuitA === circuitB) {
      continue;
    }

    if (circuitA && circuitB === undefined) {
      const currentCircuitId = circuitA;

      nodeToCircuit.set(bIndex, currentCircuitId);
      circuitMap.get(currentCircuitId)?.add(bIndex);

      continue;
    }

    if (circuitA === undefined && circuitB) {
      const currentCircuitId = circuitB;

      nodeToCircuit.set(aIndex, currentCircuitId);
      circuitMap.get(currentCircuitId)?.add(aIndex);

      continue;
    }

    if (circuitA !== circuitB) {
      const setA = circuitMap.get(circuitA!);
      const setB = circuitMap.get(circuitB!);

      if (!setA || !setB) {
        continue;
      }

      const [keepId, mergeId] = setA.size >= setB.size ? [circuitA, circuitB] : [circuitB, circuitA];

      if (!keepId|| !mergeId) {
        continue;
      }

      const keepSet = circuitMap.get(keepId);
      const mergeSet = circuitMap.get(mergeId);

      mergeSet?.forEach((node) => {
        keepSet?.add(node);
        nodeToCircuit.set(node, keepId);
      })

      circuitMap.delete(mergeId)
    }
  }


  const setSizes: Array<any> = [];
  circuitMap.forEach((set, key) => {
    const setInfo = {
      circuit: key,
      setSize: set.size
    }

    setSizes.push(setInfo)
  })

  
  setSizes.sort((a, b) => {
    return b.setSize - a.setSize;
  })

  const answer = setSizes[0].setSize * setSizes[1].setSize * setSizes[2].setSize;
  console.log(answer)
}

// Continue connecting the closest unconnected pairs of junction boxes together until they're all in the same circuit
// What do you get if you multiply together the X coordinates of the last two junction boxes you need to connect?
function puzzle2 () {
  const edgeStorage = [];

  for (let i = 0; i < inputArr.length - 1; i++) {
    for (let j = i + 1; j < inputArr.length; j++) {
      const pointA = inputArr[i];
      const pointB = inputArr[j];

      const distance = calculateDistance(pointA, pointB);

      const connectionInfo = {
        aIndex: i,
        bIndex: j,
        distance,
      }

      edgeStorage.push(connectionInfo)
    }
  }

  edgeStorage.sort((a, b) => {
    return a.distance - b.distance;
  })

  const circuitMap = new Map<number, Set<number>>();
  const nodeToCircuit = new Map<number, number>();

  for (let i = 0; i < inputArr.length; i++) {
    circuitMap.set(i, new Set([i]));
    nodeToCircuit.set(i, i);
  }


  let numOfCircuts = inputArr.length;
  let lastUsedEdge: { aIndex: number; bIndex: number } | null = null;


  for (let i = 0; i < edgeStorage.length; i++) {
    const { aIndex, bIndex } = edgeStorage[i];

    const circuitA = nodeToCircuit.get(aIndex);
    const circuitB = nodeToCircuit.get(bIndex);

    if (!circuitA || !circuitB) {
      continue;
    }
    
    if (circuitA === circuitB) {
      continue;
    }

    const setA = circuitMap.get(circuitA);
    const setB = circuitMap.get(circuitB);

    if (!setA || !setB) {
      continue;
    }

    const [keepId, mergeId] = setA.size >= setB.size ? [circuitA, circuitB] : [circuitB, circuitA];

    if (!keepId|| !mergeId) {
      continue;
    }

    const keepSet = circuitMap.get(keepId);
    const mergeSet = circuitMap.get(mergeId);

    mergeSet?.forEach((node) => {
      keepSet?.add(node);
      nodeToCircuit.set(node, keepId);
    })

    circuitMap.delete(mergeId)
    numOfCircuts--;
    lastUsedEdge = { aIndex, bIndex }

    if (numOfCircuts === 1) {
      break;
    }
  }

  if (!lastUsedEdge) {
    return;
  }

  const coordA = inputArr[lastUsedEdge.aIndex]
  const coordB = inputArr[lastUsedEdge.bIndex]

  const xCoordA = Number(coordA.split(',')[0]);
  const xCoordB = Number(coordB.split(',')[0]);

  const answer = xCoordA * xCoordB;
  console.log('answer', answer)
}

// puzzle1();
puzzle2()