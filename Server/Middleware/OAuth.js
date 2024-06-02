const jwt = require('jsonwebtoken');

function oauthMiddleware(req, res, next) {
  // Single user for testing
  var playerName = 'johan';
  var uniqueID = '12491122';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    req.user = {
      userName: playerName,
      UID: uniqueID
    }
    
    next();
  }
  else {
    res.status(403).json({ error: "Unauthorized access"});
  }
}

module.exports = oauthMiddleware;

