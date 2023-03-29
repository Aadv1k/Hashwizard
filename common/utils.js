module.exports = {
  sendHtmlResponse: (res, html, code = 200) => {
    res.writeHead(code, { "Content-type": "text/html" });
    res.write(html);
  },

  sendJsonResponse: (res, obj, code = 200) => {
    res.writeHead(code, { "Content-type": "application/json" });
    res.write(JSON.stringify(obj));
  },
};
