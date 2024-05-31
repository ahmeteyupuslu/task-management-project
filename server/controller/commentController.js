const database = require("../services/database.js");
const moment = require('moment-timezone');
const jwt = require("jsonwebtoken");
const config = require("../config.js");

const createComment = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.accessTokenSecret);
    const loggedUserId = decoded.id;
    const result = await database.pool.query({
      text: `INSERT INTO comment (task_id, user_id, user_comment, created_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      values: [
        req.params.task_id,
        (req.body.user_id = loggedUserId),
        req.body.user_comment,
        (req.body.created_date = new Date()),
      ],
    });
    comment = result.rows[0];
    return res.status(201).json({ success: true, comment});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `DELETE FROM comment
            WHERE id = $1
            RETURNING *`,
      values: [req.params.id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    return res.status(200).json({ succes:true, message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCommentsByTaskId = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `
      SELECT 
        c.id AS comment_id, 
        c.task_id, 
        c.user_id, 
        c.user_comment, 
        c.created_date, 
        u.id AS user_id, 
        u.name AS user_name 
      FROM comment c 
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.task_id = $1
    `,
      values: [req.params.task_id],
    });
    const comments = result.rows.map(comment=>({
      ...comment,
      created_date: moment.utc(comment.created_date).tz('Asia/Istanbul').format()
    }))
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createComment,
  deleteComment,
  getCommentsByTaskId
};
