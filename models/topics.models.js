const db = require("../db/connection.js");

exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};
