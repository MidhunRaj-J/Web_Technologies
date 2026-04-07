const express = require('express');
const usersRouter = require('./routes/users.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Exercise 1 REST API is running');
});

app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Exercise 1 server running on http://localhost:${PORT}`);
});
