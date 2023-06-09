const { readFileSync, existsSync } = require("fs");

module.exports = {
  sendHtmlResponse: (res, html, code = 200) => {
    res.writeHead(code, { "Content-type": "text/html" });
    res.write(html);
  },

  sendPublicFile: (res, path, code = 200) => {
    if (!existsSync(path)) {
      const content = readFileSync("./public/404.html", "utf-8");
      res.writeHead(code, { "Content-type": "text/html" });
      res.write(content);
      return;
    }

    const content = readFileSync(path, "utf-8");
    const ext = path.split(".").pop();
    // will work for JavaScript, CSS and html which is mostly what we care about
    res.writeHead(code, { "Content-type": `text/${ext === "js" ? "javascript" : ext}` });
    res.write(content);
    res.end();
    return;
  },

  sendJsonResponse: (res, obj, code = 200) => {
    res.writeHead(code, { "Content-type": "application/json" });
    res.write(JSON.stringify(obj));
  },
};
