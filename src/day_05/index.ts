import fs from 'fs';

const input = fs.readFileSync('src/day_05/input.txt', 'utf-8');

// Input consists of a list of fresh ingredient ID ranges, a blank line, and a list of available ingredient IDs.
// fresh ID ranges are inclusive
// ranges can also overlap; an ingredient ID is fresh if it is in any range.
// How many of the available ingredient IDs are fresh?

function puzzle1() {
  const [freshIDRanges, ids] = input.split('\n\n');
  
  const freshIDRangesArr = freshIDRanges.split('\n');
  const idsArr = ids.split('\n');

  let freshCount = 0;
  
  for (const idStr of idsArr) {
    const id = Number(idStr);
    const freshCountFound = freshIDRangesArr.some((freshIDRange) => {
      const [lowerBoundStr, upperBoundStr] = freshIDRange.split('-');
      const lowerBound = Number(lowerBoundStr)
      const upperBound = Number(upperBoundStr);

      return lowerBound <= id && id <= upperBound;
    })
    
    if (freshCountFound) {
      freshCount++
    }
  }

  console.log('freshcount', freshCount)
}

// the Elves would like to know all of the IDs that the fresh ingredient ID ranges consider to be fresh
function puzzle2() {
  const [freshIDRanges] = input.split('\n\n');
  const freshIDRangesArr = freshIDRanges.split('\n');


  freshIDRangesArr.sort((a, b) => {
    const [lowerBoundAStr] = a.split('-');
    const lowerBoundA = Number(lowerBoundAStr);

    const [lowerBoundBStr] = b.split('-');
    const lowerBoundB = Number(lowerBoundBStr);

    return lowerBoundA - lowerBoundB;
  })

  let total = 0;
  let pointerPos = -1;

  for (const freshIDRange of freshIDRangesArr) {
    const [lowerBoundStr, upperBoundStr] = freshIDRange.split('-');
    let lowerBound = Number(lowerBoundStr);
    const upperBound = Number(upperBoundStr);

    if (pointerPos >= upperBound) {
      continue;
    }

    if (pointerPos >= lowerBound) {
      lowerBound = pointerPos + 1;
    }

    pointerPos = upperBound;
    total += upperBound - lowerBound + 1;
  }

  console.log('total', total);
}

// puzzle1();
puzzle2();