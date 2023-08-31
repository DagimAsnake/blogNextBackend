const router = require("express").Router();
const userController = require("../control/auth")

router.post('/register', userController.Register )

module.exports = router;