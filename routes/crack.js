const { sendJsonResponse } = require("../common/utils");
const { ERROR } = require("../common/const");
const RainbowTable = require("../lib/RainbowTable");
const path = require("path");

const { existsSync, readFileSync } = require("fs");

const HashModel = require("../models/HashModel");

const DB = new HashModel();
const Table = new RainbowTable("");

const querystring = require("querystring");

module.exports = async ({ url }, res) => {
  let [_e, _a, _f, hashAlgorithm] = url.split("?").shift().split("/");
  hashAlgorithm = hashAlgorithm?.toLowerCase();
  const avaliableCracks = ["md5", "sha256", "sha1"];

  if (!hashAlgorithm || !avaliableCracks.find((e) => e === hashAlgorithm)) {
    sendJsonResponse(res, ERROR.invalidHashFunc, 400);
    return;
  }
  const { hash } = querystring.parse(url.split("?").pop());

  if (!hash) {
    sendJsonResponse(res, ERROR.missingHashParam, 400);
    return;
  }

  await DB.init();

  let rawJson;


  let dataPath = path.join(__dirname, `../data/data-${hashAlgorithm}.json`)


  if (existsSync(dataPath)) {
    rawJson = readFileSync(dataPath, 'utf-8');
  } else {
    rawJson = await DB.getFromCollection(hashAlgorithm)
  }


  let crackedText = Table.getFromJson(rawJson, hash);
  if (!crackedText) {
    sendJsonResponse(res, {
      status: 200,
      message: "was unable to crack the given hash",
      hash,
      text: null,
    });
    return;
  }

  sendJsonResponse(res, {
    status: 200,
    message: "successfully cracked the given hash",
    hash,
    text: crackedText,
  });
  
  await DB.close();
};
