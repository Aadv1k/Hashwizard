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
  } else {
    sendPublicFile(res, `./public/${url}`);
  }
  res.end();
});
