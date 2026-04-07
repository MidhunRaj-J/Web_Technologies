const firstLayer = (req, res, next) => {
  console.log('[FLOW] First middleware layer executed');
  req.flow = ['first'];
  next();
};

const secondLayer = (req, res, next) => {
  console.log('[FLOW] Second middleware layer executed');
  req.flow.push('second');
  next();
};

const routeGuard = (req, res, next) => {
  console.log('[ROUTE] Route-level middleware executed');
  req.flow.push('route-guard');
  next();
};

module.exports = {
  firstLayer,
  secondLayer,
  routeGuard
};
