const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
   const { token } = req.cookies;
   try {
      let user = jwt.verify(token, process.env.JWT_SECRET);
      req.thisUser = user;
      return next();
   } catch (error) {
      return next(error);
   }
}

module.exports = requireAuth;
