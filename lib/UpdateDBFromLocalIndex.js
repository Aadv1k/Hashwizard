const RainbowTable = require("./RainbowTable");
const HashModel = require("../models/HashModel.js");
const { readFileSync, existsSync } = require("fs");

const DB = new HashModel();

async function updateDB (path) {
  await DB.init();
  let hashes = ["md5", "sha1", "sha256"]

  for (let i = 0; i < hashes.length; i++) {
    const table = new RainbowTable(hashes[i]);

    if (!existsSync(path)) {
      throw `${path} was not found`;
    }

    const data = readFileSync(path, "utf-8");
    const parsedJson = table.fromArray(data.split('\n')).toJson();

    await DB.init();

    console.log(`[INFO] Updating DB for ${hashes[i]} via ${path}`)

    try {
      await DB.pushToCollection(hashes[i], parsedJson)
    } catch (err) {
      throw err;
    }
    
  }

  await DB.close();
}


(async () => {
  updateDB("./lib/database.txt");
})();

module.exports = updateDB;
