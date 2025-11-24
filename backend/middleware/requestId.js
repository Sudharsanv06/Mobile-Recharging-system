module.exports = (req, res, next) => {
  req.id = req.headers['x-request-id'] || Date.now().toString();
  try {
    res.setHeader('X-Request-Id', req.id);
  } catch (e) {
    // ignore if headers already sent while in tests
  }
  next();
};
const { randomUUID } = require('crypto');

module.exports = function requestId(req, res, next) {
  try {
    // use existing header if provided, otherwise generate
    const id = req.get && req.get('X-Request-Id') || (typeof randomUUID === 'function' ? randomUUID() : Date.now().toString(36));
    req.id = id;
    // expose to logs and downstream middlewares
    res.setHeader && res.setHeader('X-Request-Id', id);
    next();
  } catch (err) {
    next(err);
  }
};
