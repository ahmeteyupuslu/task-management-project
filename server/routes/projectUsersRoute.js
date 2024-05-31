const router = require("express").Router();
const {
  addUserstoProject,
  getUsersbyProjectID,
  deleteUsersfromProject,
  getUsersNotInProject
} = require("../controller/projectUsersController.js");
const { verifyUser } = require("../middleware/VerifyUser.js");

router.post("/", verifyUser, addUserstoProject);
router.get("/:project_id", verifyUser, getUsersbyProjectID);
router.get(
  "/getusersnotinproject/:project_id",
  verifyUser,
  getUsersNotInProject
);


router.put("/delete", verifyUser, deleteUsersfromProject);

module.exports = router;
