const router = require('express').Router();
const { login, auth } = require('../controller/authController.js');

router.post('/login', login);
/* router.get('/verify', auth); */

module.exports = router;