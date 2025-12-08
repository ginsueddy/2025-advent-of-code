import fs from 'fs';

const input = fs.readFileSync('src/day_06/input.txt', 'utf-8');

// a list of problems; each problem has a group of numbers that need to be either added (+) or multiplied (*) together.
// Each problem's numbers are arranged vertically
// at the bottom of the problem is the symbol for the operation that needs to be performed.
// Problems are separated by a full column of only spaces.
// find the grand total of adding together all of the answers to the individual problems.

function puzzle1() {
  const lines = input.split('\n');

  // col number as the key
  const auxStorage = new Map<number, Array<number>>();

  for (let i = 0; i < lines.length - 1; i++) {
    const lineArr = lines[i].split(' ').filter((value) => value.length > 0);

    lineArr.forEach((numStr, index) => {
      const num = Number(numStr);

      if (!auxStorage.has(index)) {
        auxStorage.set(index, [num]);
      } else {
        auxStorage.get(index)?.push(num);
      }
    })
  }


  const operations = lines[lines.length - 1].split(' ').filter((value) => value.length > 0);

  let totalSum = 0;
  operations.forEach((operation, index) => {
    let sum = operation === '+' ? 0 : 1;

    const numsArr = auxStorage.get(index);

    numsArr?.forEach(num => {
      if (operation === '+') {
        sum += num;
      } else {
        sum *= num;
      }
    })


    totalSum += sum;
  })

  console.log('totalsum', totalSum)
}

// math is written right-to-left in columns
// Each number is given in its own column, with the most significant digit at the top and the least significant digit at the bottom

function puzzle2() {
  const lines = input.split('\n');

  const operationsLine = lines[lines.length - 1];
  const width = operationsLine.length;

  let total = 0;
  let currentNums: Array<number> = [];
  let operation = '+';

  for (let col = width - 1; col >= 0; col--) {
    let newNumStr = '';
    for (let i = 0; i < lines.length; i++) {
      let currentRow = lines[i];
      if (currentRow[col] === '+' || currentRow[col] === '*') {
        operation = currentRow[col];
      } else if (currentRow[col]) {
        newNumStr += currentRow[col];
      }
    }

    if (!Number(newNumStr)) {
      let solution = operation === '*' ? 1 : 0;

      currentNums.forEach(num => {
        if (operation === '+') {
          solution += num;
        } else {
          solution *= num;
        }
      })
      

      currentNums = [];
      total += solution;
    } else if (newNumStr.length > 0) {
      const num = Number(newNumStr);
      currentNums.push(num);
    }


  }

  let solution = operation === '*' ? 1 : 0;

  currentNums.forEach(num => {
    if (operation === '+') {
      solution += num;
    } else {
      solution *= num;
    }
  })

  total += solution;

  console.log(total);
}

// puzzle1();
puzzle2();