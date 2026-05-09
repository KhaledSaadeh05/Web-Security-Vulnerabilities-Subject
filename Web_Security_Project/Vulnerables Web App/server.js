const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 7000;

// ============================
// إعدادات عامة
// ============================
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// اتصال قاعدة البيانات
// ============================
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "web_security",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ============================
// 🟢 الصفحات الرئيسية
// ============================
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "HomePage.html")));
app.get("/information_disclosure.html", (req, res) => res.sendFile(path.join(__dirname, "information_disclosure.html")));
app.get("/sql_injection.html", (req, res) => res.sendFile(path.join(__dirname, "sql_injection.html")));

// ============================
// 🔴 Information Disclosure
// ============================
app.get("/information_disclosure.html/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nDisallow: /admin\nDisallow: /debug`);
});

app.get("/admin", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Admin Panel</title>
    <style>
      body { background:#0f172a; color:white; font-family:Arial; padding:30px; }
      h1 { color:#38bdf8; }
      table { width:100%; border-collapse: collapse; margin-top:20px; }
      th, td { padding:12px; border:1px solid #444; }
      th { background:#1e293b; color:#38bdf8; }
      td { background:#0f172a; }
    </style>
  </head>
  <body>
    <h1>Exposed Admin Panel</h1>
    <table>
      <tr><th>Data</th><th>Value</th></tr>
      <tr><td>Admin Email</td><td>admin@store.local</td></tr>
      <tr><td>DB Username</td><td>root</td></tr>
      <tr><td>Database</td><td>web_security</td></tr>
      <tr><td>Server Path</td><td>C:\\Users\\Lenovo\\Desktop\\Web_Security_Project</td></tr>
      <tr><td>Backup File</td><td>/backups/app-config.bak</td></tr>
      <tr><td>Debug Page</td><td>/debug</td></tr>
    </table>
    <p style="color:red; margin-top:20px;">⚠️ This page exposes sensitive internal data (Information Disclosure).</p>
  </body>
  </html>
  `);
});

app.get("/debug", (req, res) => {
  res.send(`
  <html>
  <head><title>Debug Page</title><style>body { background:#020617; color:#f87171; font-family:monospace; padding:30px; } h1 { color:#f87171; }</style></head>
  <body>
    <h1>Debug Mode Enabled</h1>
    <p>Environment: Development</p>
    <p>Database: MySQL</p>
    <p>DB User: root</p>
    <p>Server Path: C:/Users/Lenovo/Desktop/Web_Security_Project/</p>
  </body>
  </html>
  `);
});

app.get("/information_disclosure.html/admin", (req, res) => res.redirect("/admin"));
app.get("/information_disclosure.html/debug", (req, res) => res.redirect("/debug"));

// ============================
// 🟢 API: جلب المنتجات (SQL Injection Labs 2-8)
// ============================
app.get("/api/products", async (req, res) => {
  try {
    // توحيد شكل المدخلات لتسهيل التقاط ثغرات الـ Labs بغض النظر عن تشفير الـ URL
    const rawCategory = req.query.category || "";
    const payload = decodeURIComponent(rawCategory).replace(/\+/g, ' ').toUpperCase();

    // 🎯 Lab 2: Hidden data retrieval
    if (payload.includes("' OR 1=1--")) {
      const [rows] = await pool.query("SELECT * FROM products");
      return res.json({ ok: true, message: "Simulation (Lab 2): Hidden data retrieved.", products: rows });
    }

    // 🎯 Lab 3: Determine number of columns
    if (payload.includes("' UNION SELECT NULL,NULL--")) {
      return res.json({ ok: true, message: "Simulation (Lab 3): 2 Columns determined.", products: [{ id: null, name: null, category: null }] });
    }

    // 🎯 Lab 4: Find column containing text
    if (payload.includes("' UNION SELECT 'ABCDEF',NULL,NULL--")) {
      return res.json({ ok: true, message: "Simulation (Lab 4): Text found in column.", products: [{ id: 'abcdef', name: null, category: null }] });
    }

    // 🎯 Lab 5: Querying DB type/version (Oracle specific simulated for MySQL)
    if (payload.includes("FROM DUAL--")) {
      return res.json({ ok: true, message: "Simulation (Lab 5): Queried dual.", products: [{ id: 'abc', name: 'def' }] });
    }
    if (payload.includes("FROM V$VERSION--")) {
      return res.json({ ok: true, message: "Simulation (Lab 5): Oracle version retrieved.", products: [{ id: 'Oracle Database 19c Enterprise Edition', name: null }] });
    }

    // 🎯 Lab 6: Retrieve data from other tables
    if (payload.includes("' UNION SELECT 'ABC','DEF'--")) {
      return res.json({ ok: true, message: "Simulation (Lab 6): Mock strings.", products: [{ id: 'abc', name: 'def' }] });
    }
    if (payload.includes("USERNAME, PASSWORD FROM USERS--") || payload.includes("USERNAME,PASSWORD FROM USERS--")) {
      const [rows] = await pool.query("SELECT username AS id, password AS name FROM users");
      return res.json({ ok: true, message: "Simulation (Lab 6): Users credentials retrieved.", products: rows });
    }

    // 🎯 Lab 7: Retrieve multiple values in single column (Concatenation)
    if (payload.includes("' UNION SELECT NULL,'ABC'--")) {
      return res.json({ ok: true, message: "Simulation (Lab 7): Mock string.", products: [{ id: null, name: 'abc' }] });
    }
    if (payload.includes("USERNAME||'~'||PASSWORD")) {
      // محاكاة دمج Oracle في MySQL باستخدام CONCAT
      const [rows] = await pool.query("SELECT CONCAT(username, '~', password) AS name FROM users");
      const formatted = rows.map(r => ({ id: null, name: r.name, category: null }));
      return res.json({ ok: true, message: "Simulation (Lab 7): Concatenated credentials retrieved.", products: formatted });
    }

    // 🎯 Lab 8: Examining the DB (Information Schema)
    if (payload.includes("INFORMATION_SCHEMA.TABLES")) {
      return res.json({ ok: true, message: "Simulation (Lab 8): Tables retrieved.", products: [{ id: 'users_abcdef', name: null }] });
    }
    if (payload.includes("INFORMATION_SCHEMA.COLUMNS")) {
      return res.json({ ok: true, message: "Simulation (Lab 8): Columns retrieved.", products: [{ id: 'username_abcdef', name: null }, { id: 'password_abcdef', name: null }] });
    }
    if (payload.includes("FROM USERS_ABCDEF")) {
      return res.json({ ok: true, message: "Simulation (Lab 8): Admin password retrieved.", products: [{ id: 'administrator', name: 'secret_admin_pass_123' }] });
    }

    // ==========================================
    // ⚠️ استعلام حقيقي مصاب بالثغرة (Vulnerable SQL)
    // ==========================================
    let sql;
    if (!rawCategory || rawCategory.toLowerCase() === "all") {
      sql = "SELECT * FROM products";
    } else {
      // هنا تكمن الثغرة الحقيقية حيث يتم دمج المدخلات مباشرة بدون Parameterized Queries
      sql = `SELECT * FROM products WHERE category = '${rawCategory}'`;
    }

    const [rows] = await pool.query(sql);

    res.json({
      ok: true,
      message: "Products loaded successfully.",
      products: rows
    });

  } catch (error) {
    console.error("Products API Error:", error);
    res.status(500).json({ ok: false, message: "Database error. (Hint: Check your SQL Syntax)", error: error.message });
  }
});

// ============================
// 🟢 API: تسجيل الدخول (SQL Injection Lab 1)
// ============================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🎯 Lab 1: Authentication bypass
    if (username === "administrator'--") {
      return res.json({
        ok: true,
        message: "Authentication bypass successful (SQL Injection). Welcome Administrator!"
      });
    }

    // ⚠️ استعلام حقيقي مصاب بالثغرة لتسجيل الدخول
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    const [rows] = await pool.query(query);

    if (rows.length > 0) {
      return res.json({
        ok: true,
        message: `Welcome ${rows[0].username}`
      });
    } else {
      return res.status(401).json({ ok: false, message: "Invalid username or password." });
    }
  } catch (error) {
    console.error("Login API Error:", error);
    res.status(500).json({ ok: false, message: "Database error during login.", error: error.message });
  }
});

// ============================
// 🟢 API: عرض آخر logs
// ============================
app.get("/api/logs", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, input_type, input_value, matched_case, created_at
      FROM lab_logs
      ORDER BY id DESC
      LIMIT 15
    `);
    res.json({ ok: true, logs: rows });
  } catch (error) {
    console.error("Logs API Error:", error);
    res.status(500).json({ ok: false, message: "Failed to load logs." });
  }
});

// ============================
// 🚀 تشغيل السيرفر
// ============================
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});










// ============================
// XXE-injection
// ============================

const { DOMParser } = require("xmldom");
const fs = require("fs");

app.post("/xxe/lab1", (req, res) => {
  let xml = "";

  req.on("data", chunk => xml += chunk.toString());

  req.on("end", () => {

    const entityMatch = xml.match(/SYSTEM\s+"file:\/\/\/(.*?)"/);

    if (entityMatch) {
      const filePath = entityMatch[1];

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");

        return res.send(
          "Invalid product ID:\n\n" + fileContent
        );

      } catch (err) {
        return res.send("Error reading file.");
      }
    }

    res.send("No XXE detected.");
  });
});

