const {PORT} = require("./common/const");
const server = require("./server");

const DumpData = require("./lib/DumpRemoteTableToFile.js");
const { crackAlgorithms } = require("./common/const.js");

(async () => {
  await DumpData(crackAlgorithms)
  server.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
  })
})()


