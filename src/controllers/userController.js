const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");

const secretKey = process.env.SECRET_KEY;

const publishableKey = process.env.PUBLISHABLE_KEY;

const stripe = require("stripe")(secretKey);

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
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function() {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgrade(req, res, next) {
    res.render("users/upgrade", { publishableKey }); //change to real key from stripe dashboard
  },

  payment(req, res, next) {
    stripe.customers
      .create({
        email: req.body.stripeEmail
      })
      .then(customer => {
        return stripe.customers.createSource(customer.id, {
          source: "tok_visa"
        });
      })
      .then(source => {
        return stripe.charges.create({
          amount: 1500,
          description: "Blocipedia Premium Membership Charge",
          currency: "usd",
          customer: source.customer
        });
      })
      .then(charge => {
        userQueries.upgrade(req.user.dataValues.id);
        res.render("users/payment_success");
      })
      .catch(err => {
        console.log(err);
        done();
      });
  },

  downgrade(req, res, next) {
    userQueries.downgrade(req.user.dataValues.id);
    wikiQueries.downgradePrivateWikis(req.user.dataValues.id);
    req.flash("notice", "You are no longer a premium Blocipedia user.");
    res.redirect("/");
  },

  showCollaborations(req, res, next) {
    userQueries.getUser(req.user.id, (err, result) => {
      let user = result["user"];
      let collaborations = result["collaborations"];
      if (err || user == null) {
        res.redirect(404, "/");
      } else {
        res.render("users/collaborations", { user, collaborations });
      }
    });
  }
};
