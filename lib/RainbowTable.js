const crypto = require("crypto");
const fs = require("fs");

class RainbowTable {
  #nonce;
  #createHash(value) {
    return crypto.createHash(this.hashingAlgorithm).update(value).digest("hex");
  }

  constructor(hashingAlgorithm) {
    this.hashingAlgorithm = hashingAlgorithm ?? "md5";
    this.table = null;
    this.#nonce = 5;
  }

  reduceHash(hash, nonce) {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars[hash.charCodeAt(nonce + i) % chars.length];
    }
    return password;
  }

  fromArray(wordlist) {
    this.table = new Map();
    for (let i = 0; i < wordlist.length; i++) {
      this.table.set(this.reduceHash(this.#createHash(wordlist[i]), this.#nonce), wordlist[i]);
    }
    return this;
  }

  get(hash) {
    const reducedHash = this.reduceHash(hash, this.#nonce);
    return this.table.get(reducedHash) ?? null;
  }

  getFromJson(json, hash) {
    const parsed = JSON.parse(json);
    const reducedHash = this.reduceHash(hash, this.#nonce);
    return parsed?.[reducedHash] ?? null;
  }

  setHash(hash, value) {
    const target = this.reduceHash(hash, this.#nonce);
    try {
      this.table.set(target, value);
    } catch {
      return null;
    }
  }

  toJson() {
    let obj = Object.fromEntries(this.table);
    let str = JSON.stringify(obj);
    return str;
  }
}

module.exports = RainbowTable;
