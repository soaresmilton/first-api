const http = require('http');
const users = require('./mocks/users');

const server = http.createServer((req, res) => {

  console.log(`Request method: ${req.method} | Endpoint: ${req.url}`);

  if (req.url === '/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`Cannon ${req.method}  ${req.url}`);
  }

});

server.listen(3000, () => console.log('Server is running at http://localhost:3000'));