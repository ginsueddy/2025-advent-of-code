import fs from 'fs';

// The ranges are separated by commas (,); each range gives its first ID and last ID separated by a dash (-).
// you can find the invalid IDs by looking for any ID which is made only of some sequence of digits repeated twice
// sum up all the invalid ids

function puzzle1() {
  const input = fs.readFileSync('src/day_02/input.txt', 'utf-8');

  const ids = input.split(',');

  let sum = 0;

  ids.forEach(idRange => {
    const [startStr, endStr] = idRange.split('-');

    const start = Number(startStr);
    const end = Number(endStr);

    for (let i = start; i <= end; i++) {
      const idStr = i.toString();

      const midPoint = idStr.length / 2;

      const left = idStr.slice(0, midPoint);
      const right = idStr.slice(midPoint);

      if (left === right) {
        sum += i;
      }
    }
  }); 

  console.log('here is my final sum', sum)
}

// Now, an ID is invalid if it is made only of some sequence of digits repeated at least twice.
function puzzle2() {
  const input = fs.readFileSync('src/day_02/input.txt', 'utf-8');

  const ids = input.split(',');

  let sum = 0;

  ids.forEach(idRange => {
    const [startStr, endStr] = idRange.split('-');

    const start = Number(startStr);
    const end = Number(endStr);

    for (let i = start; i <= end; i++) {
      const idStr = i.toString();

      for (let j = 1; j <= Math.floor(idStr.length / 2); j++) {
        if (idStr.length % j !== 0) {
          continue;
        }

        const subId = idStr.slice(0, j);

        let isPattern = true;
        for (let k = j; k < idStr.length; k += j) {
          const chunk = idStr.slice(k, k + j);

          if (chunk !== subId) {
            isPattern = false;
            break;
          }
        }

        if (isPattern) {
          sum += i;
          break;
        }
      }
    }
  })

  console.log('heres the sum', sum)

}

// puzzle1();
puzzle2();

