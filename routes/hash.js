const { sendJsonResponse } = require("../common/utils");
const { ERROR } = require("../common/const");

const crypto = require("crypto");
const querystring = require("querystring");

module.exports = ({ url }, res) => {
  let [_e, _a, _f, hashAlgorithm] = url.split("?").shift().split("/");
  hashAlgorithm = hashAlgorithm?.toLowerCase();
  const avaliableHashes = [
    "md5",
    "sha256",
    "sha1",
    "sha224",
    "sha256",
    "sha384",
    "sha512",
    "sha3-224",
    "sha3-256",
    "sha3-384",
    "sha3-512",
    "shake128",
    "shake256",
  ];

  if (!hashAlgorithm || !avaliableHashes.find((e) => e === hashAlgorithm)) {
    sendJsonResponse(res, ERROR.invalidHashFunc, 400);
    return;
  }

  const { text } = querystring.parse(url.split("?").pop());

  if (!text) {
    sendJsonResponse(res, ERROR.missingTextParam, 400);
    return;
  }

  const hashedText = crypto
    .createHash(hashAlgorithm)
    .update(text)
    .digest("hex");

  sendJsonResponse(
    res,
    {
      status: 200,
      text,
      hash: hashedText,
    },
    200
  );
};
