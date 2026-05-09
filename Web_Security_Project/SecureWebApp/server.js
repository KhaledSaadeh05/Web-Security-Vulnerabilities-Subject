const express = require("express");
const path    = require("path");
const mysql   = require("mysql2/promise");
const fs      = require("fs");

const app  = express();
const PORT = 5500;

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// Database connection
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
// Main pages
// ============================
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "HomePage.html")));
app.get("/information_disclosure.html", (req, res) =>
  res.sendFile(path.join(__dirname, "information_disclosure.html")));
app.get("/sql_injection.html", (req, res) =>
  res.sendFile(path.join(__dirname, "sql_injection.html")));
app.get("/xxe_injection.html", (req, res) =>
  res.sendFile(path.join(__dirname, "xxe_injection.html")));

// ============================
// SECURITY FIX 1 – Information Disclosure
// Admin and debug routes are completely removed.
// Any attempt returns a generic 404 — no internal info exposed.
// ============================
app.get("/admin",  (req, res) => res.status(404).send("Not Found"));
app.get("/debug",  (req, res) => res.status(404).send("Not Found"));
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow:");
});

// ============================
// SECURITY FIX 2 – SQL Injection: Login
// Uses parameterized query — user input never touches SQL syntax.
// ============================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: "Username and password are required." });
    }

    // Parameterized query — SQL injection is impossible here
    const [rows] = await pool.execute(
      "SELECT id, username FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      return res.json({ ok: true, message: `Welcome, ${rows[0].username}.` });
    } else {
      // Generic message — does not reveal whether username or password was wrong
      return res.status(401).json({ ok: false, message: "Invalid credentials." });
    }
  } catch (error) {
    // Generic error — no stack traces or DB details exposed
    console.error("Login error:", error);
    res.status(500).json({ ok: false, message: "An error occurred. Please try again." });
  }
});

// ============================
// SECURITY FIX 2 – SQL Injection: Products
// Uses parameterized query with allowlist validation.
// ============================
const ALLOWED_CATEGORIES = ["all", "tech", "clothes", "accessories"];

app.get("/api/products", async (req, res) => {
  try {
    const rawCategory = (req.query.category || "all").trim().toLowerCase();

    // Allowlist check — reject anything not in the list
    if (!ALLOWED_CATEGORIES.includes(rawCategory)) {
      return res.status(400).json({ ok: false, message: "Invalid category." });
    }

    let rows;
    if (rawCategory === "all") {
      [rows] = await pool.execute("SELECT * FROM products");
    } else {
      // Parameterized — category value cannot alter the SQL structure
      [rows] = await pool.execute(
        "SELECT * FROM products WHERE category = ?",
        [rawCategory]
      );
    }

    res.json({ ok: true, message: "Products loaded.", products: rows });
  } catch (error) {
    console.error("Products error:", error);
    res.status(500).json({ ok: false, message: "An error occurred. Please try again." });
  }
});

// ============================
// SECURITY FIX 3 – XXE Injection
// All three endpoints reject any XML containing DOCTYPE or XInclude
// declarations before touching the content.
// ============================

function readRawBody(req, res, next) {
  let data = "";
  req.setEncoding("utf8");
  req.on("data", chunk => { data += chunk; });
  req.on("end",  ()    => { req.rawBody = data; next(); });
}

// Detect XXE / DOCTYPE / XInclude patterns
function containsXXE(xml) {
  const upper = xml.toUpperCase();
  return (
    upper.includes("<!DOCTYPE")   ||
    upper.includes("<!ENTITY")    ||
    upper.includes("SYSTEM")      ||
    upper.includes("PUBLIC")      ||
    upper.includes("XI:INCLUDE")  ||
    upper.includes("XINCLUDE")    ||
    upper.includes("FILE://")     ||
    upper.includes("HTTP://169.254") ||
    upper.includes("EXPECT://")   ||
    upper.includes("PHP://")
  );
}

// Lab 1 – secure: rejects XXE, parses only safe content
app.post("/xxe/lab1", readRawBody, (req, res) => {
  const xml = req.rawBody || "";

  if (containsXXE(xml)) {
    return res.status(400).send(
      "[Security] XXE payload detected and blocked.\n" +
      "Reason: DOCTYPE / SYSTEM entity declarations are not allowed.\n" +
      "The XML parser runs with external entity processing DISABLED."
    );
  }

  // Safe: only report the raw tag content — no entity resolution
  const match = xml.match(/<[^/!?][^>]*>(.*?)<\/[^>]+>/s);
  const content = match ? match[1].trim() : "(no content)";
  res.send(`[Secure] XML received. Content: ${content}`);
});

// Lab 2 – secure: rejects SSRF-style HTTP entity payloads
app.post("/xxe/lab2", readRawBody, (req, res) => {
  const xml = req.rawBody || "";

  if (containsXXE(xml)) {
    return res.status(400).send(
      "[Security] SSRF via XXE payload detected and blocked.\n" +
      "Reason: HTTP-based SYSTEM entities are not permitted.\n" +
      "The server does not make outbound requests triggered by user input."
    );
  }

  res.send("[Secure] XML received. No external requests were made.");
});

// Lab 3 – secure: rejects XInclude payloads
app.post("/xxe/lab3", readRawBody, (req, res) => {
  const xml = req.rawBody || "";

  if (containsXXE(xml)) {
    return res.status(400).send(
      "[Security] XInclude attack detected and blocked.\n" +
      "Reason: xi:include directives are not supported.\n" +
      "The parser does not process XInclude regardless of namespace."
    );
  }

  res.send("[Secure] XML received. XInclude processing is disabled.");
});

// ============================
// Start server
// ============================
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Secure server running at http://127.0.0.1:${PORT}`);
});
