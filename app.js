const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Common Tips
const emailTips = `
🔥 Tips:
1. Read carefully before using the panel.
2. For support, contact our admin via Discord/Telegram.
3. Keep your files private to avoid bans.
`;

// ✅ Templates
const templates = {
  aim: {
    subject: "🎯 Aim Supreme Panel - Thank You for Purchasing",
    body: `Welcome to Aim Supreme!\n\nPlease follow the instructions in the attached PDF to get started.\n\n${emailTips}`,
    html: `<h2>Welcome to <b>Aim Supreme</b> 🎯</h2>
           <p>Please follow the instructions in the attached PDF to get started.</p>
           <pre>${emailTips}</pre>`,
    attachments: [
      {
        filename: "AimSupreme-English.pdf",
        path: path.join(__dirname, "files", "aim-supreme-en.pdf"),
      },
    ],
  },
  esp: {
    subject: "🔥 ESP Supreme Panel - Thank You for Purchasing",
    body: `Welcome to ESP Supreme Panel!\n\nPlease follow the instructions in the attached PDF to get started.\n\n${emailTips}`,
    html: `<h2>Welcome to <b>ESP Supreme Panel</b> 🔥</h2>
           <p>Please follow the instructions in the attached PDF to get started.</p>
           <pre>${emailTips}</pre>`,
    attachments: [
      {
        filename: "EspSupreme-English.pdf",
        path: path.join(__dirname, "files", "esp-supreme-en.pdf"),
      },
    ],
  },
  dark: {
    subject: "🧩 Dark Supreme Panel - Thank You for Purchasing",
    body: `Welcome to Dark Supreme Panel!\n\nPlease follow the instructions in the attached PDF to get started.\n\n${emailTips}`,
    html: `<h2>Welcome to <b>Dark Supreme Panel</b> 🧩</h2>
           <p>Please follow the instructions in the attached PDF to get started.</p>
           <pre>${emailTips}</pre>`,
    attachments: [
      {
        filename: "DarkSupreme-English.pdf",
        path: path.join(__dirname, "files", "dark-supreme-en.pdf"),
      },
    ],
  },
  essential: {
    subject: "💀 Dark Essential Panel - Thank You for Purchasing",
    body: `Welcome to Dark Essential!\n\nPlease follow the instructions in the attached PDF to get started.\n\n${emailTips}`,
    html: `<h2>Welcome to <b>Dark Essential</b> 💀</h2>
           <p>Please follow the instructions in the attached PDF to get started.</p>
           <pre>${emailTips}</pre>`,
    attachments: [
      {
        filename: "DarkEssential-English.pdf",
        path: path.join(__dirname, "files", "dark-essential-en.pdf"),
      },
    ],
  },
};

// ✅ API route
app.post("/send-email", async (req, res) => {
  try {
    const {
      recipient,
      template,
      adminUsername,
      adminPassword,
      buyerUsername,
      buyerPassword,
    } = req.body;

    if (!recipient || !template) {
      return res
        .status(400)
        .json({ error: "Recipient and template are required." });
    }

    if (!templates[template]) {
      return res.status(400).json({ error: "Invalid template selected." });
    }

    const selected = templates[template];

    // Add buyer credentials
    const credentialsText = `\n\n🔑 Buyer Credentials:\nUsername: ${buyerUsername}\nPassword: ${buyerPassword}`;
    const credentialsHtml = `<hr><p><b>🔑 Buyer Credentials:</b></p>
                             <p>Username: <b>${buyerUsername}</b><br>
                             Password: <b>${buyerPassword}</b></p>`;

    // Add admin info (optional)
    const adminText = `\n\n📌 Sent by Admin: ${adminUsername}`;
    const adminHtml = `<p><i>📌 Sent by Admin: ${adminUsername}</i></p>`;

    const mailOptions = {
      from: `"Developer-XD Panel Team" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: selected.subject,
      text: selected.body + credentialsText + adminText,
      html: selected.html + credentialsHtml + adminHtml,
      attachments: selected.attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${recipient}: ${info.response}`);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
});

// ✅ Health & Root Routes (for UptimeRobot / Browsers)
app.get("/", (req, res) => {
  res.send("✅ Email Sender Backend is running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// ✅ Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
