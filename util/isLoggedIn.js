const jwt = require("jsonwebtoken");
const SECRET_KEY = "sjskbjdnbhjnbhjcsnskhnjdb";

module.exports = (req, res, next) => {
    const token = req.get("Authorization").split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (err) {
        console.log("Error from DECODEDtoken")
        console.log(err);
    }
    if (!decodedToken) {
        return res.json({
            msg: "You have to login first",
            status: 401,
        });
    } else {
        console.log(decodedToken);
    }
    next();
};