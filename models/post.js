const db = require("../db");
const { DataTypes } = require("sequelize");

const Post = db.define("post", {
  // owner_id: {
  //   type: DataTypes.INTEGER,
  // },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Post;
