const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Replace this with your WooCommerce webhook secret
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.use(bodyParser.json({ verify: verifySignature }));

// WooCommerce secret key used when setting up the webhook

// Verify WooCommerce webhook signature (optional but recommended)
function verifySignature(req, res, buf) {
    console.log("Verifying signature...", req);
    console.log("Verifying signature buf...", buf);
    const signature = req.headers["x-wc-webhook-signature"];

    if (!signature || !WEBHOOK_SECRET) return;

    const expectedSignature = crypto.createHmac("sha256", WEBHOOK_SECRET).update(buf).digest("base64");

    if (signature !== expectedSignature) {
        throw new Error("Invalid signature");
    }
}

app.post("/webhook", (req, res) => {
    const eventType = req.headers["x-wc-webhook-event"];
    const payload = req.body;

    console.log(`Received WooCommerce event: ${eventType}`);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    res.status(200).send("Webhook received");
});

app.listen(port, () => {
    console.log(`Webhook listener running at http://localhost:${port}/webhook`);
});
