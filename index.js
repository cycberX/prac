const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Look for files in the same folder as this script
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Read the file from the root folder
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // ERROR HANDLING: If page doesn't exist, serve index.html (Redirect to Home)
                fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end("Primary index.html not found.");
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data, 'utf-8');
                    }
                });
            } else {
                // ERROR HANDLING: Generic Server Error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // SUCCESS: Serve the file with the correct type
            const ext = path.extname(filePath);
            const contentType = ext === '.js' ? 'text/javascript' : 'text/html';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});