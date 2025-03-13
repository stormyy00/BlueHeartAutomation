import { createClient, RedisClientType } from "redis";

class RedisConnector {
  public client: RedisClientType;
  public duplicates: RedisClientType[];

  constructor(redisUrl: string) {
    this.client = createClient({ url: redisUrl });
    this.duplicates = [];
    this.client.on("error", (err) => console.error("Redis Client Error:", err));
  }

  async connect(): Promise<void> {
    await this.client.connect();
    console.log("Connected to Redis");
  }

  duplicate(): RedisClientType {
    const dupe = this.client.duplicate();
    this.duplicates.push(dupe);
    return dupe;
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
    console.log("Disconnected from Redis");
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}

export default RedisConnector;
