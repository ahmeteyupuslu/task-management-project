const database = require("../services/database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config.js");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await database.pool.query({
      text: `SELECT * FROM users WHERE username = $1`,
      values: [username],
    });

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "Email or password is invalid" });
    }

    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is invalid" });
    }

    const accessToken = jwt.sign(
      { id: user.rows[0].id, isAdmin: user.rows[0].is_admin, name: user.rows[0].name},
      config.accessTokenSecret,
      { subject: "accessAPI", expiresIn: "1d" }
    );
    return res.status(200).json({
      success: true,
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      isAdmin: user.rows[0].is_admin,
      name: user.rows[0].name,
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* const auth = (req, res) => {
  return res.status(200).json({ success: true, user: { ...req.user._doc } });
}; */

module.exports = {
  login/* ,
  auth */
};
