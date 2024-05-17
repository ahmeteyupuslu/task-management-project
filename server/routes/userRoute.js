const router = require("express").Router();
const { verifyUser } = require("../middleware/VerifyUser.js");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controller/userController.js");
const { authorize } = require("../middleware/Authorize.js");

router.get("/", verifyUser, getUsers);
router.get("/:id", verifyUser, getUserById);
router.post("/", verifyUser, authorize, createUser);
router.put("/:id", verifyUser, authorize, updateUser);
router.put("/delete/:id", verifyUser, authorize, deleteUser);

module.exports = router;
