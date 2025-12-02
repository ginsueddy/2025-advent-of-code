import fs from 'fs';

// dial starts at 50
// password is the number of times the dial is left pointing at 0 after any rotation in the sequence.
// dial are the numbers 0 through 99 in order
// turing dial left decreases the number by the given amount, wrapping around to 99 if going below 0
// turning dial right increases the number by the given amount, wrapping around to 0 if going above 99

function puzzle1() {
  const codes = fs.readFileSync('src/day_01/input.txt', 'utf-8');

  let count = 0;
  let dial = 50;

  const codesArr = codes.split('\n');
  
  codesArr.forEach((code) => {
    const direction = code[0];
    const distance = Number(code.slice(1)) % 100;

    if (direction === 'L') {
      dial -= distance;
    } else {
      dial += distance;
    }

    if (dial < 0) {
      dial += 100;
    } else if (dial > 99) {
      dial -= 100;
    }

    if (dial === 0) {
      count++
    }
  });

  console.log('final answer:', count);
}

// count the number of times any click causes the dial to point at 0, regardless of whether it happens during a rotation or at the end of one.
function puzzle2() {
  const codes = fs.readFileSync('src/day_01/input.txt', 'utf-8');

  let count = 0;
  let dial = 50;

  const codesArr = codes.split('\n');

  codesArr.forEach((code) => {
    const direction = code[0];
    let distance = Number(code.slice(1));

    const fullLoops = Math.floor(distance / 100);
    count += fullLoops;

    const remainder = distance %= 100;

    if (remainder > 0 && dial !== 0) {
      const stepsToZero =
        direction === 'R'
          ? 100 - dial
          : dial;

      if (remainder >= stepsToZero) {
        count++;
      }
    }

    if (direction === 'R') {
        dial = (dial + remainder) % 100;
    } else {
      dial = (dial - remainder + 100) % 100;
    }
  })

  console.log('final answer', count);
}

puzzle2();