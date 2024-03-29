const router = require("express").Router();
const profileController = require("../control/profile")
const isLoggedIn = require("../util/isLoggedIn");

router.put('/changepassword', isLoggedIn, profileController.ChangePassword)
router.get("/", isLoggedIn, profileController.viewProfile)
router.put("/edit", isLoggedIn, profileController.EditUserProfile);

module.exports = router;