const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = function () {
  // ac.grant("basic")
  // .createOwn("profile")
  // .readOwn("profile")
  // .updateOwn("profile")
  // .deleteOwn("profile")

  ac.grant("user")

    .createAny("post")
    .readAny("post")
    .updateAny("post")
    .deleteAny("post");

  ac.grant("user")
    .createAny("comment")
    .readAny("comment")
    .updateAny("comment")
    .deleteAny("comment");

  ac.grant("admin")
    .extend("user")
    .updateAny("post")
    .deleteAny("post")
    .deleteAny("comment");
};
return ac;
