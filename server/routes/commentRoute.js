const router = require("express").Router();
const {
  createComment,
  deleteComment,
  getCommentsByTaskId,
} = require("../controller/commentController.js");
const {verifyUser} = require('../middleware/VerifyUser.js');

router.post("/:task_id", verifyUser, createComment);
router.delete("/:id", verifyUser, deleteComment);
router.get("/:task_id", verifyUser, getCommentsByTaskId);

module.exports = router;
