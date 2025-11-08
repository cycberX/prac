import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Folder containing your files
const filesDir = path.join(__dirname, "files");

// Serve files statically for download
app.use("/files", express.static(filesDir));

// Homepage: show list of files
app.get("/", (req, res) => {
  const files = fs.readdirSync(filesDir)
    .filter(f => f.endsWith(".pdf") || f.endsWith(".py"));

  const fileLinks = files.map(f => `
    <li>
      <a href="/download/${encodeURIComponent(f)}">${f}</a>
    </li>`).join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>File List</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; background: #f6f6f6; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 8px 0; }
        a { color: #0070f3; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Available Files</h1>
      <ul>${fileLinks}</ul>
    </body>
    </html>
  `;

  res.send(html);
});

// Download route
app.get("/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(filesDir, fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

// Start server (for local testing)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
