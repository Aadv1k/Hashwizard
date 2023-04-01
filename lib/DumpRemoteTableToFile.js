const { writeFileSync, mkdirSync } = require("fs");

const HashModel = require("../models/HashModel");
const DB = new HashModel();

const MAX_ENTRIES = 1000;

async function DumpData(algos) {
  try {
    mkdirSync("data");
  } catch (EEXIST) { }
  await DB.init();

  for (let i = 0; i < algos.length; i ++) {
    console.log(`[INFO] Fetching data for ${algos[i]}`)
    const dataPath = `./data/data-${algos[i]}`;

    try {
      mkdirSync(dataPath);
    } catch (EEXIST) { }
    
    let rawJson = JSON.parse(await DB.getFromCollection(algos[i]));
    let entries = Object.entries(rawJson);

    let numOfEntries = Math.ceil(entries.length / MAX_ENTRIES);
    for (let j = 0; j < numOfEntries; j++) {
      const jsonChunk = JSON.stringify(Object.fromEntries(entries.slice(j*MAX_ENTRIES, (j+1)*MAX_ENTRIES)));
      writeFileSync(`${dataPath}/data-${j}.json`, jsonChunk)
    }
    console.log(`[INFO] Dumped data for ${algos[i]} to ${dataPath}`)
  }
  await DB.close();
}

module.exports = DumpData;
