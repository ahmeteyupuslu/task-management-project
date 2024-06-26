const router = require("express").Router();

const {
  getTasksbyUser,
  getTaskById,
  getTaskByProjectId,
  createTask,
  updateTaskStatus,
  updateTaskbyAdmin,
  deleteTask
} = require("../controller/taskController.js");

const { verifyUser } = require("../middleware/VerifyUser.js");

router.get("/:user_id", verifyUser, getTasksbyUser);
router.get("/:id", verifyUser, getTaskById);
router.get("/project/:id", verifyUser, getTaskByProjectId);

router.post("/", verifyUser, createTask);

router.put("/:id", verifyUser, updateTaskStatus);
router.put("/update/:id", verifyUser, updateTaskbyAdmin);
router.put("/delete/:id", verifyUser, deleteTask)

module.exports = router;
