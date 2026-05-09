const currentCategory = document.getElementById("currentCategory");
const filterMessage = document.getElementById("filterMessage");
const productsGrid = document.getElementById("productsGrid");
const loginForm = document.getElementById("loginForm");
const loginResult = document.getElementById("loginResult");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category") || "All";

currentCategory.textContent = selectedCategory;

function showMessage(element, message, isSuccess) {
  element.style.display = "block";
  element.textContent = message;
  element.style.background = isSuccess ? "#14532d" : "#450a0a";
  element.style.color = isSuccess ? "#bbf7d0" : "#fecaca";
}

function renderProducts(products) {
  productsGrid.innerHTML = "";

  if (!products || products.length === 0) {
    productsGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  const productsHTML = products.map((product) => {
    return `
      <div class="product-card">
        <div class="product-image">${product.category}</div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>Category: ${product.category}</p>
          <p class="price">Price: ${product.price} JOD</p>
        </div>
      </div>
    `;
  }).join("");

  productsGrid.innerHTML = productsHTML;
}

async function loadProducts() {
  try {
    const response = await fetch(
      `/api/products?category=${encodeURIComponent(selectedCategory)}`
    );

    const data = await response.json();

    if (data.ok) {
      showMessage(filterMessage, "Products loaded successfully.", true);
      renderProducts(data.products);
    } else {
      showMessage(
        filterMessage,
        data.message || "Failed to load products.",
        false
      );
      renderProducts([]);
    }
  } catch (error) {
    showMessage(filterMessage, "Failed to connect to the server.", false);
    renderProducts([]);
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showMessage(loginResult, "Username and password are required.", false);
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    showMessage(loginResult, data.message, data.ok);
  } catch (error) {
    showMessage(loginResult, "Failed to connect to the server.", false);
  }
}

loginForm.addEventListener("submit", handleLogin);

loadProducts();