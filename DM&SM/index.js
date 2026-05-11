import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000; // Vercel provides the port

const server = http.createServer((req, res) => {
    // Look in the 'public' directory
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // FALLBACK: If file doesn't exist, always serve the main index.html
                fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end("Primary index.html not found in public folder.");
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            const ext = path.extname(filePath);
            const contentType = ext === '.js' ? 'text/javascript' : 'text/html';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});