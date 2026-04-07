const http = require('http');

const PORT = 3000;

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader('X-Powered-By', 'Node.js HTTP Module');

  if (request.url === '/') {
    response.write('Hello from Node.js!\n');
    response.write(`Request method: ${request.method}\n`);
    response.write(`Request URL: ${request.url}\n`);
    response.end('Server response completed.');
    return;
  }

  response.statusCode = 404;
  response.write('404 Not Found\n');
  response.end('The requested resource does not exist.');
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Press Ctrl + C to stop the server.');
});
