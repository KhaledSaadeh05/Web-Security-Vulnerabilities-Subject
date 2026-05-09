const checkProductBtn = document.getElementById("checkProductBtn");
const productCodeInput = document.getElementById("productCode");
const resultBox = document.getElementById("resultBox");
const errorBox = document.getElementById("errorBox");
const debugPanel = document.getElementById("debugPanel");

// Only run this section if product elements exist
if (checkProductBtn) {
  checkProductBtn.addEventListener("click", function () {
    const input = productCodeInput.value.trim();

    resultBox.style.display = "none";
    errorBox.style.display = "none";
    resultBox.textContent = "";
    errorBox.textContent = "";

    if (input === "PRD-1001") {
      resultBox.style.display = "block";
      resultBox.textContent =
        "Product found successfully: Laptop - 650 JOD";
    } else if (input === "") {
      errorBox.style.display = "block";
      errorBox.textContent =
        "Error: Missing required parameter 'productCode'.\n" +
        "File: C:\\xampp\\htdocs\\Vulnerables Web App\\productController.js\n" +
        "StackTrace: ValidationError at line 18";
    } else {
      errorBox.style.display = "block";
      errorBox.textContent =
        "Error: Product not found in database.\n" +
        "Query: SELECT * FROM products WHERE code = '" + input + "'\n" +
        "File: C:\\xampp\\htdocs\\Vulnerables Web App\\db.js\n" +
        "StackTrace: DatabaseError at line 42";
    }
  });
}

const params = new URLSearchParams(window.location.search);

if (params.get("debug") === "true") {
  debugPanel.style.display = "block";
  debugPanel.innerHTML = `
    <h3>Debug Information</h3>
    <p><strong>Mode:</strong> Development</p>
    <p><strong>Database:</strong> MySQL</p>
    <p><strong>DB User:</strong> root</p>
    <p><strong>DB Password:</strong> root123</p>
    <p><strong>Server Path:</strong> C:/xampp/htdocs/Vulnerables Web App/</p>
    <p><strong>API Key:</strong> 12345-DEBUG-KEY</p>
  `;
} else if (params.get("admin") === "true") {
  debugPanel.style.display = "block";
  debugPanel.innerHTML = `
    <h3>Admin Information</h3>
    <p><strong>Admin Email:</strong> admin@store.local</p>
    <p><strong>Users Count:</strong> 152</p>
    <p><strong>Last Backup:</strong> 2026-04-19</p>
    <p><strong>Admin Path:</strong> /internal/admin/dashboard</p>
  `;
}