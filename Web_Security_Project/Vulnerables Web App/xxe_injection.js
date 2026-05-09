async function runXXE(lab, inputId, resultId) {
  const resultBox = document.getElementById(resultId);
  resultBox.innerText = "Processing...";

  try {
    const xml = document.getElementById(inputId).value;

    if (!xml.trim()) {
      resultBox.innerText = "Please enter an XML payload first.";
      return;
    }

    const res = await fetch(`/xxe/${lab}`, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml
    });

    const text = await res.text();
    resultBox.innerText = text;

  } catch (err) {
    resultBox.innerText = "Error: " + err.message;
  }
}
