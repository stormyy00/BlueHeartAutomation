"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const firestore_1 = require("firebase/firestore");
const email_1 = require("./util/email");
const firebase_1 = require("./util/firebase");
const redis_connector_1 = __importDefault(require("./util/redis.connector"));
dotenv_1.default.config({
  path: "../.env",
});
const app = (0, express_1.default)();
app.use((0, express_1.json)());
const port = 3001;
const redisConnector = new redis_connector_1.default(
  process.env.REDIS_URL ?? "",
);
const getOrg = async (uuid) => {
  const result = await (0, firestore_1.getDocs)(
    (0, firestore_1.query)(
      (0, firestore_1.collection)(firebase_1.db, "orgs"),
      (0, firestore_1.where)("id", "==", uuid),
      (0, firestore_1.limit)(1),
    ),
  );
  if (result.empty) return undefined;
  return result.docs[0].data();
};
app.put("/api/scheduler", express_1.default.json(), async (req, res) => {
  try {
    const { id, epochSchedule } = req.body;
    const date = new Date(epochSchedule);
    const now = new Date();
    // console.log(date.toLocaleString(), now.toLocaleString())
    const document = await (0, firestore_1.getDoc)(
      (0, firestore_1.doc)(
        (0, firestore_1.collection)(firebase_1.db, "newsletters"),
        id,
      ),
    );
    const data = document.data();
    // console.log(data)
    if (!data) return;
    const organizationDoc = await getOrg(data.orgId);
    // console.log(organizationDoc)
    const seconds = (date.getTime() - now.getTime()) / 1000;
    // console.log(data)
    // console.log(seconds)
    if (date > now) {
      await put(id, seconds);
    } else {
      onKeyExpired(id);
    }
    // await put(uuid, 2);
    res.status(200).send("hi");
  } catch (e) {
    console.log(req.body, e);
    res.status(400).send("No work");
  }
});
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
  const subscriber = redisConnector.duplicate();
  client.on("error", (err) => console.error("Redis Client Error:", err));
  subscriber.on("error", (err) =>
    console.error("Redis Subscriber Error:", err),
  );
  await subscriber.connect();
  // Enable keyspace notifications for expired events (for DB 0)
  await client.configSet("notify-keyspace-events", "Ex");
  // Subscribe to the expiration channel for database 0
  await subscriber.subscribe("__keyevent@0__:expired", async (expiredKey) => {
    // console.log(`Key expired: ${expiredKey}`);
    await onKeyExpired(expiredKey);
  });
  const newsletters = await (0, firestore_1.getDocs)(
    (0, firestore_1.collection)(firebase_1.db, "newsletters"),
  );
  const now = new Date();
  for (const doc of newsletters.docs) {
    const data = doc.data();
    if (
      (data.status ?? "") === "scheduled" &&
      new Date(data.scheduledDate ?? Date.now()) <= now
    ) {
      onKeyExpired(doc.id);
    }
  }
  await redisConnector.disconnect();
});
// process.on("exit", async () => {
//   console.log("EXIT: Disconnecting all open redis connections!");
//   await shutdown();
// });
// process.on("SIGINT", async () => {
//   console.log("SIGINT: Disconnecting all open redis connections!");
//   await shutdown();
// });
const shutdown = async () => {
  if (redisConnector.client.isOpen) {
    await redisConnector.disconnect();
  }
  for (const dupe of redisConnector.duplicates.filter((dupe) => dupe.isOpen)) {
    dupe.disconnect();
  }
};
const put = async (key, scheduled) => {
  if (!redisConnector.client.isOpen) {
    await redisConnector.connect();
  }
  const client = redisConnector.client;
  await client.set(key, "", { EX: Math.floor(scheduled) });
  await redisConnector.disconnect();
};
const parseParagraph = (obj, content) => {
  let result = "";
  if (obj.content && obj.content.length > 0) {
    let rawLine = "";
    for (const line of obj.content ?? []) {
      const finishingTags = []; // queue
      if ("marks" in line) {
        const marks = line.marks.map((item) => item.type);
        marks.forEach((mark) => {
          if (mark === "bold") {
            rawLine += "<b>";
            finishingTags.push("</b>");
          } else if (mark === "italic") {
            rawLine += "<i>";
            finishingTags.push("</i>");
          }
        });
      }
      rawLine += line.text.replace("\n", "<br />");
      while (finishingTags.length > 0) {
        rawLine += finishingTags.pop();
      }
      // if (content.indexOf(obj) < content.length - 1) {
      //   result += "<br />"
      // }
    }
    result += `<p style="color: black !important; margin: 0;">${rawLine}</p>`;
  } else {
    result += "<br />";
  }
  return result;
};
const onKeyExpired = async (expiredKey) => {
  // This function will be triggered when a key expires
  // console.log(`Handling expired key: ${expiredKey}`);
  // Place your custom logic here (e.g., sending an HTTP request or updating your app state)
  const document = await (0, firestore_1.getDoc)(
    (0, firestore_1.doc)(
      (0, firestore_1.collection)(firebase_1.db, "newsletters"),
      expiredKey,
    ),
  );
  const data = document.data();
  const organizationDoc = await getOrg(data?.orgId);
  const newsletterBody = data.newsletter;
  let body = "Body here";
  if (newsletterBody instanceof Array) {
    // old format
    body = newsletterBody.join("<br />");
  } else {
    // new format
    const content = newsletterBody.content ?? [];
    let stringBody = "";
    for (const obj of content) {
      if (obj.type === "paragraph") {
        stringBody += parseParagraph(obj, content);
      } else if (obj.type === "bulletList") {
        for (const bullet of obj.content ?? []) {
          const bulletContent = bullet.content[0];
          if (bulletContent.type === "paragraph") {
            const body = parseParagraph(bulletContent, obj.content);
            stringBody += `<ul>${body
              .replace("<br />", "")
              .split("\n")
              .map((text) => `<li>${text}</li>`)}</ul>`;
          }
        }
      }
    }
    body = stringBody === "" ? body : stringBody;
  }
  const template = data.template ?? "vibrant";
  const recipients =
    organizationDoc?.groups.filter(
      (group) => group.name === data?.recipientGroup,
    )[0]?.emails ?? [];
  if (recipients.length > 0) {
    await (0, email_1.sendEmail)(
      data?.subject ?? "Subject here",
      `<p style="color: black !important; margin: 0;">${body}</p>`,
      recipients,
      template,
    ).then(async (res) => {
      await (0, firestore_1.updateDoc)(
        (0, firestore_1.doc)(
          (0, firestore_1.collection)(firebase_1.db, "newsletters"),
          expiredKey,
        ),
        {
          status: "sent",
        },
      );
    });
  }
};
