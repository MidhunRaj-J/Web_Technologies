const express = require('express');
const loggerMiddleware = require('./middleware/logger.middleware');
const { firstLayer, secondLayer } = require('./middleware/flow.middleware');
const demoRouter = require('./routes/demo.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(loggerMiddleware);
app.use(firstLayer);
app.use(secondLayer);

app.get('/', (req, res) => {
  res.send('Exercise 2 middleware server is running');
});

app.use('/api', demoRouter);

app.listen(PORT, () => {
  console.log(`Exercise 2 server running on http://localhost:${PORT}`);
});
