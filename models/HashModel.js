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

  async pushLargeTextDataByName(name, data) {
    assert.strictEqual(typeof(data), "string");

    const stream = new Readable();
    stream.push(data);
    stream.push(null);

    const options = {
      filename: `data-${name}.txt`,
      contentType: 'text/plain'
    };


    const bucket = new GridFSBucket(this.db);
    const writeStream = bucket.openUploadStream(options.filename, options);

    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

  }

  async getLargeTextDataByName(name) {
    const bucket = new GridFSBucket(this.db);
    const readStream = bucket.openDownloadStreamByName(`data-${name}.txt`)

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

  async close() {
    await this.client.close();
  }
}

module.exports = HashModel;
