const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Exercise 3 MongoDB CRUD API is running');
});

app.use('/api/products', productRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Exercise 3 server running on http://localhost:${PORT}`);
  });
};

startServer();
