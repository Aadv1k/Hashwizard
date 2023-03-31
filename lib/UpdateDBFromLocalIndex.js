const RainbowTable = require("./RainbowTable");
const HashModel = require("../models/HashModel.js");
const { readFileSync, existsSync } = require("fs");

const DB = new HashModel();

function updateDB(path) {
  ["md5", "sha1", "sha256"].forEach(async e => {
    const table = new RainbowTable(e);

    if (!existsSync(path)) {
      throw `${path} was not found`;
    }

    const data = readFileSync(path, "utf-8");
    const parsedJson = table.fromArray(data.split('\n')).toJson();

    await DB.init();

    try {
      await DB.pushToCollection(e, parsedJson)
      console.log(`[INFO] Updated DB for ${e} via ${path}`)
    } catch (err) {
      throw err;
    }
  })
}


updateDB("./database.txt");

module.exports = updateDB;
