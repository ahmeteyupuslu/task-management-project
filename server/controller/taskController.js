const database = require("../services/database.js");

// Seçilen kullanıcının görevlerini getirir
const getTasksbyUser = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM task WHERE user_id = $1`,
      values: [req.params.user_id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Görevin detaylarını getirir
const getTaskById = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM task WHERE id = $1`,
      values: [req.params.id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Seçilen Projenin Görevlerini getirir
const getTaskByProjectId = async (req, res) => {
  console.log(req.params.id);
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM task WHERE project_id = $1`,
      values: [req.params.id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Yeni görev ekleme
const createTask = async (req, res) => {
  try {
    const loggedUser = 18; //jwt token ile alınacak

    const result = await database.pool.query({
      text: `INSERT INTO task (project_id, user_id, summary, description, started_time, finish_time, status, is_active, created_user_id, created_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      values: [
        req.body.project_id,
        req.body.user_id,
        req.body.summary,
        req.body.description,
        req.body.started_time,
        req.body.finish_time,
        (req.body.status = "in-progress"),
        (req.body.is_active = true),
        (req.body.created_user_id = loggedUser),
        (req.body.created_date = new Date()),
      ],
    });
    if (result.rowCount > 0) {
      return res
        .status(201)
        .json({ success: true, message: "Task created successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create task" });
    }
  } catch (err) {
    console.error("Error creating task:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//görev durumunu güncelleme
const updateTaskStatus = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE task SET status = $1 WHERE id = $2 RETURNING *`,
      values: [req.body.status, req.params.id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateTaskbyAdmin = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE task SET project_id = $1, user_id = $2, summary = $3, description = $4, started_time = $5, finish_time = $6, status = $7, is_active = $8 WHERE id = $9 RETURNING *`,
      values: [
        req.body.project_id,
        req.body.user_id,
        req.body.summary,
        req.body.description,
        req.body.started_time,
        req.body.finish_time,
        req.body.status,
        req.body.is_active,
        req.params.id,
      ],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasksbyUser,
  getTaskById,
  getTaskByProjectId,
  createTask,
  updateTaskStatus,
  updateTaskbyAdmin,
};
