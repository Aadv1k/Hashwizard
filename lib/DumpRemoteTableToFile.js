const path = require("path");
const RainbowTable = require("./RainbowTable");
const fs = require("fs");

const { readFileSync, mkdirSync } = require("fs");

const HashModel = require("../models/HashModel");

function generateKeyFromWord(hash, algorithm) {
  const table = new RainbowTable(algorithm);
  return table.reduceHash(table.createHash(hash), table.nonce);
}

function writeToJSONInChunk(
  data,
  basepath = "./",
  chunksize = 10,
  algorithm = "md5"
) {
  for (let i = 0; i < Math.ceil(data.length / chunksize); i++) {
    let output = "{\n";
    let arr = data.slice(i * chunksize, (i + 1) * chunksize);

    for (j = 0; j < arr.length; j++) {
      if (j + 1 === arr.length) {
        // wtf
        output += `\t"${arr[j]}": "${generateKeyFromWord(
          arr[j],
          algorithm
        )}"\n`;
        continue;
      }

      output += `\t"${arr[j]}": "${generateKeyFromWord(arr[j], algorithm)}",\n`;
    }
    output += "}";
    fs.writeFileSync(path.join(basepath, `data-${i}.json`), output);
    console.log(process.memoryUsage().rss / 1e6);
  }
}

function DumpData(algos) {
  try {
    mkdirSync("data");
  } catch (EEXIST) {}

  for (let i = 0; i < algos.length; i++) {
    console.log(`[INFO] Fetching data for ${algos[i]}`);
    const dataPath = `./data/data-${algos[i]}`;

    try {
      mkdirSync(dataPath);
    } catch (EEXIST) {}

    // Consumes about 150 worth of ram give or take
    writeToJSONInChunk(
      readFileSync("./database.txt", "utf-8").split("\n"),
      dataPath,
      1500,
      algos[i]
    );
    console.log(`[INFO] Dumped data for ${algos[i]} to ${dataPath}`)
  }
};

DumpData(["sha1", "md5", "sha256"]);