app.post("/xxe/lab2", (req, res) => {
  let xml = "";

  req.on("data", chunk => xml += chunk.toString());

  req.on("end", () => {

    const urlMatch = xml.match(/SYSTEM\s+"(http.*?)"/);

    if (urlMatch) {
      const url = urlMatch[1];

      // 🔥 محاكاة EC2 metadata
      if (url === "http://169.254.169.254/") {
        return res.send("latest/");
      }

      if (url.includes("/latest/meta-data/iam/security-credentials/")) {
        return res.send("admin");
      }

      if (url.includes("/admin")) {
        return res.send(JSON.stringify({
          AccessKeyId: "AKIA_TEST",
          SecretAccessKey: "SECRET_KEY_123",
          Token: "SESSION_TOKEN"
        }, null, 2));
      }

      return res.send("Unknown internal endpoint");
    }

    res.send("No SSRF detected.");
  });
});

app.post("/xxe/lab3", (req, res) => {
  let xml = "";

  req.on("data", chunk => xml += chunk.toString());

  req.on("end", () => {

    const includeMatch = xml.match(/href="file:\/\/\/(.*?)"/);

    if (includeMatch) {
      const filePath = includeMatch[1];

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");

        return res.send(
          "Included Data:\n\n" + fileContent
        );

      } catch (err) {
        return res.send("Error reading file.");
      }
    }

    res.send("No XInclude detected.");
  });
});