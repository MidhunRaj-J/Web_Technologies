let users = [
  { id: 1, name: 'Asha', email: 'asha@example.com' },
  { id: 2, name: 'Ravi', email: 'ravi@example.com' }
];

const getAllUsers = (req, res) => {
  res.json({ count: users.length, data: users });
};

const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ data: user });
};

const createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'name and email are required' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };

  users.push(newUser);
  return res.status(201).json({ message: 'User created', data: newUser });
};

const updateUser = (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...(name ? { name } : {}),
    ...(email ? { email } : {})
  };

  return res.json({ message: 'User updated', data: users[userIndex] });
};

const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const exists = users.some((u) => u.id === id);

  if (!exists) {
    return res.status(404).json({ message: 'User not found' });
  }

  users = users.filter((u) => u.id !== id);
  return res.json({ message: 'User deleted' });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
