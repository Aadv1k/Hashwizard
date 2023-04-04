const { sendJsonResponse } = require("../common/utils");
const { ERROR, dump1 } = require("../common/const");
const RainbowTable = require("../lib/RainbowTable");
const path = require("path");
const assert = require("assert");


const { existsSync, readFileSync, readdirSync } = require("fs");

const HashModel = require("../models/HashModel");

const DB = new HashModel();
const Table = new RainbowTable("");

const querystring = require("querystring");

function extractCrackQueryFromDataChunks(dataFolderPath, hashAlgorithm, textToCrack) {
  const files = readdirSync(dataFolderPath);
  assert.strictEqual(typeof(textToCrack), "string");
  const table = new RainbowTable(hashAlgorithm);

  for (let i = 0; i < files.length; i++) {
    const fullJSONChunkPath = path.join(dataFolderPath, files[i]);
    const foundHash = table.getFromJson(readFileSync(fullJSONChunkPath, 'utf-8'), textToCrack)
    if (foundHash) {
      return foundHash;
    }
    continue;
  }
  return null;
}

module.exports = async ({ url }, res) => {
  let [_e, _a, _f, hashAlgorithm] = url.split("?").shift().split("/");
  hashAlgorithm = hashAlgorithm?.toLowerCase();
  const avaliableCracks = ["md5", "sha256", "sha1"];

  if (!hashAlgorithm || !avaliableCracks.find((e) => e === hashAlgorithm)) {
    sendJsonResponse(res, ERROR.invalidHashFunc, 400);
    return;
  }
  const { hash: textToCrack } = querystring.parse(url.split("?").pop());

  if (!textToCrack) {
    sendJsonResponse(res, ERROR.missingHashParam, 400);
    return;
  }

  let dataFolderPath = path.join(__dirname, `../data/data-${hashAlgorithm}/`)

  let rawText, crackedText;

  if (existsSync(dataFolderPath)) {
    crackedText = extractCrackQueryFromDataChunks(dataFolderPath, hashAlgorithm, textToCrack);
  } else {
    sendJsonResponse(ERROR.internalErr);
    // README: This works, but may overflow our limited memory enviorment
    // DB.init()
    // rawText = await DB.getLargeTextDataByName(dump1)
    // crackedText = Table.fromArray(rawText.split('\n')).get(textToCrack);
    // await DB.close();
    return;
  }

  if (!crackedText) {
    sendJsonResponse(res, {
      status: 200,
      message: "was unable to crack the given hash",
      hash: textToCrack,
      text: null,
    });
    return;
  }

  sendJsonResponse(res, {
    status: 200,
    message: "successfully cracked the given hash",
    hash: textToCrack,
    text: crackedText,
  });

  res.end();
};
