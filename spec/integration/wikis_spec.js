const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "ziggy22",
        email: "admin@example.com",
        password: "123456789"
      }).then(user => {
        this.user = user;
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            id: user.id,
            username: user.name,
            email: user.email
          }
        });
        Wiki.create({
          title: "JS Frameworks",
          body: "There is a lot of them"
        })
          .then(res => {
            this.wiki = res; //store resulting wiki in context
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
    //decide where to do all the beforeEach for regular member (gist etc)--MAY NOT NEED THIS IN THIS SPEC YET
    //member (signed-in) user context
    // describe("member user performing CRUD actions for wiki", () => {
    //   beforeEach(done => {
    //     request.get(
    //       {
    //         url: "http://localhost:3000/auth/fake",
    //         form: {
    //           role: "member"
    //         }
    //       },
    //       (err, res, body) => {
    //         done();
    //       }
    //     );
    //   });

    describe("GET /wikis", () => {
      it("should respond with all wikis", done => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {
      it("redirect to wikis view", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("wikis");
          done();
        });
      });
    });

    //   describe("POST /wikis/create", () => {
    //     const options = {
    //       url: `${base}create`,
    //       form: {
    //         title: "blink-182 songs",
    //         body: "What's your favorite blink-182 song?"
    //       }
    //     };

    //     it("should create a new wiki", done => {
    //       request.post(options, (err, res, body) => {
    //         Wiki.findOne({ where: { title: "blink-182 songs" } })
    //           .then(wiki => {
    //             expect(wiki).not.toBeNull();
    //             expect(body).toContain("What's your favorite blink-182 song?");
    //             done();
    //           })
    //           .catch(err => {
    //             console.log(err);
    //             done();
    //           });
    //       });
    //     });
    //   });

    //   describe("GET /wikis/:id", () => {
    //     it("should render a view with the selected wiki", done => {
    //       //variables defined outside, like `this.wiki` are only available inside "it" blocks
    //       request.get(`${base}${this.wiki.id}`, (err, res, body) => {
    //         expect(err).toBeNull();
    //         expect(body).toContain("JS Frameworks");
    //         done();
    //       });
    //     });
    //   });

    //   //add not delete spec for private wikis delete for public
    //   describe("POST /wikis/:id/destroy", () => {
    //     it("should not delete the wiki with the associated ID", done => {
    //       Wiki.all().then(wikis => {
    //         const wikiCountBeforeDelete = wikis.length;

    //         expect(wikiCountBeforeDelete).toBe(1);

    //         request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
    //           Wiki.all().then(wikis => {
    //             //confirm that no wikis were deleted
    //             expect(wikis.length).toBe(wikiCountBeforeDelete);
    //             done();
    //           });
    //         });
    //       });
    //     });
    //   });

    //   //add not edit spec for private wikis
    //   describe("GET /wikis/:id/edit", () => {
    //     it("should render a view with an edit wiki form", done => {
    //       request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
    //         expect(err).toBeNull();
    //         expect(body).not.toContain("Edit wiki");
    //         expect(body).toContain("JS Frameworks"); //confirm redirect to wiki/show
    //         done();
    //       });
    //     });
    //   });

    //   describe("POST /wikis/:id/update", () => {
    //     it("should update the wiki with the given values", done => {
    //       const options = {
    //         url: `${base}${this.wiki.id}/update`,
    //         form: {
    //           title: "JavaScript Frameworks",
    //           body: "There are a lot of them"
    //         }
    //       };

    //       request.post(options, (err, res, body) => {
    //         expect(err).toBeNull();

    //         Wiki.findOne({
    //           where: { id: 1 }
    //         }).then(wiki => {
    //           expect(wiki.title).toBe("JS Frameworks"); //confirm title is unchanged
    //           done();
    //         });
    //       });
    //     });
    //   });
  });
});
