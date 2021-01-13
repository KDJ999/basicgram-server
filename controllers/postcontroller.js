require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../db");
const { Post, Comment } = require("../models");
const ac = require("../roles");
const validateSession = require("../middleware/validateSession");

//Dependecies for Image Uploading
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
// const s3 = new aws.S3();
const path = require("path");

var s3 = new aws.S3({
  // aws.config.update
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  // region: "us-east-2",
  // bucket: process.env.BUCKET_NAME,
});

const imgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "kdj-basicgram",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    // key: function (req, file, cb) {
    //     cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
    // }
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(
//         null,
//         path.basename(file.originalname, path.extname(file.originalname)) +
//           "-" +
//           Date.now() +
//           path.extname(file.originalname)
//       );
//     },
//   }),
// });

//Create Post
router.post(
  "/createpost",
  imgUpload.single("image"),
  validateSession,
  async (req, res) => {
    // const { file, description, likes } = req.body;
    // console.log(req.body.description);
    // console.log(req.body.likes);
    // console.log(req.user.id);
    console.log(req.file);
    try {
      let newPost = {
        file: req.file.location,
        description: req.body.description,
        likes: req.body.likes,
        userId: req.user.id,
      };
      Post.create(newPost).then((post) =>
        res.status(200).json({
          post: post,
          message: "Post Created!",
        })
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Post Failed.",
      });
    }
  }
);

//Get all the Posts
router.get("/getallposts", validateSession, (req, res) => {
  Post.findAll({ include: [{ model: Comment }] })
    .then((post) => res.status(200).json(post))
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});

//Edit post
//only admin/created user can edit post
router.put("/update/:id", validateSession, (req, res) => {
  // const permission = ac.can(req.user.role).updateAny("post");
  const query = req.params.id;
  if (req.user.role === "admin") {
    Post.update(req.body, { where: { id: query } })
      .then((postUpdated) => {
        Post.findOne({ where: { id: query } }).then((locatedUpdatedPost) => {
          res.status(200).json({
            post: locatedUpdatedPost,
            message: "Post updated successful",
            postChanged: postUpdated,
          });
        });
      })
      .catch((err) => res.json({ err }));
  }
});
//Delete Post
//only admin/created user can delete posts
router.delete("/delete/:id", validateSession, (req, res) => {
  // const permission = ac.can(req.user.role).deleteAny("post");
  // const query = req.params.id;
  if (req.user.role === "admin") {
    Post.destroy({
      where: { id: req.params.id },
    })
      .then((post) => res.status(200).json(post))
      .catch((err) => res.json(err)); //can be wriiten like this also

    //Specific post
    router.get("/mine", validateSession, (req, res) => {
      let userid = req.user.id;
      Post.findAll({
        where: { owner_id: userid },
      })
        .then((post) => res.status(200).json(post))
        .catch((err) => res.status(500).json({ error: err }));
    });
    //Find by Description
    router.get("/description", validateSession, (req, res) => {
      let description = req.params.description;
      Post.findAll({
        where: { description: description },
      })
        .then((post) => res.status(200).json(post))
        .catch((err) => res.status(500).json({ error: err }));
    });
  }
});
module.exports = router;
