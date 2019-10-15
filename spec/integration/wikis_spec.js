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
        username: "ziggy999",
        email: "admin@example.com",
        password: "123456789"
        // role: "premium"
      })
        .then(user => {
          this.user = user;
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              id: user.id,
              username: user.name,
              email: user.email,
              role: user.role
            }
          });
          Wiki.create({
            title: "JavaScript",
            body: "JS frameworks and fundamentals",
            userId: user.id
          })
            .then(wiki => {
              this.wiki = wiki;
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /wikis", () => {
    it("should render the wiki index page", done => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {
    it("should render a view with a new wiki form", done => {
      request.get(`${base}new`, (err, res, body) => {
        console.log("USER in wikis/new is=", this.user.id);
        expect(err).toBeNull();
        expect(body).toContain("JavaScript");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    it("should create a new wiki and redirect", done => {
      const options = {
        url: `${base}create`,
        form: {
          title: "New wiki",
          body: "New wiki body",
          userId: this.user.id
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findOne({ where: { title: "New wiki" } })
          .then(wiki => {
            expect(wiki.title).toBe("New wiki");
            expect(wiki.body).toBe("New wiki body");
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
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("JS frameworks");
        done();
      });
    });
  });

  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", done => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        console.log("WIKI ID is=", +this.wiki.id);
        console.log("USER is=", +this.user.id);
        expect(err).toBeNull();
        expect(body).toContain("Edit wiki");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {
    it("should update the wiki with the given values", done => {
      request.post(
        {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            body: "There are a lot of them",
            userId: this.user.id
          }
        },
        (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: 1 }
          })
            .then(wiki => {
              expect(wiki.title).toBe("JavaScript Frameworks");
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        }
      );
    });
  });

  describe("POST /wiki/:id/update ", () => {
    it("should update a wiki object of another user", done => {
      User.create({
        username: "ziggy999",
        email: "hellothere@gmail.com",
        password: "123456",
        role: "standard"
      })
        .then(user => {
          this.user = user; //store the user
          request.post(
            {
              url: `${base}${this.wiki.id}/update`,
              form: {
                title: "JavaScript Frameworks",
                body: "There are a lot of them",
                userId: this.user.id
              }
            },
            (err, res, body) => {
              expect(err).toBeNull();
              Wiki.findOne({
                where: { id: 1 }
              })
                .then(wiki => {
                  expect(wiki.title).toBe("JavaScript Frameworks");
                  done();
                })
                .catch(err => {
                  console.log(err);
                  done();
                });
            }
          );
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", done => {
      Wiki.all().then(wikis => {
        const wikiCountBeforeDelete = wikis.length;
        expect(wikiCountBeforeDelete).toBe(1);
        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.all()
            .then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });
  });
});
