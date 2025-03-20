"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class RedisConnector {
  client;
  duplicates;
  constructor(redisUrl) {
    this.client = (0, redis_1.createClient)({ url: redisUrl });
    this.duplicates = [];
    this.client.on("error", (err) => console.error("Redis Client Error:", err));
  }
  async connect() {
    await this.client.connect();
    console.log("Connected to Redis");
  }
  duplicate() {
    const dupe = this.client.duplicate();
    this.duplicates.push(dupe);
    return dupe;
  }
  async disconnect() {
    await this.client.disconnect();
    console.log("Disconnected from Redis");
  }
  async set(key, value) {
    await this.client.set(key, value);
  }
  async get(key) {
    return await this.client.get(key);
  }
}
exports.default = RedisConnector;
