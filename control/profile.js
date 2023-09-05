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

module.exports.viewProfile =async (req, res) => {
    const token = req.get("Authorization").split(" ")[1];
    let decodedToken = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decodedToken.id)
    if (!user) {
        return res.json({ msg: "User not found" }).status(403)
    }

    return res.json({ msg: user }).status(200)
}

module.exports.EditUserProfile = async function (req, res) {
    const data = req.body
    const token = req.get("Authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);

    if (!(data.firstname && data.lastname && data.email && data.username)) {
        return res.json({
            msg: 'All inputs are required'
        })
    }

    const new_data = {
        username: data.username,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
    }

    const user_data = await User.findByIdAndUpdate(decodedToken.id, new_data, { runValidators: true, });
    if (!user_data) {
        return res.json({
            msg: "No such user"
        }).status(401)
    }

    return res.json({
        msg: "Data Updated Successfully"
    }).status(200)
}