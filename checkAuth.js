 const jwt = require('jsonwebtoken');
 const secret = "thisIsMySecretCode"
// module.exports = (req, res, next) => {
//     try {
//         //const token = req.headers.authorization.split(" ")[1];
//         const decoded = jwt.verify(req.body.token, secret);
//         req.userData = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             message: 'Auth failed'
//         });
//     }
// };
const config = require('./config.js');

// let checkToken = (req, res, next) => {
//   let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//   if (token.startsWith('Bearer ')) {
//     // Remove Bearer from string
//     token = token.slice(7, token.length);
//   }

//   if (token) {
//     jwt.verify(token, config.secret, (err, decoded) => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: 'Token is not valid'
//         });
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     return res.json({
//       success: false,
//       message: 'Auth token is not supplied'
//     });
//   }
// };

// module.exports = {
//   checkToken: checkToken
// }


// route to authenticate a user (POST http://localhost:8080/api/authenticate)


// route middleware to verify a token
module.exports=(req, res, next)=> {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {       if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });       } else {
        // if everything is good, save to request for use in other routes
        req.userData = decoded;         next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
}

// route to show a random message (GET http://localhost:8080/api/)

// route to return all users (GET http://localhost:8080/api/users)


// apply the routes to our application with the prefix /api
