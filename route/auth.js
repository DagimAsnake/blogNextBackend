const router = require("express").Router();
const userController = require("../control/auth")

router.post('/register', userController.Register )
router.post('/login', userController.Login)
router.get('/verify', userController.VerifyUserToken)

module.exports = router;