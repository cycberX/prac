import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/view-pdf', (req, res) => {
    res.sendFile(path.join(__dirname, 'DBMS.pdf'));
});

app.get('/view-md', (req, res) => {
    // 1. Path to your .md file
    const filePath = path.join(__dirname, 'DBMS.md');

    // 2. Read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        // 3. Convert Markdown to HTML
        const htmlContent = marked.parse(data);

        // 4. Wrap in GitHub CSS and 'markdown-body' class
        res.send(`
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
                    <style>
                        .markdown-body {
                            box-sizing: border-box;
                            min-width: 200px;
                            max-width: 980px;
                            margin: 0 auto;
                            padding: 45px;
                        }
                    </style>
                </head>
                <body class="markdown-body">
                    ${htmlContent}
                </body>
            </html>
        `);
    });
});

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DBMS Reference Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .glass { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
        </style>
    </head>
    <body class="bg-gray-900 text-gray-100 min-h-screen p-4 font-sans">
        
        <div class="max-w-4xl mx-auto">
            <!-- Header & Search -->
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 class="text-2xl font-black tracking-tighter text-blue-400">DBMS Pratical Cheat sheet</h1>
                
            </div>

            <!-- Main Action Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- PDF Quick Access -->
                <a href="/view-pdf" target="_blank" 
                   class="group relative overflow-hidden bg-gradient-to-br from-rose-600 to-red-700 p-6 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                    <div class="relative z-10">
                        <span class="text-4xl">📚</span>
                        <h2 class="text-xl font-bold mt-4">Full Solution PDF</h2>
                        <p class="text-rose-100 text-sm mt-1">Open comprehensive DBMS Solved Solution</p>
                    </div>
                </a>

                 <a href="/view-md" target="_blank" 
                   class="group relative overflow-hidden bg-gradient-to-br from-orange-600 to-red-700 p-6 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                    <div class="relative z-10">
                        <span class="text-4xl">{}.md</span>
                        <h2 class="text-xl font-bold mt-4">Full Solution markdown</h2>
                        <p class="text-rose-100 text-sm mt-1">Open comprehensive DBMS Solved Solution</p>
                    </div>
                </a>

                <!-- ChatGPT AI Assist -->
                <a href="https://chatgpt.com/share/6a00d7a7-9a2c-8321-8550-ab9f5c2cacf8" target="_blank" 
                   class="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                    <div class="relative z-10">
                        <span class="text-4xl">🧠</span>
                        <h2 class="text-xl font-bold mt-4">AI Query</h2>
                        <p class="text-emerald-100 text-sm mt-1">Explain concepts or solve SQL queries</p>
                    </div>
                </a>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server Live: http://localhost:${PORT}`);
});