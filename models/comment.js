const db = require("../db");
const { DataTypes } = require("sequelize");

const Comment = db.define("comment", {
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Comment;
