const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  // beforeEach(done => {
  //   this.wiki;
  //   this.user;

  //   sequelize.sync({ force: true }).then(res => {
  //     User.create({
  //       username: "ziggy22",
  //       email: "admin@example.com",
  //       password: "123456789"
  //     })
  //       .then(user => {
  //         this.user = user;

  //         request.get({
  //           url: "http://localhost:3000/auth/fake",
  //           form: {
  //             userId: user.id,
  //             role: "standard"
  //           }
  //         });
  //       })
  //       .then(() => {
  //         Wiki.create({
  //           title: "JS Frameworks",
  //           body: "There is a lot of them"
  //         }).then(wiki => {
  //           this.wiki = wiki;
  //           done();
  //         });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         done();
  //       });
  //   });
  // });

  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "ziggy22",
        email: "admin@example.com",
        password: "123456789"
        //role: "standard"
      }).then(user => {
        this.user = user;
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: "standard",
            userId: this.user.id
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
  });

  describe("GET /wikis", () => {
    it("should return all wikis", done => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {
    it("should render a new wiki form", done => {
      request.get(`${base}new`, (err, res, body) => {
        console.log("body is=", body);
        expect(err).toBeNull();
        expect(body).toContain("Wiki title");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    it("should create a new wiki and redirect", done => {
      const options = {
        url: `${base}create`,
        form: {
          title: "best albums of 1984",
          body: "Purple Rain",
          userId: 1,
          private: false
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findOne({ where: { title: "best albums of 1984" } })
          .then(wiki => {
            expect(wiki.body).toContain("Purple Rain"); //findOne is working, this may not be creating a wiki
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /wikis/:id", () => {
    it("should render a view with the selected wiki", done => {
      //variables defined outside, like `this.wiki` are only available inside "it" blocks
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  //add not delete spec for private wikis delete for public
  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", done => {
      Wiki.all().then(wikis => {
        const wikiCountBeforeDelete = wikis.length;

        expect(wikiCountBeforeDelete).toBe(1);

        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findAll().then(wikis => {
            expect(err).toBeNull();
            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  //add not edit spec for private wikis
  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", done => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).not.toContain("Edit Wiki");
        expect(body).toContain("JS Frameworks"); //confirm redirect to wiki/show
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {
    it("should update the wiki with the given values", done => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "JavaScript Frameworks",
          body: "There are a lot of them",
          userId: this.user.id
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Wiki.findOne({
          where: { id: this.wiki.id }
        }).then(wiki => {
          expect(wiki.title).toBe("JavaScript Frameworks");
          done();
        });
      });
    });
  });
});
