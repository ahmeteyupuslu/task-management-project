const router = require("express").Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getProjectsByOwnerId,
  addingUsersToProject,
} = require("../controller/projectController.js");
const { authorize } = require("../middleware/Authorize.js");
const { verifyUser } = require("../middleware/VerifyUser.js");

router.get("/", verifyUser, getProjects);
router.get("/:id", verifyUser, getProjectById);
router.get("/owner/:owner_id", verifyUser, getProjectsByOwnerId);
router.post("/", verifyUser, createProject);
router.put("/:id", verifyUser, updateProject);
router.put("/delete/:id", verifyUser, authorize, deleteProject);
router.post("/adduser", verifyUser, addingUsersToProject);

module.exports = router;
