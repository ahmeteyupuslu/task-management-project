const router = require("express").Router();

const { getUsers, createUser, updateUser, deleteUser, getUserById } = require('../controller/userController.js');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/delete/:id', deleteUser);

module.exports = router;