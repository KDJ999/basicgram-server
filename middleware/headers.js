module.exports = (req, res, next) => {
  res.header("access-control-allow-origin", "*");
  res.header("access-control-allow-methods", "GET, POST, PUT, DELETE");
  res.header(
    "access-control-allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
};

//step 1 write a function called 'corsmiddleware' that takes in
// req, res, and next
// step 2 put the current headers inside of the function
// step 3 import function into app.js & write an express '.use()'
// statement utilizing the function.
