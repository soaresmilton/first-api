const users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
}