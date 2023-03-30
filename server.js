const handleRouteHash = require("./routes/hash");
const handleRouteCrack = require("./routes/crack");

const http = require("http");

module.exports = http.createServer(async (req, res) => {
  const { url } = req;

  if (url === "/") {
    res.writeHead(200, {"Content-type": "text/html"});
    res.write("<h1>foo world</h1>");
  } else if (url.startsWith("/api/hash")) {
    handleRouteHash(req, res)
  } else if (url.startsWith("/api/crack")) {
    await handleRouteCrack(req, res)
  }
  res.end();
});
