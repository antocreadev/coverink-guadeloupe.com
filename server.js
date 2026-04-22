import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {
  PORT = 3000,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_ENV = "sandbox",
  DB_HOST,
  DB_PORT = 3306,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  ADMIN_TOKEN,
  ALLOWED_ORIGIN = "*",
} = process.env;

const PAYPAL_API =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      paypal_order_id VARCHAR(64) NOT NULL UNIQUE,
      paypal_capture_id VARCHAR(64),
      product_id VARCHAR(128),
      product_name VARCHAR(255),
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(8) NOT NULL DEFAULT 'EUR',
      status VARCHAR(32) NOT NULL,
      payer_name VARCHAR(255),
      payer_email VARCHAR(255),
      shipping_name VARCHAR(255),
      shipping_address TEXT,
      customer_firstname VARCHAR(120),
      customer_lastname VARCHAR(120),
      customer_phone VARCHAR(40),
      customer_address TEXT,
      customer_note TEXT,
      raw JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created (created_at),
      INDEX idx_email (payer_email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const extraColumns = [
    ["customer_firstname", "VARCHAR(120)"],
    ["customer_lastname", "VARCHAR(120)"],
    ["customer_phone", "VARCHAR(40)"],
    ["customer_address", "TEXT"],
    ["customer_note", "TEXT"],
  ];
  for (const [col, type] of extraColumns) {
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN ${col} ${type}`);
    } catch (e) {
      if (e?.code !== "ER_DUP_FIELDNAME") throw e;
    }
  }
}

async function getPayPalToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal token error: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function fetchPayPalOrder(orderId) {
  const token = await getPayPalToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`PayPal order fetch error: ${res.status}`);
  return res.json();
}

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN.split(","),
  }),
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/orders", async (req, res) => {
  try {
    const { paypalOrderId, productId, productName } = req.body ?? {};
    if (!paypalOrderId) {
      return res.status(400).json({ error: "paypalOrderId requis" });
    }

    const order = await fetchPayPalOrder(paypalOrderId);

    if (order.status !== "COMPLETED" && order.status !== "APPROVED") {
      return res.status(400).json({
        error: `Paiement non finalisé (status=${order.status})`,
      });
    }

    const pu = order.purchase_units?.[0];
    const capture = pu?.payments?.captures?.[0];
    if (!capture || capture.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ error: "Capture PayPal non confirmée" });
    }

    const amount = Number(capture.amount.value);
    const currency = capture.amount.currency_code;
    const payer = order.payer ?? {};
    const shipping = pu.shipping ?? {};

    const payerName = payer.name
      ? `${payer.name.given_name ?? ""} ${payer.name.surname ?? ""}`.trim()
      : null;
    const shippingAddress = shipping.address
      ? [
          shipping.address.address_line_1,
          shipping.address.address_line_2,
          shipping.address.postal_code,
          shipping.address.admin_area_2,
          shipping.address.admin_area_1,
          shipping.address.country_code,
        ]
          .filter(Boolean)
          .join(", ")
      : null;

    await pool.query(
      `INSERT INTO orders
        (paypal_order_id, paypal_capture_id, product_id, product_name,
         amount, currency, status, payer_name, payer_email,
         shipping_name, shipping_address, raw)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [
        order.id,
        capture.id,
        productId ?? null,
        productName ?? pu.description ?? null,
        amount,
        currency,
        capture.status,
        payerName,
        payer.email_address ?? null,
        shipping.name?.full_name ?? null,
        shippingAddress,
        JSON.stringify(order),
      ],
    );

    res.json({
      ok: true,
      order: {
        id: capture.id,
        paypalOrderId: order.id,
        productName: productName ?? pu.description ?? "",
        amount,
        currency,
        status: capture.status,
        payerName,
        payerEmail: payer.email_address ?? "",
        shippingName: shipping.name?.full_name ?? "",
        shippingAddress,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[/api/orders] error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/orders/:captureId/customer", async (req, res) => {
  try {
    const { captureId } = req.params;
    const { firstname, lastname, phone, address, note } = req.body ?? {};
    if (!firstname || !lastname || !phone || !address) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }
    const [result] = await pool.query(
      `UPDATE orders
       SET customer_firstname = ?, customer_lastname = ?,
           customer_phone = ?, customer_address = ?, customer_note = ?
       WHERE paypal_capture_id = ?`,
      [
        String(firstname).slice(0, 120),
        String(lastname).slice(0, 120),
        String(phone).slice(0, 40),
        String(address).slice(0, 2000),
        note ? String(note).slice(0, 2000) : null,
        captureId,
      ],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Commande introuvable" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("[/api/orders/:id/customer] error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/admin/orders", async (req, res) => {
  const token =
    req.headers["x-admin-token"] ||
    (req.headers.authorization ?? "").replace(/^Bearer\s+/, "");
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  try {
    const [rows] = await pool.query(
      `SELECT id, paypal_order_id, paypal_capture_id, product_id, product_name,
              amount, currency, status, payer_name, payer_email,
              shipping_name, shipping_address,
              customer_firstname, customer_lastname, customer_phone,
              customer_address, customer_note, created_at
       FROM orders
       ORDER BY created_at DESC
       LIMIT 500`,
    );
    res.json({ orders: rows });
  } catch (err) {
    console.error("[/api/admin/orders] error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(distPath, "index.html"));
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server ready on port ${PORT} (PayPal: ${PAYPAL_ENV})`);
    });
  })
  .catch((err) => {
    console.error("Schema init failed:", err);
    process.exit(1);
  });
