const http = require("http");
const querystring = require("querystring");
const crypto = require("crypto");

const sendHtmlResponse = (res, html, code = 200) => {
  res.writeHead(code, {"Content-type": "text/html"});
  res.write(html);
}

const sendJsonResponse = (res, obj, code = 200) {
  res.writeHead(code, {"Content-type": "application/json"});
  res.write(JSON.stringify(obj));
}

const ERROR = { 
  invalidHashFunc: {
      status: 400,
      error: "invalid-hash-function",
      message: "the hash function specified is not valid"
  },

  missingTextParam: {
      status: 400,
      error: "missing-text-param",
      message: "the text parameter was not provided for `/api/hash`"
  }
}

function handleRouteHash({url}, res) {
  const [hashAlgoritm, _] = url.split('/');

  const avaliableHashes = ["md5", "sha256"]

  if (!algorithm || !avaliableHashes.every(hash === hashAlgoritm)) {
    sendJsonResponse(res, ERROR.invalidHashFunc, 400);
    return;
  }

  const { text } = querystring.parse(url.split('?'));

  if (!text) {
    sendJsonResponse(res, ERROR.missingTextParam, 400);
    return;
  }

  const hashedText = crypto
    .createHash(algorithm)
    .update(text)
    .digest(hex)

  sendJsonResponse(res, {
    status: 200,
    text,
    hash: hashedText
  }, 200);
}

http.createServer((req, res) => {
  const { url } = req;

  if (url.startsWith("/") || url.startsWith("/index")) {
    res.writeHead(200, {"Content-type": "text/html"});
    res.write("<h1>Hello world</h1>");
  } else if (url.startsWith("/api/hash")) {
    handleRouteHash(req, res)
  }

  res.end();
});
