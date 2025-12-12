import fs from 'fs';

const input = fs.readFileSync('src/day_12/input.txt', 'utf-8').trimEnd();

const blocks = input.split(/\r?\n\r?\n/);
const regionLines = blocks[blocks.length - 1].split(/\r?\n/).filter(Boolean);
const shapeBlocks = blocks.slice(0, -1);


// The first section lists the standard present shapes
// each shape starts with its index and a colon; then, the shape is displayed visually, where # is part of the shape and . is not.
// The second section lists the regions under the trees.
// Each line starts with the width and length of the region
// The rest of the line describes the presents that need to fit into that region by listing the quantity of each shape of present
// Presents can be rotated and flipped as necessary to make them fit in the available space
// how many of the regions can fit the presents listed.

const shapeCells: number[] = shapeBlocks.map((b) => {
  return (b.match(/#/g) ?? []).length;
});

function puzzle1() {
  let numOfValidRegions = 0;

  regionLines.forEach((region) => {
    const [dimensionsPart, countsPart] = region.split(':');

    const [widthStr, heightStr] = dimensionsPart.split('x');

    const width = Number(widthStr);
    const height = Number(heightStr);

    const counts = countsPart.trim().split(' ').map(Number);

    let need = 0;
      for (let i = 0; i < counts.length; i++) {
      need += counts[i] * shapeCells[i];
    }

    if (need <= width * height) {
      numOfValidRegions++;
    } 
  })

  console.log(numOfValidRegions)
}

// no puzzle 2

puzzle1();