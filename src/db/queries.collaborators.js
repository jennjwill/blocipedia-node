const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");

module.exports = {
  add(req, callback) {
    User.findOne({
      where: {
        username: req.body.collaborator
      }
    }).then(user => {
      if (!user) {
        return callback("User does not exist");
        console.log("in queries.collab add", req.body.collaborator);
      }
      Collaborator.findOne({
        where: {
          userId: user.id,
          wikiId: req.params.wikiId
        }
      }).then(collaborator => {
        if (collaborator) {
          return callback("This user is already a collaborator on this wiki.");
          console.log("got thru Collaborator.findOne", collaborator);
        }
        let newCollaborator = {
          userId: user.id,
          wikiId: req.params.wikiId
        };
        return Collaborator.create(newCollaborator)
          .then(collaborator => {
            callback(null, collaborator);
          })
          .catch(err => {
            callback(err, null);
          });
      });
    });

    // add(req, callback) {
    //   if (req.user.username == req.body.collaborator) {
    //     return callback("Sorry, you can't add yourself to collaborators!");

    //   }
    //   User.findAll({
    //     where: {
    //       username: req.body.collaborator
    //     }
    //   })
    //     .then(users => {
    //       if (!users[0]) {
    //         return callback("User not found.");
    //       }
    //       Collaborator.findAll({
    //         where: {
    //           userId: users[0].id,
    //           wikiId: req.params.wikiId
    //         }
    //       })
    //         .then(collaborators => {
    //           if (collaborators.length != 0) {
    //             return callback(
    //               `${req.body.collaborator} is already a collaborator on this wiki.`
    //             );
    //           }
    //           let newCollaborator = {
    //             userId: users[0].id,
    //             wikiId: req.params.wikiId
    //           };
    //           return Collaborator.create(newCollaborator)
    //             .then(collaborator => {
    //               callback(null, collaborator);
    //             })
    //             .catch(err => {
    //               callback(err, null);
    //             });
    //         })
    //         .catch(err => {
    //           callback(err, null);
    //         });
    //     })
    //     .catch(err => {
    //       callback(err, null);
    //     });
  },

  remove(req, callback) {
    let collaboratorId = req.body.collaborator;
    let wikiId = req.params.wikiId;
    const authorized = new Authorizer(req.user, wiki, collaboratorId).destroy();
    if (authorized) {
      Collaborator.destroy({
        where: {
          userId: collaboratorId,
          wikiId: wikiId
        }
      })
        .then(deletedRecordsCount => {
          callback(null, deletedRecordsCount);
        })
        .catch(err => {
          callback(err);
        });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      callback(401);
    }
  }
};
