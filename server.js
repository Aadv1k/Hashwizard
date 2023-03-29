const handleRouteHash = require("./routes/hash");
const http = require("http");

module.exports = http.createServer((req, res) => {
  const { url } = req;
  console.log(url);
  if (url === "/") {
    res.writeHead(200, {"Content-type": "text/html"});
    res.write("<h1>foo world</h1>");
  } else if (url.startsWith("/api/hash")) {
    handleRouteHash(req, res)
  }
  res.end();
});
