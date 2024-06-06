const jwt_aws = require('aws-jwt-verify');
const verifier = jwt_aws.CognitoJwtVerifier.create({
  userPoolId: process.env.projecttracker_userpool_id,
  tokenUse: "id",
  clientId: process.env.projecttracker_client_id
});

function oauthMiddleware(req, res, next) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    let token = req.headers.authorization.split(' ')[1];

    verifier.verify(token)  
    .then((data) => {
      req.user = {
        userName: data.name,
        UID: data.identities[0].userId,
        email: data.email
      }
      next();
    })
    .catch((error) => {
      res.status(400).json({ error: "Unauthorized access, token validation failed", specific: error });
    });
  }
  else {
    res.status(403).json({ error: "Unauthorized access"});
  }
}

module.exports = oauthMiddleware;





