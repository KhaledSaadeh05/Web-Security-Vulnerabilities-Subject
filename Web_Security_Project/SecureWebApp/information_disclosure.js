const checkProductBtn = document.getElementById("checkProductBtn");
const productCodeInput = document.getElementById("productCode");
const resultBox = document.getElementById("resultBox");
const errorBox  = document.getElementById("errorBox");

checkProductBtn.addEventListener("click", function () {
  const input = productCodeInput.value.trim();

  resultBox.style.display = "none";
  errorBox.style.display  = "none";

  if (input === "PRD-1001") {
    resultBox.style.display = "block";
    resultBox.textContent   = "Product found: Laptop — 650 JOD";
  } else if (input === "") {
    errorBox.style.display = "block";
    // SECURITY FIX: generic message — no file path, no stack trace
    errorBox.textContent = "Please enter a product code.";
  } else {
    errorBox.style.display = "block";
    // SECURITY FIX: generic message — the real query/path is never shown
    errorBox.textContent = "Product not found.";
  }
});

// SECURITY FIX: URL parameters are completely ignored.
// The vulnerable version checked ?debug=true and ?admin=true and rendered
// credentials and internal paths. That logic is removed entirely.
