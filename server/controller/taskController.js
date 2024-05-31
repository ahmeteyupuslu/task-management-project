const database = require("../services/database.js");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const config = require("../config.js");

// Seçilen kullanıcının görevlerini getirir
const getTasksbyUser = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT * FROM task WHERE user_id = $1 and is_active = true`,
      values: [req.params.user_id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    taks = result.rows;
    return res.status(200).json({ success: true, tasks });
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
    taskdetails = result.rows[0];
    return res.status(200).json({ success: true, taskdetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Seçilen Projenin Görevlerini getirir
const getTaskByProjectId = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `SELECT 
      t.id,
      t.project_id,
      t.user_id,
      t.summary,
      t.description,
      t.started_time,
      t.finish_time,
      t.status,
      t.is_active,
      t.created_user_id,
      t.created_date,
      u.name AS user_name
      FROM task t 
      LEFT JOIN users u ON t.user_id = u.id
      WHERE project_id = $1 and t.is_active = true `,
      values: [req.params.id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Tasks not found"});
    }

    const tasks = result.rows.map((task) => ({
      ...task,
      started_time: moment.utc(task.started_time).tz("Asia/Istanbul").format(),
      finish_time: moment.utc(task.finish_time).tz("Asia/Istanbul").format(),
    }));

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Yeni görev ekleme
const createTask = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.accessTokenSecret);
    const loggedUserId = decoded.id;

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
        req.body.status || "Not Started",
        (req.body.is_active = true),
        (req.body.created_user_id = loggedUserId),
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
    updatedtask = result.rows[0];
    return res.status(200).json({ success: true, updatedtask });
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
    updatedtask = result.rows[0];
    return res.status(200).json({ success: true, updatedtask });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE task SET is_active = false WHERE id = $1 RETURNING *`,
      values: [req.params.id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ success: true, message: "Task deleted" });
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
  deleteTask,
};
