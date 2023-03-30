const { MongoClient, GridFSBucket } = require("mongodb");
const assert = require("assert");
const { Readable, Writable } = require("stream");
require("dotenv").config();
const MONGO_ATLAS_URL = `mongodb+srv://user-1:${process.env.MONGO_ATLAS_PWD}@hashwizard-dev.j7zsgcn.mongodb.net/?retryWrites=true&w=majority`;

class HashModel {
  constructor() {
    this.client = new MongoClient(MONGO_ATLAS_URL);
    this.db = null;
  }

  async init() {
    await this.client.connect().catch((error) => {
      throw error;
    });
    this.db = this.client.db("HashDB");
  }

  async pushToCollection(name, data) {
    assert.strictEqual(typeof(data), "string");

    const stream = new Readable();
    stream.push(data);
    stream.push(null);

    const options = {
      filename: `data-${name}.json`,
      contentType: 'application/json'
    };

    const bucket = new GridFSBucket(this.db);
    const writeStream = bucket.openUploadStream(options.filename, options);

    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }

  async getFromCollection(name) {
    const bucket = new GridFSBucket(this.db);
    const readStream = bucket.openDownloadStreamByName(`data-${name}.json`)

    let output = "";
    const writeStream = new Writable({
      write(chunk, _, callback) {
        output += chunk.toString();
        callback();
      },
    });

    readStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return output;
  }

  async getFromMd5() {
    return await this.getFromCollection("md5");
  }

  async pushToMd5(data) {
    await this.pushToCollection("md5", data);
  }

  async getFromSha256() {
    return await this.getFromCollection("sha256");
  }

  async pushToSha256(data) {
    await this.pushToCollection("sha256", data);
  }

  async getFromSha1() {
    return await this.getFromCollection("sha1");
  }

  async pushToSha1(data) {
    await this.pushToCollection("sha1", data);
  }

  async close() {
    await this.client.close();
  }
}

module.exports = HashModel;
