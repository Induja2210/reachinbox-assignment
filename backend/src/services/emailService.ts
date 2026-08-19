import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (
  recipient: string,
  subject: string,
  body: string
) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: subject,
    text: body,
  });

  console.log("Email sent:", info.messageId);

  return info;
};