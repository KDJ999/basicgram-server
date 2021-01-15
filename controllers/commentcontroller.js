require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Comment, Post } = require("../models");
const ac = require("../roles");
const db = require("../db");
const validateSession = require("../middleware/validateSession");
const { query } = require("../db");

//Create Comment
router.post("/createcomment", validateSession, async (req, res) => {
  console.log("Posted");
  // const { comment, likes } = req.body;
  try {
    let newComment = {
      comment: req.body.comment,
      userId: req.user.id,
      postId: req.body.postId, //is what we will use to pull comments for specific post
    };
    Comment.create(newComment).then((comment) =>
      res.status(200).json({
        comment: newComment,
        message: "Comment Created!",
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Comment Failed.",
    });
  }
});

//Get all Comments
router.get("/getallcomments/:id", validateSession, (req, res) => {
  const query = req.params.id;
  Post.findOne({ where: { id: query } })
    .then((locatedpost) => {
      Comment.findAll({ where: { postId: locatedpost.id } }).then((comment) =>
        res.status(200).json(comment)
      );
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});
//Update Comment
router.put("/update/:id", validateSession, (req, res) => {
  const query = req.params.id;
  Comment.update(req.body, { where: { id: query } })
    .then((commentUpdated) => {
      Comment.findOne({ where: { id: query } }).then(
        (locatedUpdatedComment) => {
          res.status(200).json({
            comment: locatedUpdatedComment,
            message: "Post updated successful",
            commentChanged: commentUpdated,
          });
        }
      );
    })
    .catch((err) =>
      res.json({
        err,
      })
    );
});

//admin can also delete any Comment
router.delete("/delete/:id", validateSession, (req, res) => {
  if (req.user.role === "admin") {
    Comment.destroy({
      where: { id: req.params.id },
    })
      .then((comment) => res.status(200).json(comment))
      .catch((err) => res.json(err));
  }
});

module.exports = router;
