const database = require("../services/database.js");
const jwt = require("jsonwebtoken");
const config = require("../config.js");

const getProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.accessTokenSecret);
    const userId = decodedToken.id;
    const isAdmin = decodedToken.isAdmin;

    if (isAdmin) {
      query = "SELECT * FROM project WHERE is_active = true";
      values = [];
    } else {
      // Non-Admin: Fetch only projects where user is included
      query = `
        SELECT p.*
        FROM project p
        JOIN project_users pu ON p.id = pu.project_id
        WHERE pu.user_id = $1 AND p.is_active = true
      `;
      values = [userId];
    }

    const result = await database.pool.query(query, values);
    const projects = result.rows;

    return res.status(200).json({success: true, projects});
  } catch (error) {
    console.error("Error in getProjects:", error);
    return res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `INSERT INTO project (project_name, description, owner_id, start_date, is_active, end_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
      values: [
        req.body.project_name,
        req.body.description,
        req.body.owner_id,
        req.body.start_date ? req.body.start_date : new Date(),
        req.body.is_active ? req.body.is_active : true,
        req.body.end_date,
      ],
    });
    project = result.rows[0];
    return res.status(201).json({ success: true, project});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE project
            SET project_name = $1, description = $2, owner_id = $3, start_date = $4, is_active = $5, end_date = $6
            WHERE id = $7
            RETURNING *`,
      values: [
        req.body.project_name,
        req.body.description,
        req.body.owner_id,
        req.body.start_date,
        req.body.is_active,
        req.body.end_date,
        req.params.id,
      ],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    project = result.rows[0];
    return res.status(200).json({success: true, project});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE project
            SET is_active = false
            WHERE id = $1
            RETURNING *`,
      values: [req.params.id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM project WHERE id = $1`,
      values: [req.params.id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProjectsByOwnerId = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM project WHERE owner_id = $1`,
      values: [req.params.owner_id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const addingUsersToProject = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `INSERT INTO project_users (project_id, user_id, is_active)
            VALUES ($1, $2)
            RETURNING *`,
      values: [
        req.body.project_id,
        req.body.user_id,
        (req.body.is_active = true),
      ],
    });
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getProjectsByOwnerId,
  addingUsersToProject,
};
