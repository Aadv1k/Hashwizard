const { PORT } = require("../common/const");
const { spawn } = require("child_process");

const http = require("http");

const test = require("../lib/nod/testing/basic");

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () => resolve(data));
      res.on("error", (err) => reject(err));
    });
  });
}

const child = spawn("node", ["index"], { detached: true });
const baseURL = `http://localhost:${PORT}`;

console.log("GET /api/:hash");

new test("the error should match `invalid-hash-function`", async (t) => {
  let response = await get(`${baseURL}/api/hash`);
  let data = JSON.parse(response);

  t.is(data.status, 400);
  t.is(data.error, "invalid-hash-function");
  t.pass();
});

new test("msg should return valid sha1 hash", async (t) => {
  let msg = "hello";
  let hashedMsg = "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d";

  let response = await get(`${baseURL}/api/hash/sha1?text=${msg}`);
  let data = JSON.parse(response);

  t.is(data.status, 200);
  t.is(data.hash, hashedMsg);
  t.pass();

})

setTimeout(() => {
  new test("msg should return valid md5 hash", async (t) => {
    let msg = "hello";
    let hashedMsg = "5d41402abc4b2a76b9719d911017c592";

    let response = await get(`${baseURL}/api/hash/md5?text=${msg}`);
    let data = JSON.parse(response);

    t.is(data.status, 200);
    t.is(data.hash, hashedMsg);
    t.pass();
    child.kill();
  });


}, 500)

