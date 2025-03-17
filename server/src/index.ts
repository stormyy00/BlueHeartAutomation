import dotenv from "dotenv";
import express, { Express, Request, Response, json } from "express";
import { collection, doc, getDoc } from "firebase/firestore";
import { RedisClientType } from "redis";
import { sendEmail } from "./util/email";
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
  id: string;
  epochSchedule: string;
};

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

type Newsletter = {
  newsletter: string[];
};

app.put(
  "/api/scheduler",
  express.json(),
  async (req: Request, res: Response) => {
    try {
      const { id, epochSchedule } = req.body as Email;

      const date = new Date(epochSchedule);
      const now = new Date();
      // console.log(date.toLocaleString(), now.toLocaleString())
      const document = await getDoc(doc(collection(db, "newsletters"), id));
      const data = document.data() as Newsletter;
      const seconds = (date.getTime() - now.getTime()) / 1000;
      // console.log(seconds)
      if (date > now) {
        await put(id, seconds);
      } else {
        await sendEmail(
          data.newsletter.length > 0 ? data.newsletter[0] : "Subject here",
          data.newsletter.length > 1
            ? data.newsletter.slice(1).join("<br />")
            : "Body here",
          ["spacerocket62@gmail.com"],
        ).then(console.log);
      }
      // await put(uuid, 2);
      res.status(200).send("hi");
    } catch (e) {
      console.log(req.body, e);
      res.status(400).send("No work");
    }
  },
);

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  // const q = query(collection(db, "newsletters"));
  // const querySnapshot = await getDocs(q);
  // const newsletters = querySnapshot.docs.map((doc) => {
  //   const data = doc.data();
  //   return {
  //     newsletter: data.newsletter,
  //     newsletterId: data.newsletterId,
  //     status: data.status,
  //     scheduledDate: data.scheduledDate ?? 0,
  //   };
  // });
  // console.log(
  //   newsletters
  //     .filter((nl) => nl.scheduledDate != 0)
  //     .map((nl) => {
  //       nl.scheduledDate = new Date(nl.scheduledDate);
  //       return nl;
  //     }),
  // );
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
  await subscriber.subscribe(
    "__keyevent@0__:expired",
    async (expiredKey: string) => {
      // console.log(`Key expired: ${expiredKey}`);
      await onKeyExpired(expiredKey);
    },
  );
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
  await client.set(key, "", { EX: Math.floor(scheduled) });
  await redisConnector.disconnect();
};

const onKeyExpired = async (expiredKey: string) => {
  // This function will be triggered when a key expires
  // console.log(`Handling expired key: ${expiredKey}`);
  // Place your custom logic here (e.g., sending an HTTP request or updating your app state)
  const document = await getDoc(doc(collection(db, "newsletters"), expiredKey));
  const data = document.data() as Newsletter;
  //TODO: need recipients
  await sendEmail(
    data.newsletter.length > 0 ? data.newsletter[0] : "Subject here",
    data.newsletter.length > 1
      ? data.newsletter.slice(1).join("<br />")
      : "Body here",
    [],
  );
};
