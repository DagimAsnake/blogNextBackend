const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT = 12;
const SECRET_KEY = "sjskbjdnbhjnbhjcsnskhnjdb";

module.exports.Register = async (req, res) => {
    const data = req.body;
  
    if (!(data.firstName && data.lastName && data.password && data.email && data.username)) {
      return res.status(400).json({
        msg: "All inputs are required",
      });
    }
  
    try {
      const existingUser = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
      });
  
      if (existingUser) {
        const errors = {};
  
        if (existingUser.username === data.username) {
          errors.username = "Username is already taken";
        }
  
        if (existingUser.email === data.email) {
          errors.email = "Email already exists";
        }
  
        return res.status(400).json({
          msg: "Registration failed",
          errors,
        });
      }
  
      const hashedpassword = await bcrypt.hash(data.password, SALT);
  
      let datas = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: hashedpassword,
      };
  
      const new_user = new User(datas);
  
      await new_user.save();
  
      return res.status(200).json({
        msg: "User created successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  };


module.exports.Login = async (req, res) => {
    const data = req.body;
    if (!(data.email && data.password)) {
        return res.status(400).json({
          error: "Please provide your email and password",
        });
      }
  
    const user = await User.findOne({ email: data.email });
    
    if (!user) {
        return res.status(401).json({
          error: "Incorrect email or password",
        });
      }
  
    const correctPassword = await bcrypt.compare(data.password, user.password);
    if (!correctPassword) {
        return res.status(401).json({
          error: "Incorrect email or password",
        });
      }
    const token = jwt.sign({ id: user._id, },SECRET_KEY);

    res.cookie('session', token, { httpOnly: true})
  
    return res.status(200).json({
        msg: "Logged In Successfully",
        token: token,
      });
  };