const {PORT} = require("./common/const");
const server = require("./server");

const DumpData = require("./lib/DumpRemoteTableToFile.js");
const { crackAlgorithms } = require("./common/const.js");

const ARGS = process.argv.filter(e => e.startsWith("--")).map(e => e.slice(2).split('='));
(async () => {
  let argPort = ARGS.find(e => e[0] === "port")?.[1] ?? PORT;
  let argDump = !Boolean(ARGS.find(e => e[0] === "no-dump"));
  
  if (argDump) {
    await DumpData(crackAlgorithms)
  }

  server.listen(PORT, () => {
    console.log(`server listening at http://localhost:${argPort}`)
  })
})()


