let users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    const { order } = req.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });

    res.send(200, sortedUsers);
  },

  getUserById(req, res) {
    const { id } = req.params;
    const user = users.find(user => user.id === Number(id));

    if (!user) {
      return res.send(400, { error: 'User not found' });
    }

    res.send(200, user);

  },

  createUser(req, res) {
    const { body } = req;
    const lastUserId = users[users.length - 1].id;
    const newUser = {
      id: lastUserId + 1,
      name: body.name,
      age: body.age,
      phone: body.phone,
      email: body.email,
      occupation: body.occupation,
      preferences: body.preferences
    }

    users.push(newUser);

    res.send(200, newUser);
  },

  updateUser(req, res) {
    let { id } = req.params;
    const { name } = req.body;
    const { age } = req.body;
    const { phone } = req.body;
    const { email } = req.body;
    const { occupation } = req.body;
    const { preferences } = req.body;

    id = Number(id);

    const userExists = users.find(user => user.id === id);
    if (!userExists) {
      return res.send(400, { error: 'User not found' })
    }

    users = users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          name,
          age,
          phone,
          email,
          occupation,
          preferences
        }
      }

      return user;
    });

    res.send(200, { id, name, age, phone, email, occupation, preferences });
  },

  deleteUser(req, res) {
    let { id } = req.params;
    id = Number(id);

    users = users.filter(user => user.id !== id);
    res.send(200, { deleted: true });

  }
}