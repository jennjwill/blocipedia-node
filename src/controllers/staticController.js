module.exports = {
  index(req, res, next) {
    res.render("static/index", { title: "Welcome to Jenn's Blocipedia" });
  }
};
