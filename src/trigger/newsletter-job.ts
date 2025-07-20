import { logger, schedules } from "@trigger.dev/sdk/v3";
import { db } from "@/utils/admin";
import { sendEmail } from "@/utils/email";
import { contentToHtml } from "@/utils/parser";

export const emailNewsletterJob = schedules.task({
  id: "send-newsletters",
  cron: "*/5 * * * *", // every 5 minutes
  maxDuration: 300,
  run: async () => {
    const now = Date.now();
    let count = 0;

    logger.log("Checking for scheduled newsletters to send...");

    const newslettersRef = db.collection("newsletters");
    const snapshot = await newslettersRef
      .where("status", "==", "scheduled")
      .where("scheduledDate", "<=", now)
      .get();

    if (snapshot.empty) {
      logger.log("No newsletters to send.");
      return;
    }

    for (const d of snapshot.docs) {
      const data = d.data();

      let recipients: string[] = [];
      const orgId = data.orgId;
      const recipientGroup = data.recipientGroup;

      if (orgId && recipientGroup) {
        try {
          const orgRef = db.collection("orgs").doc(orgId);
          const orgSnap = await orgRef.get();

          if (orgSnap.exists) {
            const orgData = orgSnap.data();
            const group = Array.isArray(orgData?.groups)
              ? orgData?.groups.find(
                  (g) =>
                    g.name &&
                    g.name.trim().toLowerCase() ===
                      recipientGroup.trim().toLowerCase(),
                )
              : null;
            recipients =
              group && Array.isArray(group.emails) ? group.emails : [];
          }
        } catch (err) {
          logger.error(
            `Failed to fetch org/group for newsletter ${d.id}: ${err}`,
          );
          continue;
        }
      }

      if (!Array.isArray(recipients) || recipients.length === 0) {
        logger.error(
          `Newsletter ${d.id} skipped: no recipients found for group '${recipientGroup}' in org '${orgId}'`,
        );
        continue;
      }

      let body = data.body;

      if (!body || !body.trim()) {
        if (Array.isArray(data.content)) {
          body = contentToHtml(data.content);
        } else if (data.newsletter && Array.isArray(data.newsletter.content)) {
          body = contentToHtml(data.newsletter.content);
        }
      }

      if (!body || !body.trim()) {
        logger.error(`Newsletter ${d.id} skipped: missing body`);
        continue;
      }

      if (!data.subject) {
        logger.error(`Newsletter ${d.id} skipped: missing subject`);
        continue;
      }

      try {
        await sendEmail(data.subject, body, recipients, data.template);
        await db.collection("newsletters").doc(d.id).update({
          status: "sent",
          sentDate: now,
        });
        count++;
        logger.log(
          `Newsletter ${d.id} sent to ${recipients.length} recipients.`,
        );
      } catch (error) {
        logger.error(`Failed to send newsletter ${d.id}: ${error}`);
      }
    }

    logger.log(`Sent ${count} newsletters.`);
  },
});
