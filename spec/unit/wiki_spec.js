// const sequelize = require("../../src/db/models/index").sequelize;
// const Wiki = require("../../src/db/models").Wiki;
// const User = require("../../src/db/models").User;

// describe("Wiki", () => {

//   beforeEach((done) => {
// //#1
//     this.user;
//     this.wiki;
//     sequelize.sync({force: true}).then((res) => {

// //#2
//       Wiki.create({
//         title: "Expeditions to Alpha Centauri",
//         description: "A compilation of reports from recent visits to the star system."
//       })
//       .then((wiki) => {
//         this.wiki = wiki;
// //#3
//         Post.create({
//           title: "My first visit to Proxima Centauri b",
//           body: "I saw some rocks.",
// //#4
//           wikiId: this.wiki.id
//         })
//         .then((post) => {
//           this.post = post;
//           done();
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         done();
//       });
//     });

//   });
// });
