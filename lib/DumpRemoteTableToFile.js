const path = require("path");
const RainbowTable = require("./RainbowTable");
const fs = require("fs");

const { readFileSync, mkdirSync } = require("fs");

const { dump1, CHUNK_SIZE } = require("../common/const");

const HashModel = require("../models/HashModel");
const DB = new HashModel();

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
      output += `\t"${generateKeyFromWord(arr[j], algorithm)}": "${arr[j]}"\n`;
        continue;
      }

      output += `\t"${generateKeyFromWord(arr[j], algorithm)}": "${arr[j]}",\n`;
    }
    output += "}";
    fs.writeFileSync(path.join(basepath, `data-${i}.json`), output);
  }
}

async function DumpData(algos) {
  await DB.init();

  try {
    mkdirSync("data");
  } catch (EEXIST) {}


  const textData = await DB.getLargeTextDataByName(dump1);
  for (let i = 0; i < algos.length; i++) {
    console.log(`[INFO] Fetching data for ${algos[i]}`)
    const dataPath = `./data/data-${algos[i]}`;

    try {
      mkdirSync(dataPath);
    } catch (EEXIST) {}

    // Consumes about 150 worth of ram give or take
    writeToJSONInChunk(
      textData.split("\n"),
      dataPath,
      CHUNK_SIZE,
      algos[i]
    );
    console.log(`[INFO] Dumped data for ${algos[i]} to ${dataPath}`)
  }
  
  DB.close();
};

module.exports = DumpData;
