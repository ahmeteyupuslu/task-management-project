const router = require("express").Router();
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controller/commentController.js");
const {verifyUser} = require('../middleware/VerifyUser.js');

router.post("/:task_id", verifyUser, createComment);
router.put("/:id", verifyUser, updateComment);
router.delete("/:id", verifyUser, deleteComment);

module.exports = router;
