const database = require("../services/database.js");

const addUserstoProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `INSERT INTO project_users (project_id, user_id)
            VALUES ($1, $2)
            RETURNING *`,
      values: [req.body.project_id, req.body.user_id],
    });
    users = result.rows[0];
    return res.status(201).json({success: true, users});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUsersbyProjectID = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM project_users WHERE project_id = $1`,
      values: [req.params.project_id],
    });
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProjectsbyUserID = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM project_users WHERE user_id = $1`,
      values: [req.params.user_id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUsersfromProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE project_users
            SET is_active = false
            WHERE project_id = $1 AND user_id = $2
            RETURNING *`,
      values: [req.body.project_id, req.body.user_id],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addUserstoProject,
  getUsersbyProjectID,
  getProjectsbyUserID,
  deleteUsersfromProject,
};
