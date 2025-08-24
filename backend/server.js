const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "teamdeveloperxd@gmail.com", // your Gmail
    pass: "jssjhaqcdwcdsonc", // your app password (NO SPACES)
  },
});

// Templates
const templates = {
  welcome: {
    subject: "Welcome to Our Platform!",
    body: "Hello! 🎉 Welcome to our service. We're glad to have you!",
  },
  warning: {
    subject: "⚠️ Warning Notice",
    body: "Please be advised this is a warning regarding your account activity.",
  },
  newsletter: {
    subject: "📰 Monthly Newsletter",
    body: "Here’s our latest newsletter full of updates and news.",
  },
};

// API route
app.post("/send-email", (req, res) => {
  const { recipient, template } = req.body;

  const mailOptions = {
    from: "your_email@gmail.com",
    to: recipient,
    subject: templates[template].subject,
    text: templates[template].body,
    attachments: [
      {
        filename: "Aim Supreme[EnglishVersion].pdf",
        path: "./files/aim-supreme-en.pdf",
      },
      {
        filename: "Aim Supreme[HindiVersion].pdf",
        path: "./files/aim-supreme-hi.pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error sending email");
    }
    res.send("Email sent: " + info.response);
  });
});

// Run server
app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
