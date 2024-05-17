const jwt = require("jsonwebtoken");
const config = require("../config.js");

const authorize = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.accessTokenSecret);
    const isAdmin = decodedToken.isAdmin;
    console.log(isAdmin);
    if (isAdmin === false) {
        return res.status(403).json({ message: "You are not authorized" });
    }
    next();
}
module.exports = {
  authorize,
};
