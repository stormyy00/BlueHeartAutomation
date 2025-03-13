import dotenv from "dotenv";
import express, { Express, Request, Response, json } from "express";
import { collection, getDocs, query } from "firebase/firestore";
import { RedisClientType } from "redis";
import { db } from "./util/firebase";
import RedisConnector from "./util/redis.connector";

dotenv.config({
  path: "../.env",
});
const app: Express = express();
app.use(json());

const port = 3001;

const redisConnector = new RedisConnector(process.env.REDIS_URL ?? "");

type Email = {
  uuid: string;
};

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.put(
  "/newsletter/create",
  express.json(),
  async (req: Request, res: Response) => {
    try {
      const data = req.body as Email;
      console.log(data.uuid);
      await put(data.uuid, 2);
      res.status(200).send("hi");
    } catch (e) {
      console.log(req.body, e);
      res.status(400).send("No work");
    }
  },
);

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  const q = query(collection(db, "newsletters"));
  const querySnapshot = await getDocs(q);
  const newsletters = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      newsletter: data.newsletter,
      newsletterId: data.newsletterId,
      newsletterStatus: data.newsletterStatus,
      scheduledDate: data.scheduledDate ?? 0,
    };
  });
  console.log(
    newsletters
      .filter((nl) => nl.scheduledDate != 0)
      .map((nl) => {
        nl.scheduledDate = new Date(nl.scheduledDate);
        return nl;
      }),
  );
  await redisConnector.connect();
  const client = redisConnector.client;
  const subscriber: RedisClientType = redisConnector.duplicate();

  client.on("error", (err) => console.error("Redis Client Error:", err));
  subscriber.on("error", (err) =>
    console.error("Redis Subscriber Error:", err),
  );
  await subscriber.connect();

  // Enable keyspace notifications for expired events (for DB 0)
  await client.configSet("notify-keyspace-events", "Ex");

  // Subscribe to the expiration channel for database 0
  await subscriber.subscribe("__keyevent@0__:expired", (expiredKey) => {
    console.log(`Key expired: ${expiredKey}`);
    onKeyExpired(expiredKey);
  });
  await redisConnector.disconnect();
});

process.on("exit", async () => {
  console.log("EXIT: Disconnecting all open redis connections!");
  await shutdown();
});
process.on("SIGINT", async () => {
  console.log("SIGINT: Disconnecting all open redis connections!");
  await shutdown();
});

const shutdown = async () => {
  if (redisConnector.client.isOpen) {
    await redisConnector.disconnect();
  }
  for (const dupe of redisConnector.duplicates.filter((dupe) => dupe.isOpen)) {
    dupe.disconnect();
  }
};

const put = async (key: string, scheduled: number) => {
  if (!redisConnector.client.isOpen) {
    await redisConnector.connect();
  }
  const client = redisConnector.client;
  await client.set(key, "", { EX: scheduled });
  await redisConnector.disconnect();
};

const onKeyExpired = (expiredKey: string) => {
  // This function will be triggered when a key expires
  console.log(`Handling expired key: ${expiredKey}`);
  // Place your custom logic here (e.g., sending an HTTP request or updating your app state)
};
