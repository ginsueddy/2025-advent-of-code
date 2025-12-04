import fs from 'fs';

const input = fs.readFileSync('src/day_03/input.txt', 'utf-8');
const batteryBanks = input.split('\n');

// The batteries are each labeled with their joltage rating, a value from 1 to 9
// Within each bank, you need to turn on exactly two batteries
// the joltage that the bank produces is equal to the number formed by the digits on the batteries you've turned on
// cannot rearrange batteries
// need to find the largest possible joltage each bank can produce.
// total output joltage is the sum of the maximum joltage from each bank
function puzzle1() {
  let sum = 0;

  batteryBanks.forEach((batteryBank) => {
    const auxStorage = new Map<string, Set<string>>();

    for (let i = 0; i < batteryBank.length - 1; i++) {
      const battery = batteryBank[i];

      if (auxStorage.has(battery)) {
        continue;
      }

      const set = new Set<string>();
      auxStorage.set(battery, set);

      for (let j = i + 1; j < batteryBank.length; j++) {
        const batteryComp = batteryBank[j];
        auxStorage.get(battery)?.add(batteryComp);
      }
    }

    let max = 0;

    for (let i = 9; i >= 1; i--) {
      const iStr = i.toString();
      
      if (!auxStorage.has(iStr)) {
        continue;
      }

      const set = auxStorage.get(iStr);

      set?.forEach((comp) => {
        if (Number(comp) > max) {
          max = Number(comp);
        }
      })


      const highestJoltage = i + max.toString();
      
      sum += Number(highestJoltage);
      
      break;
    }
  })

  console.log('sum', sum)
}

// the only difference is that now there will be 12 digits in each bank's joltage output instead of two.
function puzzle2() {
  let sum = 0;

  batteryBanks.forEach(batteryBank => {
    let remainingBatteriesNeeded = 12;
    let searchIndexStart = 0;
    let result = '';

    while (remainingBatteriesNeeded > 0) {
      const searchIndexLimit = batteryBank.length - remainingBatteriesNeeded;

      let bestDigit = 0;
      let bestIndex = -1;

      for (let i = searchIndexStart; i <= searchIndexLimit; i++) {
        const battery = Number(batteryBank[i]);

        if (battery > bestDigit) {
          bestDigit = battery;
          bestIndex = i;
        }
      }
      
      result += bestDigit.toString();
      searchIndexStart = bestIndex + 1;
      remainingBatteriesNeeded--;
    }

    sum += Number(result)
  })
  
  console.log('sum', sum)
}

// puzzle1();
puzzle2();