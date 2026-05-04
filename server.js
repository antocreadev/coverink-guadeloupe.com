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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pageviews (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      path VARCHAR(512) NOT NULL,
      title VARCHAR(512),
      referrer VARCHAR(1024),
      ip VARCHAR(64),
      user_agent VARCHAR(512),
      visitor_id VARCHAR(64),
      session_id VARCHAR(64),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_pv_created (created_at),
      INDEX idx_pv_path (path(191)),
      INDEX idx_pv_visitor (visitor_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS visitors (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(64) NOT NULL UNIQUE,
      first_path VARCHAR(512),
      first_referrer VARCHAR(1024),
      ip VARCHAR(64),
      user_agent VARCHAR(512),
      browser VARCHAR(64),
      os VARCHAR(64),
      device_type VARCHAR(32),
      language VARCHAR(32),
      languages VARCHAR(255),
      platform VARCHAR(64),
      screen_width INT,
      screen_height INT,
      viewport_width INT,
      viewport_height INT,
      color_depth INT,
      pixel_ratio DECIMAL(5,2),
      timezone VARCHAR(64),
      timezone_offset INT,
      cookie_enabled TINYINT(1),
      do_not_track VARCHAR(8),
      hardware_concurrency INT,
      device_memory INT,
      connection_type VARCHAR(16),
      connection_downlink DECIMAL(6,2),
      connection_rtt INT,
      save_data TINYINT(1),
      touch_points INT,
      online TINYINT(1),
      webgl_vendor VARCHAR(255),
      webgl_renderer VARCHAR(255),
      canvas_fp VARCHAR(64),
      country VARCHAR(8),
      city VARCHAR(128),
      visits INT DEFAULT 1,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_v_created (created_at),
      INDEX idx_v_country (country),
      INDEX idx_v_browser (browser)
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

app.set("trust proxy", true);

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.ip || req.socket?.remoteAddress || null;
}

async function geoLookup(ip) {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: null, city: null };
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,city`, {
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return { country: null, city: null };
    const j = await res.json();
    if (j.status !== "success") return { country: null, city: null };
    return { country: j.countryCode || null, city: j.city || null };
  } catch {
    return { country: null, city: null };
  }
}

app.post("/api/track", async (req, res) => {
  res.json({ ok: true });
  try {
    const b = req.body ?? {};
    if (!b.visitorId || !b.path) return;
    const ip = clientIp(req);
    const ua = (b.userAgent || req.headers["user-agent"] || "").toString().slice(0, 500);
    const path = String(b.path).slice(0, 500);

    await pool.query(
      `INSERT INTO pageviews
        (path, title, referrer, ip, user_agent, visitor_id, session_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        path,
        (b.title || "").toString().slice(0, 500),
        (b.referrer || "").toString().slice(0, 1000) || null,
        ip,
        ua,
        String(b.visitorId).slice(0, 64),
        String(b.sessionId || "").slice(0, 64) || null,
      ],
    );

    const [existing] = await pool.query(
      `SELECT id FROM visitors WHERE visitor_id = ? LIMIT 1`,
      [String(b.visitorId).slice(0, 64)],
    );

    if (existing.length) {
      await pool.query(
        `UPDATE visitors SET visits = visits + 1, last_seen = CURRENT_TIMESTAMP WHERE visitor_id = ?`,
        [String(b.visitorId).slice(0, 64)],
      );
    } else {
      const geo = await geoLookup(ip);
      await pool.query(
        `INSERT INTO visitors
          (visitor_id, first_path, first_referrer, ip, user_agent, browser, os, device_type,
           language, languages, platform, screen_width, screen_height, viewport_width, viewport_height,
           color_depth, pixel_ratio, timezone, timezone_offset, cookie_enabled, do_not_track,
           hardware_concurrency, device_memory, connection_type, connection_downlink, connection_rtt,
           save_data, touch_points, online, webgl_vendor, webgl_renderer, canvas_fp, country, city)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(b.visitorId).slice(0, 64),
          path,
          (b.referrer || "").toString().slice(0, 1000) || null,
          ip,
          ua,
          (b.browser || "").toString().slice(0, 64),
          (b.os || "").toString().slice(0, 64),
          (b.deviceType || "").toString().slice(0, 32),
          (b.language || "").toString().slice(0, 32),
          (b.languages || "").toString().slice(0, 255),
          (b.platform || "").toString().slice(0, 64),
          Number(b.screenWidth) || null,
          Number(b.screenHeight) || null,
          Number(b.viewportWidth) || null,
          Number(b.viewportHeight) || null,
          Number(b.colorDepth) || null,
          Number(b.pixelRatio) || null,
          (b.timezone || "").toString().slice(0, 64),
          Number.isFinite(b.timezoneOffset) ? b.timezoneOffset : null,
          b.cookieEnabled ? 1 : 0,
          (b.doNotTrack ?? "").toString().slice(0, 8),
          Number(b.hardwareConcurrency) || null,
          Number(b.deviceMemory) || null,
          (b.connectionType || "").toString().slice(0, 16) || null,
          Number(b.connectionDownlink) || null,
          Number(b.connectionRtt) || null,
          b.saveData ? 1 : 0,
          Number(b.touchPoints) || 0,
          b.online ? 1 : 0,
          (b.webglVendor || "").toString().slice(0, 255),
          (b.webglRenderer || "").toString().slice(0, 255),
          (b.canvasFp || "").toString().slice(0, 64),
          geo.country,
          geo.city,
        ],
      );
    }
  } catch (err) {
    console.error("[/api/track] error:", err);
  }
});

function requireAdmin(req, res) {
  const token =
    req.headers["x-admin-token"] ||
    (req.headers.authorization ?? "").replace(/^Bearer\s+/, "");
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    res.status(401).json({ error: "Non autorisé" });
    return false;
  }
  return true;
}

app.get("/api/admin/analytics", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const [totals] = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM pageviews) AS total_views,
        (SELECT COUNT(*) FROM visitors) AS total_visitors,
        (SELECT COUNT(DISTINCT session_id) FROM pageviews WHERE session_id IS NOT NULL) AS sessions`,
    );
    const [byDay] = await pool.query(
      `SELECT DATE(created_at) AS d, COUNT(*) AS views,
              COUNT(DISTINCT visitor_id) AS uniques
       FROM pageviews
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
       GROUP BY DATE(created_at) ORDER BY d`,
    );
    const [byMonth] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS m, COUNT(*) AS views,
              COUNT(DISTINCT visitor_id) AS uniques
       FROM pageviews
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
       GROUP BY m ORDER BY m`,
    );
    const [byYear] = await pool.query(
      `SELECT YEAR(created_at) AS y, COUNT(*) AS views,
              COUNT(DISTINCT visitor_id) AS uniques
       FROM pageviews GROUP BY y ORDER BY y`,
    );
    const [byHour] = await pool.query(
      `SELECT HOUR(created_at) AS h, COUNT(*) AS views FROM pageviews
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY h ORDER BY h`,
    );
    const [byPath] = await pool.query(
      `SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS uniques
       FROM pageviews GROUP BY path ORDER BY views DESC LIMIT 50`,
    );
    const [byBrowser] = await pool.query(
      `SELECT browser, COUNT(*) AS c FROM visitors GROUP BY browser ORDER BY c DESC`,
    );
    const [byOS] = await pool.query(
      `SELECT os, COUNT(*) AS c FROM visitors GROUP BY os ORDER BY c DESC`,
    );
    const [byDevice] = await pool.query(
      `SELECT device_type AS device, COUNT(*) AS c FROM visitors GROUP BY device_type ORDER BY c DESC`,
    );
    const [byCountry] = await pool.query(
      `SELECT IFNULL(country,'??') AS country, COUNT(*) AS c FROM visitors GROUP BY country ORDER BY c DESC LIMIT 30`,
    );
    const [byCity] = await pool.query(
      `SELECT IFNULL(city,'??') AS city, COUNT(*) AS c FROM visitors WHERE city IS NOT NULL GROUP BY city ORDER BY c DESC LIMIT 30`,
    );
    const [byLang] = await pool.query(
      `SELECT language, COUNT(*) AS c FROM visitors GROUP BY language ORDER BY c DESC LIMIT 20`,
    );
    const [byTz] = await pool.query(
      `SELECT timezone, COUNT(*) AS c FROM visitors GROUP BY timezone ORDER BY c DESC LIMIT 20`,
    );
    const [byScreen] = await pool.query(
      `SELECT CONCAT(screen_width,'x',screen_height) AS res, COUNT(*) AS c
       FROM visitors WHERE screen_width IS NOT NULL GROUP BY res ORDER BY c DESC LIMIT 15`,
    );
    const [byReferrer] = await pool.query(
      `SELECT IFNULL(NULLIF(first_referrer,''),'(direct)') AS ref, COUNT(*) AS c
       FROM visitors GROUP BY ref ORDER BY c DESC LIMIT 25`,
    );
    const [byConnection] = await pool.query(
      `SELECT IFNULL(connection_type,'unknown') AS t, COUNT(*) AS c FROM visitors GROUP BY t ORDER BY c DESC`,
    );
    const [recent] = await pool.query(
      `SELECT visitor_id, ip, browser, os, device_type, country, city, language,
              timezone, screen_width, screen_height, hardware_concurrency, device_memory,
              connection_type, webgl_renderer, canvas_fp, visits, last_seen, created_at
       FROM visitors ORDER BY last_seen DESC LIMIT 200`,
    );

    res.json({
      totals: totals[0],
      byDay, byMonth, byYear, byHour,
      byPath, byBrowser, byOS, byDevice, byCountry, byCity,
      byLang, byTz, byScreen, byReferrer, byConnection,
      recent,
    });
  } catch (err) {
    console.error("[/api/admin/analytics] error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

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
