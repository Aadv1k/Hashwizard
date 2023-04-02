const handleRouteHash = require("./routes/hash");
const handleRouteCrack = require("./routes/crack");

const http = require("http");

const { sendPublicFile } = require("./common/utils");

module.exports = http.createServer(async (req, res) => {
  const { url } = req;

  if (url === "/") {
    sendPublicFile(res, "./public/index.html");
  } else if (url.startsWith("/api/hash")) {
    handleRouteHash(req, res)
  } else if (url.startsWith("/api/crack")) {
    await handleRouteCrack(req, res)
  } else if (url.startsWith("/crack")) {
    sendPublicFile(res, `./public/crack.html`);
  } else if (url.startsWith("/hash")) {
    sendPublicFile(res, `./public/hash.html`);
  } else if (url.startsWith("/api")) {
    sendPublicFile(res, `./public/api.html`);
  }
  else {
    sendPublicFile(res, `./public/${url}`);
  }
  res.end();
});
