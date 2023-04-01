const HashModel = require("../models/HashModel.js");
const { readFileSync, existsSync } = require("fs");
const { dump1 } = require("../common/const");

const DB = new HashModel();

async function updateDB(path) {
  await DB.init();

  if (!existsSync(path)) {
    console.error(`[ERROR] ${path} not found`);
    return;
  }

  let data = readFileSync(path, "utf-8");

  console.log(`[INFO] Pushing ${path} to DB`)

  try {
    await DB.pushLargeTextDataByName(dump1, data)
  } catch (err) {
    throw err;
  }
  await DB.close();
}

(async () => {
  let args = process.argv;
  if (!args[2]) {
    console.log("[ERROR] need a database txt file");
    return;
  }
  updateDB(args[2]);
})();

module.exports = updateDB;
