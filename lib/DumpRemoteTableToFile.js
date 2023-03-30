const { writeFileSync, mkdirSync } = require("fs");

const HashModel = require("../models/HashModel");
const DB = new HashModel();

module.exports = async (algos) => {
  try {
    mkdirSync("data");
  } catch (EEXIST) { }

  await DB.init();

  for (let i = 0; i < algos.length; i ++) {
    console.log(`[INFO] Fetching data for ${algos[i]}`)
    let rawJson = await DB.getFromCollection(algos[i]);
    writeFileSync(`./data/data-${algos[i]}.json`, rawJson)
    console.log(`[INFO] Dumped data for ${algos[i]} to ./data/data-${algos[i]}.json`)
  }

  await DB.close();
}
