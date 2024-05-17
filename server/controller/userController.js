const database = require("../services/database.js");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const result = await database.pool.query("SELECT * FROM users WHERE is_active = true");
    users=result.rows;
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    if (
      !req.body.username ||
      !req.body.name ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    const existResult = await database.pool.query({
      text: `SELECT EXISTS (SELECT * FROM public.users WHERE username = $1 OR email = $2)`,
      values: [req.body.username, req.body.email],
    });
    if (existResult.rows[0].exists === true) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const result = await database.pool.query({
      text: `INSERT INTO public.users(username, name, email, "is_admin", "is_active", password)
            VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [
        req.body.username,
        req.body.name,
        req.body.email,
        req.body.is_admin ? req.body.is_admin : false,
        req.body.is_active ? req.body.is_active : true,
        (req.body.password = hashedPassword),
      ],
    });
    if (result.rowCount > 0) {
      return res
        .status(201)
        .json({ success: true, message: "User created successfully"});
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create user" });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (
      !req.body.username ||
      !req.body.name ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(422).json({ error: "Missing required fields" });
    } else {
      const existResult = await database.pool.query({
        text: `SELECT EXISTS (SELECT * FROM public.users WHERE (username = $1 OR email = $2) AND id != $3)`,
        values: [req.body.username, req.body.email, req.params.id],
      });
      console.log(existResult);
      if (existResult.rowCount > 0 && existResult.rows[0].exists) {
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }
    }

    const result = await database.pool.query({
      text: `
      UPDATE users
      SET username = $1, name = $2, email = $3, is_admin = $4, is_active = $5, password = $6
      WHERE id = $7
      RETURNING *`,
      values: [
        req.body.username,
        req.body.name,
        req.body.email,
        req.body.is_admin,
        req.body.is_active,
        req.body.password,
        req.params.id,
      ],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE USERS
      SET is_active = false
      WHERE id = $1 RETURNING *`,
      values: [req.params.id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM users WHERE id = $1`,
      values: [req.params.id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { getUsers, createUser, updateUser, deleteUser, getUserById };
