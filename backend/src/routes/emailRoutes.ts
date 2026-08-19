
import { Router } from "express";
import { randomUUID } from "crypto";
import prisma from "../db";

const router = Router();

// Get scheduled emails
router.get("/scheduled", async (req, res) => {
  try {
    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;

    const emails = await prisma.email.findMany({
      where: {
        status: "SCHEDULED",
        ...(userId ? { userId } : {}),
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    console.log("Scheduled emails found:", emails.length);

    res.status(200).json(emails);
  } catch (error) {
    console.error("Failed to fetch scheduled emails:", error);

    res.status(500).json({
      message: "Failed to fetch scheduled emails",
    });
  }
});

// Schedule a new email
router.post("/schedule", async (req, res) => {
  try {
    console.log("SCHEDULE REQUEST:", req.body);

    const {
      userId,
      senderId,
      recipient,
      subject,
      body,
      scheduledAt,
    } = req.body;

    // Check required fields
    if (
      !userId ||
      !senderId ||
      !recipient ||
      !subject ||
      !body ||
      !scheduledAt
    ) {
      console.log("Missing required fields:", req.body);

      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check that the date is valid
    const scheduledDate = new Date(scheduledAt);

    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({
        message: "Invalid scheduled date",
      });
    }

    // Save email to database
    const email = await prisma.email.create({
      data: {
        userId,
        senderId,
        recipient,
        subject,
        body,
        scheduledAt: scheduledDate,
        status: "SCHEDULED",
        idempotencyKey: randomUUID(),
      },
    });

    console.log("EMAIL SAVED:", email);

    res.status(201).json({
      message: "Email scheduled successfully",
      email,
    });
  } catch (error) {
    console.error("FAILED TO SAVE EMAIL:", error);

    res.status(500).json({
      message: "Failed to schedule email",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Get sent emails
router.get("/sent", async (req, res) => {
  try {
    const userId =
      typeof req.query.userId === "string" ? req.query.userId : undefined;

    const emails = await prisma.email.findMany({
      where: {
        status: "SENT",
        ...(userId ? { userId } : {}),
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    console.log("Sent emails found:", emails.length);

    res.status(200).json(emails);
  } catch (error) {
    console.error("Failed to fetch sent emails:", error);

    res.status(500).json({
      message: "Failed to fetch sent emails",
    });
  }
});

export default router;
