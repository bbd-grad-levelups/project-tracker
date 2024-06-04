const jwt = require('jsonwebtoken');
const aws_jwt = require('aws-jwt-verify');

function oauthMiddleware(req, res, next) {
  // Single user for testing
  var playerName = 'johan';
  var uniqueID = '12491122';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    let token = req.headers.authorization.split(' ')[1];
    
    if (token === 'blah') {
      console.log("Auth testing")
      req.user = {
        userName: playerName,
        UID: uniqueID
      }
      next();
    }
    else {
      console.log("Cognito token verification")
      res.status(500).json({ error: "Johan isn't done with OAuth, sorry"});
    }
  
  }
  else {
    res.status(403).json({ error: "Unauthorized access"});
  }
}

module.exports = oauthMiddleware;

