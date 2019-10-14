const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

// describe("routes : wikis", () => {
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
//           body: "There is a lot of them",
//userId: this.user.id
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

//   beforeEach(done => {
//     this.wiki;
//     this.user;

//     sequelize.sync({ force: true }).then(res => {
//       User.create({
//         username: "ziggy22",
//         email: "admin@example.com",
//         password: "123456789",
//         role: "standard"
//       }).then(user => {
//         this.user = user;
//         request.get({
//           url: "http://localhost:3000/auth/fake",
//           form: {
//             role: "standard",
//             userId: this.user.id
//           }
//         });
//         Wiki.create({
//           title: "JS Frameworks",
//           body: "There is a lot of them",
//           userId: this.user.id
//         })
//           .then(wiki => {
//             this.wiki = wiki; //store resulting wiki in context

//             done();
//           })
//           .catch(err => {
//             console.log(err);
//             done();
//           });
//       });
//     });
//   });

//   describe("GET /wikis", () => {
//     it("should return all wikis", done => {
//       request.get(base, (err, res, body) => {
//         expect(err).toBeNull();
//         expect(body).toContain("Wikis");
//         expect(body).toContain("JS Frameworks");
//         done();
//       });
//     });
//   });

//   describe("GET /wikis/new", () => {
//     it("should render a new wiki form", done => {
//       request.get(`${base}new`, (err, res, body) => {
//         //console.log("BODY in /NEW spec is=", body);
//         console.log("USER", this.user.id);
//         expect(err).toBeNull();
//         expect(body).toContain("Create New Wiki");
//       });
//       done();
//     });
//   });

//   describe("POST /wikis/create", () => {
//     it("should create a new wiki and redirect", done => {
//       const options = {
//         url: `${base}create`,
//         form: {
//           title: "best albums of 1984",
//           body: "Purple Rain",
//           userId: 1,
//           private: false
//         }
//       };
//       request.post(options, (err, res, body) => {
//         Wiki.findOne({ where: { title: "best albums of 1984" } })
//           .then(wiki => {
//             expect(wiki.body).toContain("Purple Rain"); //findOne is working, this may not be creating a wiki
//           })
//           .catch(err => {
//             console.log(err);
//           });
//         done();
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

//   describe("POST /wikis/:id/destroy", () => {
//     it("should delete the wiki with the associated ID", done => {
//       Wiki.all().then(wikis => {
//         const wikiCountBeforeDelete = wikis.length;

//         expect(wikiCountBeforeDelete).toBe(1);

//         request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
//           Wiki.findAll().then(wikis => {
//             expect(err).toBeNull();
//             expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
//             done();
//           });
//         });
//       });
//     });
//   });

//   describe("GET /wikis/:id/edit", () => {
//     console.log("this.user", this.user);
//     it("should render a view with an edit wiki form", done => {
//       request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
//         expect(err).toBeNull();
//         expect(body).toContain("Edit wiki");
//         //expect(body).toContain("JS Frameworks"); //confirm redirect to wiki/show
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
//           body: "There are a lot of them",
//           userId: this.user.id
//         }
//       };

//       request.post(options, (err, res, body) => {
//         expect(err).toBeNull();

//         Wiki.findOne({
//           where: { id: this.wiki.id }
//         }).then(wiki => {
//           expect(wiki.title).toBe("JavaScript Frameworks");
//           done();
//         });
//       });
//     });
//   });
// });

describe("routes : wikis", () => {
  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "masterchief",
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
          // private: true,
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
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
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
        username: "masterchief",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
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
