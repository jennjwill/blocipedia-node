const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },

  privateIndex(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/private", { wikis });
      }
    });
  },

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      console.log("Got thru Authorized in NEW fxn but before render");
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: req.body.private,
      userId: req.user.id
    };
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, result) => {
      wiki = result["wiki"];
      collaborators = result["collaborators"];
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(
          req.user,
          wiki,
          collaborators
        ).showCollaborators();
        if (authorized) {
          wiki.body = markdown.toHTML(wiki.body);
          res.render("wikis/show", { wiki });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis`);
        }
      }
    });
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
      if (err) {
        res.redirect(500, `/wikis/${wiki.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, result) => {
      wiki = result["wiki"];
      collaborators = result["collaborators"];
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki, collaborators).edit();
        if (authorized) {
          console.log("INSIDE EDIT fxn. Thru Authorizer");
          res.render("wikis/edit", { wiki, collaborators });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${wiki.id}`);
      }
    });
  }
};
