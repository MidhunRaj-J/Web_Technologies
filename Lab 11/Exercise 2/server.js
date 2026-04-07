const http = require('http');

const PORT = 3000;

const server = http.createServer((request, response) => {
  console.log(`${new Date().toISOString()} - ${request.method} ${request.url}`);

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('X-Powered-By', 'Node.js http module');

  response.write('<!doctype html>');
  response.write('<html><head><title>Node Server</title></head><body>');
  response.write('<h1>Simple Node.js Web Server</h1>');
  response.write('<p>Server is running successfully.</p>');
  response.write(`<p>Request Method: ${request.method}</p>`);
  response.write(`<p>Request URL: ${request.url}</p>`);
  response.write('</body></html>');
  response.end();
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Press Ctrl + C to stop the server.');
});
