const UserController = require('./controllers/UserController');

// CADA OBJETO REPRESENTA UMA ROTA DA NOSSA API
module.exports = [
  {
    endpoint: '/users',
    method: 'GET',
    handler: UserController.listUsers,
  },

  {
    endpoint: '/users/:id',
    method: 'GET',
    handler: UserController.getUserById,
  },
];