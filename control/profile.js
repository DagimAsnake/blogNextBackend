const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT = 12;
const SECRET_KEY = "sjskbjdnbhjnbhjcsnskhnjdb";

module.exports.ChangePassword = async function (req, res) {
    const token = req.get("Authorization").split(" ")[1];
    const validToken = jwt.verify(token, SECRET_KEY);
    const { oldPassword, confirmPassword, newPassword } = req.body;

    if (!(oldPassword && confirmPassword && newPassword)) {
        return res.json({
            msg: "All input is required",
        });
    }

    if (newPassword != confirmPassword) {
        return res.json({
            msg: "Password Must Match"
        }).status(200)
    }
    const user = await User.findById(validToken.id);
    if (!user) {
        return res.json({
            msg: "No such user "
        }).status(401)
    }
    const correctold = await bcrypt.compare(oldPassword, user.password)
    if (!correctold) {
        return res.json({
            msg: "Incorrect old password"
        }).status(200)
    }
    const new_pass = await bcrypt.hash(newPassword, SALT);
    await User.findByIdAndUpdate(validToken.id, { password: new_pass });
    return res.json({
        msg: "Password Changed Successfully"
    }).status(200)
}