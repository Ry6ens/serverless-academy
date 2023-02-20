const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(path.resolve("./words/"));

function uniqueValues() {
  const array = [];

  files.forEach((file) => {
    if (path.extname(file) === ".txt") {
      const readFile = fs.readFileSync(`./words/${file}`, {
        encoding: "utf8",
      });
      const words = readFile.split("\n");
      array.push(words);
    }
  });

  const flatArray = array.flat();
  const result = new Set(flatArray);
  return result.size;
}

function existInAllFiles() {
  let count = 0;

  files.forEach((file) => {
    if (path.extname(file) === ".txt") {
      const readFile = fs.readFileSync(`./words/${file}`, {
        encoding: "utf8",
      });
      const words = readFile.split("\n");
      count = count + words.length;
    }
  });

  return count;
}

function existInAtleastTen(number) {
  let count = 0;

  for (i = 0; i < number; i++) {
    const file = files[i];
    const readFile = fs.readFileSync(`./words/${file}`, {
      encoding: "utf8",
    });
    const words = readFile.split("\n");
    count = count + words.length;
  }
  return count;
}

console.time("Execution Time");

console.log("uniqueValues:", uniqueValues());
console.log("existInAllFiles", existInAllFiles());
console.log("existInAtleastTen", existInAtleastTen(10));

console.timeEnd("Execution Time");
