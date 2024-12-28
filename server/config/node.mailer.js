import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.NODE_ENV === "production" ? true : false,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production" ? true : false,
  },
});

const sendMail = async ({ sendTo, subject, html }) => {
  try {
    await transporter.sendMail({
      from: "Mern-Ecom <monirhossain6163@gmail.com>",
      to: sendTo,
      subject: subject,
      html: html,
    });
    return true;
  } catch (error) {
    console.log("Error in sending mail", error);
    return false;
  }
};

export default sendMail;
