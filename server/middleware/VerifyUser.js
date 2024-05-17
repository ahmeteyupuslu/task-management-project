const jwt = require("jsonwebtoken");
const database = require("../services/database.js");
const config = require("../config.js");

const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  console.log(req.headers);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, config.accessTokenSecret, async (err, user) => {
      try {
        if (err) {
          return res.status(403).json({ message: "Token is not valid" });
        }
        const userInfo = await database.pool.query({
          text: `SELECT * FROM users WHERE id = $1`,
          values: [user.id],
        });
        req.user = userInfo.rows[0];
        next();
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  } else {
    return res.status(403).json({ message: "You are not authenticated!!!" });
  }
};

module.exports = {
  verifyUser,
};
