const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/fetchUser")

const JWT_SECRET = "Deepanshuisagoodb$oy";

// Route1 : Create a user using : POST "/api/auth". Doesn't require authentication. No Login required.
router.post(
  "/createuser",
  [
    body("name", "Enter a Vaid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors, return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //Check whether the user with this email already exists or not.

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with this email already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // .then((user) => res.json(user))

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authToken });

      //.catch(err=>{
      //console.log("error ::: "+err)
      //res.json({error : 'Please enter a unique value for email.',//message : err.message})
      //})

      // console.log(req.body);
      // const user = User(req.body);
      // user.save();
      // res.send(req.body);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success, error: "Some error ocurred" });
    }
  }
);

// Route2 :Authenticate a user using: POST "/api/auth/login". No login required

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please try to login with correct credetials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Please try to login with correct credetials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({ success, authToken });
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route3 :Get Loggedin User Details: POST "/api/auth/getuser".login required
router.post(
  "/getuser", fetchUser ,async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
