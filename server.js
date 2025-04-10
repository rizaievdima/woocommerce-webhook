const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your WooCommerce webhook secret
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.use(
    bodyParser.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    })
);

app.post("/webhook", (req, res) => {
    const signature = req.headers["x-wc-webhook-signature"];
    const payload = req.rawBody;

    if (WEBHOOK_SECRET) {
        const hash = crypto.createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("base64");

        if (signature !== hash) {
            console.error("❌ Invalid signature!");
            return res.status(401).send("Invalid signature");
        }
    }

    console.log("✅ Webhook received!");
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`🚀 Listening on http://localhost:${PORT}/webhook`);
});
