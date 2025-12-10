import fs from 'fs';
const solver = require("javascript-lp-solver");

const input = fs.readFileSync('src/day_10/input.txt', 'utf-8');
const inputArr = input.split('\n');

// NOTE:
// both of these problems were super difficult and i did use ai to hand hole me thorugh the problems

function patternToMask(pattern: string): number {
  let mask = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '#') {
      mask |= (1 << i);
    }
  }

  return mask;
}

function buttonToMask(indices: number[]): number {
  let mask = 0;
  for (const idx of indices) {
    mask |= (1 << idx);
  }
  return mask;
}

function parseMachine(line: string) {
  // pattern inside [...] 
  const patternMatch = line.match(/\[([.#]+)\]/);
  if (!patternMatch) {
    throw new Error("No pattern found");
  }
  const pattern = patternMatch[1]; // e.g. ".##."

  // all buttons: each (...) group
  const buttonMatches = [...line.matchAll(/\(([0-9,]+)\)/g)];
  const buttonIndices: number[][] = buttonMatches.map(m => 
    m[1].split(',').map(Number)
  );

  // joltage
  const joltageMatch = line.match(/\{([0-9,]+)\}/);
  if (!joltageMatch) {
    throw new Error("No joltage requirements found");
  }
  const joltageTarget = joltageMatch[1].split(',').map(Number);

  return {
    pattern,
    buttonIndices,
    joltageTarget
  };
}

// The manual describes one machine per line.
// Each line contains a single indicator light diagram in [square brackets], one or more button wiring schematics in (parentheses), and joltage requirements in {curly braces}.
// its indicator lights must match those shown in the diagram, where . means off and # means on
// The machine has the number of indicator lights shown, but its indicator lights are all initially off.

function bfs(targetMask: number, buttonMasks: number[]) {
  const start = 0;

  if (start === targetMask) return 0;

  const visited = new Set<number>();
  visited.add(start);

  const queue = [{ state: start, steps: 0 }];
  let qIndex = 0;

  while (qIndex < queue.length) {
    const { state, steps } = queue[qIndex++];

    for (const btn of buttonMasks) {
      const nextState = state ^ btn;

      if (nextState === targetMask) {
        return steps + 1;
      }

      if (!visited.has(nextState)) {
        visited.add(nextState);
        queue.push({ state: nextState, steps: steps + 1 });
      }
    }
  }
}

function puzzle1() {
  let totalPresses = 0;
  
  for (let i = 0; i < inputArr.length; i++) {
    const inputLine = inputArr[i];
    const { pattern, buttonIndices } = parseMachine(inputLine);

    const targetMask = patternToMask(pattern);
    const buttonMasks = buttonIndices.map(buttonToMask);
      
    const presses = bfs(targetMask, buttonMasks);
    if (!presses) {
      continue;
    }

    totalPresses += presses
  }

  console.log(totalPresses)
}

// Each machine needs to be configured to exactly the specified joltage levels to function properly. 
// the counters are all initially set to zero.
// When you push a button, each listed counter is increased by 1.
// determine the fewest total presses required to correctly configure each machine's joltage level counters to match the specified joltage requirements.

function solveMachineWithILP(
  joltageTarget: number[],
  buttonIndices: number[][],
): number {
  const numButtons = buttonIndices.length;
  const numCounters = joltageTarget.length;

  const constraints: Record<string, { equal: number }> = {};
  for (let j = 0; j < numCounters; j++) {
    constraints["c" + j] = { equal: joltageTarget[j] };
  }

  const variables: Record<string, any> = {};

  for (let i = 0; i < numButtons; i++) {
    const varName = "b" + i;
    const varObj: any = { presses: 1 };

    for (const idx of buttonIndices[i]) {
      const cName = "c" + idx;
      varObj[cName] = (varObj[cName] || 0) + 1;
    }

    variables[varName] = varObj;
  }

  const ints: Record<string, number> = {};
  for (let i = 0; i < numButtons; i++) {
    ints["b" + i] = 1;
  }

  const model = {
    optimize: "presses",
    opType: "min" as const,
    constraints,
    variables,
    ints,
  };

  const result = solver.Solve(model);

  if (!result.feasible) {
    throw new Error("No feasible solution for this machine (unexpected for this puzzle).");
  }

  return result.result;
}

function puzzle2() {
  let totalPresses = 0;

  for (let i = 0; i < inputArr.length; i++) {
    const inputLine = inputArr[i];

    const {buttonIndices, joltageTarget} = parseMachine(inputLine);
    
    const presses = solveMachineWithILP(joltageTarget, buttonIndices);

    if (!presses) {
      continue;
    }

    totalPresses += presses;
  }

  console.log(totalPresses);
}

// puzzle1();
puzzle2();
