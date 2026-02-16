// const user = require("../models/User");
// c
// const bcrypt = require("bcrypt");

// function authRegister(req, res) {
//   const { name, email, password } = req.body;
//   const inputName = user.parse(name);
//   const inputEmail = user.parse(email);
//   const inputPassword = user.parse(password);

//   const isPresent = db.collection("User").find(email);
//   if (isPresent) {
//     res.status(400).json({
//       msg: "User already exists",
//     });
//   }
//   bcrypt.hash(password, 10, function (err, hash) {
//     if (err) {
//       return next(err);
//     }
//     password = hash;
//   });
//   const final = User.create({ name, email, password });
//   if (final) {
//     res.status(201).json({
//       msg: "User Registered Successfull",
//     });
//   }
// }

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const workspace = require('../models/workspace');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Send response (no password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingEmail = await User.findOne({ email });

    if (!existingEmail) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, existingEmail.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        email: existingEmail.email,
        _id: existingEmail._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    return res.status(200).json({
      token: token,
      user: {
        id: existingEmail._id,
        name: existingEmail.name,
        email: existingEmail.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getMe = async(req, res) => {
    //const user = await User.findById(req.user._id);
    const workspaceId = req.params.id;
    const realWorkspaceId = `ObjectId('${workspaceId}')`
    const idWorkspaceExists = await workspace.find({
      id: `ObjectId('${workspaceId}')`
    });
    if(!idWorkspaceExists){
      return res.status(404).json({
        message: "Not Found"
      })
    }
    console.log(idWorkspaceExists);
    // return res.json({
    //   name: user.name,
    //   email: user.email,
    //   id: user._id,
    // })
}

module.exports = {
  registerUser,
  loginUser,
  getMe
};
