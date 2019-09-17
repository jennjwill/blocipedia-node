//this migration is probably useless b/c I had a typo in command, no table

"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Wikis", "userId", {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Wikis", "userId");
  }
};
