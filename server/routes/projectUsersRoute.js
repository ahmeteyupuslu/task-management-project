const router = require("express").Router();
const {
  addUserstoProject,
  getUsersbyProjectID,
  getProjectsbyUserID,
  deleteUsersfromProject,
} = require("../controller/projectUsersController.js");
const { verifyUser } = require("../middleware/VerifyUser.js");

router.post("/", verifyUser, addUserstoProject);
router.get("/:project_id", verifyUser, getUsersbyProjectID);
router.get("/getusersprojects/:user_id", verifyUser, getProjectsbyUserID);
router.put("/delete", verifyUser, deleteUsersfromProject);

module.exports = router;
