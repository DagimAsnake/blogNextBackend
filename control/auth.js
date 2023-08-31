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
  
      const token = jwt.sign({ id: new_user._id, },SECRET_KEY);

      res.cookie('session', token, { httpOnly: true})
    
      return res.status(200).json({
          msg: "User created successfully, Logged In Successfully",
          token: token,
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


module.exports.VerifyUserToken = async function (req, res) {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.json({
      msg: false,
    }).status(200);
  }

  const token = authHeader.split(" ")[1];
    const validToken = jwt.verify(token, SECRET_KEY);

    if (validToken) {
      return res
        .json({
          msg: true,
        })
        .status(401);
    }
    return res
      .json({
        msg: false,
      })
      .status(200);
  };