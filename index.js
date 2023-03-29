const {PORT} = require("./common/const");
const server = require("./server");

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`)
})
