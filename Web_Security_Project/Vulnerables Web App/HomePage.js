const showMessageBtn = document.getElementById("showMessageBtn");
const projectMessage = document.getElementById("projectMessage");

showMessageBtn.addEventListener("click", function () {
  projectMessage.textContent =
    "This vulnerable web application was created to demonstrate how insecure web design can lead to serious security risks.";
});