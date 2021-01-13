require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize/lib/errors");

//signup
router.post("/signup", async (req, res) => {
  //object deconstructing to separate data when sent in body
  let { firstname, lastname, email, password, role } = req.body;
  console.log(req);

  try {
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: bcrypt.hashSync(password, 13),
      role,
    });

    res.status(200).json({
      message: "User registered!",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email already in use.",
      });
    } else {
      res.status(500).json({
        error: "Failed to register user.",
      });
    }
  }
});
//Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  try {
    let loginUser = await User.findOne({
      where: { email }, //email:email is email
    });
    console.log("loginUser", loginUser);
    if (loginUser && (await bcrypt.compare(password, loginUser.password))) {
      const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      res.status(200).json({
        message: "Login succeeded!",
        user: loginUser,
        token,
      });
    } else {
      res.status(401).json({
        message: "Login failed: User Information Incorrect.",
      });
    }
  } catch (error) {}
  res.status(500).json({
    error: "Error logging In!",
  });
});
module.exports = router;

//Login
// router.post("/login", function (req, res) {
//   User.findOne({
//     where: {
//       email: req.body.user.email,
//     },
//   })
//     .then(function loginSuccess(user) {
//       if (user) {
//         bcrypt.compare(
//           req.body.user.password,
//           user.password,
//           function (err, matches) {
//             if (matches) {
//               let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//                 expiresIn: 60 * 60 * 24,
//               });
//               res.status(200).json({
//                 user: user,
//                 message: "User successfully logged in!",
//                 sessionToken: token,
//               });
//             } else {
//               res.status(502).send({ error: "Login failed " });
//             }
//           }
//         );
//       } else {
//         res.status(500).json({ error: "User does not exist." });
//       }
//     })
//     .catch((err) => res.status(500).json({ error: err }));
// });

// router.put("/update/:email", validateSession, function (req, res) {
//   const updateUser = {
//     firstname: req.body.user.firstname,
//     lastname: req.body.user.lastname,
//     email: req.body.user.email,
//     password: bcrypt.hashSync(req.body.user.password, 13),
//     role: req.body.user.role,
//   };
//   const query = { where: { email: req.params.email } };

//   User.update(updateUser, query)
//     .then((user) => res.status(200).json(user))
//     .catch((err) => res.status(500).json({ eroor: err }));
// });

// router.delete("/delete/:email", validateSession, function (req, res) {
//   const query = { where: { email: req.params.email } };

//   User.destroy(query)
//     .then(() => res.status(200).json({ message: "User Deleted" }))
//     .catch((err) => res.status(500).json({ error: err }));
// });

// const db = require("../db");
// const ac = require("../roles");
// let validateSession = require("../middleware/validateSession");

//Signup
// router.post("/signup", function (req, res) {
//   User.create({
//     firstname: req.body.user.firstname,
//     lastname: req.body.user.lastname,
//     email: req.body.user.email,
//     password: bcrypt.hashSync(req.body.user.password, 13),
//     role: req.body.user.role,
//   })
//     .then(function createSuccess(user) {
//       let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//         expiresIn: 60 * 60 * 24,
//       });
//       res.json({
//         user: user,
//         message: "User successfully created!",
//         sessionToken: token,
//       });
//     })
//     .catch((err) => res.status(500).json({ error: err }));
// });
