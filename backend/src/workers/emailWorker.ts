
import "dotenv/config";
import prisma from "../db";
import { sendEmail } from "../services/emailService";

const CHECK_INTERVAL = 5000; // check every 5 seconds

async function processScheduledEmails() {
  try {
    const now = new Date();

    const emails = await prisma.email.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now,
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    if (emails.length === 0) {
      return;
    }

    console.log(`Found ${emails.length} email(s) ready to send.`);

    for (const email of emails) {
      try {
        console.log(`Sending email: ${email.id}`);

        await sendEmail(
          email.recipient,
          email.subject,
          email.body
        );

        await prisma.email.update({
          where: {
            id: email.id,
          },
          data: {
            status: "SENT",
            sentAt: new Date(),
            errorMessage: null,
          },
        });

        console.log(`Email ${email.id} sent successfully.`);
      } catch (error) {
        console.error(`Failed to send email ${email.id}:`, error);

        await prisma.email.update({
          where: {
            id: email.id,
          },
          data: {
            attempts: {
              increment: 1,
            },
            errorMessage:
              error instanceof Error
                ? error.message
                : String(error),
          },
        });
      }
    }
  } catch (error) {
    console.error("Worker error:", error);
  }
}

console.log("Email worker started.");
console.log("Checking for scheduled emails every 5 seconds...");

setInterval(processScheduledEmails, CHECK_INTERVAL);

processScheduledEmails();
