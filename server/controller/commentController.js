const database = require("../services/database.js");

const createComment = async (req, res) => {
  try {
    const loggedUser = 18; //jwt token ile alınacak
    const result = await database.pool.query({
      text: `INSERT INTO comment (task_id, user_id, user_comment, created_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      values: [
        req.params.task_id,
        (req.body.user_id = loggedUser),
        req.body.user_comment,
        (req.body.created_date = new Date()),
      ],
    });
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const result = await database.pool.query({
      text: `UPDATE comment
            SET user_comment = $1
            WHERE id = $2
            RETURNING *`,
      values: [req.body.user_comment, req.params.id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    return res.status(200).json(result.rows[0]);
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
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
