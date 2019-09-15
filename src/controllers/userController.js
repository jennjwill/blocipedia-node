const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {
    //pulling values from req body & adding to newUser object
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        console.log("error in userController");
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email,
          from: "signedup@blocipedia.com",
          subject: "You've Signed Up with Blocipedia!",
          text: "Log in and start collaborating on wikis!",
          html: "<strong>Log in and start collaborating on wikis!</strong>"
        };
        sgMail.send(msg);
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  }
};
