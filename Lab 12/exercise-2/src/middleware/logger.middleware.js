const loggerMiddleware = (req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[LOGGER] ${req.method} ${req.url} at ${now}`);
  next();
};

module.exports = loggerMiddleware;
