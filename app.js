require("dotenv").config();
const express = require("express");
// const sequelize = require("./db");
const app = express();
let db = require("./db");

app.use(express.json());
app.use(require("./middleware/headers"));
const controllers = require("./controllers");

// sequelize.sync();
// sequelize.sync({ force: true });

app.use("/user", controllers.usercontroller);
// app.use(require("./middleware/validateSession"));
app.use("/post", controllers.postcontroller);
app.use("/comment", controllers.commentcontroller);

db.authenticate()
  .then(() => db.sync())
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`[SERVER] App is listening on ${process.env.PORT} 😃`);
    });
  })
  .catch((err) => {
    console.log("[Server:] Server Crashed");
    console.log(err);
  });
