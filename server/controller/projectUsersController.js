const database = require("../services/database.js");

const addUserstoProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `INSERT INTO project_users (project_id, user_id, is_active)
            VALUES ($1, $2, true)
            ON CONFLICT (project_id, user_id)
            DO UPDATE SET is_active = EXCLUDED.is_active
            RETURNING *`,
      values: [req.body.project_id, req.body.user_id],
    });
    users = result.rows[0];
    return res.status(201).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUsersbyProjectID = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM project_users pu left join users u ON(pu.user_id = u.id) WHERE project_id = $1 AND pu.is_active = true`,
      values: [req.params.project_id],
    });
    projectUsers = result.rows;
    return res.status(200).json({ success: true, projectUsers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUsersNotInProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `
          SELECT u.id, u.username, u.name, u.email, u.is_active FROM users u
          WHERE u.is_active = true AND u.id NOT IN (
            SELECT pu.user_id
            FROM project_users pu
            WHERE pu.project_id = $1 AND pu.is_active = true 
          )
          OR u.id IN (
            SELECT pu.user_id
            FROM project_users pu
            WHERE pu.project_id = $1 AND pu.is_active = false
          )
        `,
      values: [req.params.project_id],
    });
    users = result.rows;
    return res.status(200).json({ success: true, users });
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
    return res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addUserstoProject,
  getUsersbyProjectID,
  deleteUsersfromProject,
  getUsersNotInProject,
};
