import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const filesDir = path.join(__dirname, "files");

app.use("/files", express.static(filesDir));

/* ------------------------
   1️⃣  Home page – show all files
------------------------ */
app.get("/", (req, res) => {
  const files = fs.readdirSync(filesDir)
    .filter(f => f.endsWith(".pdf") || f.endsWith(".pay"));

  const list = files.map(f => `
    <li>
      <a href="/view/${encodeURIComponent(f)}">${f}</a>
    </li>
  `).join("\n");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Files</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 2rem; background: #f4f4f4; }
      ul { list-style-type: none; padding: 0; }
      li { margin: 8px 0; }
      a { color: #0070f3; text-decoration: none; font-weight: bold; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>Available Files</h1>
    <ul>${list}</ul>
  </body>
  </html>`;
  res.send(html);
});

/* ------------------------
   2️⃣  View file content page
------------------------ */
app.get("/view/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(filesDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  // For PDFs, just embed in iframe
  if (filename.endsWith(".pdf")) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          iframe { width: 100%; height: 100vh; border: none; }
          a.back { display: inline-block; padding: 1rem; background: #0070f3; color: white; text-decoration: none; }
          a.back:hover { background: #0059c1; }
        </style>
      </head>
      <body>
        <a class="back" href="/">← Back</a>
        <iframe src="/files/${encodeURIComponent(filename)}"></iframe>
      </body>
      </html>
    `;
    return res.send(html);
  }

  // For .pay or text-based files
  const content = fs.readFileSync(filePath, "utf8");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${filename}</title>
    <style>
      body { font-family: monospace; padding: 2rem; background: #f4f4f4; }
      pre {
        background: white;
        padding: 1rem;
        border-radius: 6px;
        border: 1px solid #ddd;
        overflow-x: auto;
      }
      button {
        background: #0070f3;
        color: white;
        border: none;
        padding: 10px 16px;
        margin-bottom: 1rem;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover { background: #0059c1; }
      a.back {
        display: inline-block;
        margin-right: 1rem;
        text-decoration: none;
        color: #0070f3;
      }
    </style>
  </head>
  <body>
    <a href="/" class="back">← Back</a>
    <button id="copyBtn">📋 Copy Content</button>
    <pre id="fileContent">${escapeHTML(content)}</pre>

    <script>
      const btn = document.getElementById("copyBtn");
      btn.addEventListener("click", () => {
        const text = document.getElementById("fileContent").innerText;
        navigator.clipboard.writeText(text);
        btn.innerText = "✅ Copied!";
        setTimeout(() => btn.innerText = "📋 Copy Content", 1500);
      });

      function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

/* ------------------------
   Start local server
------------------------ */
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;


/* ------------------------
   Helper function
------------------------ */
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}
