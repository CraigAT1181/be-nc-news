const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = (article_id) => {
  const commentsQuery = db.query(`SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`, [article_id])
    
  const articleQuery = db.query(`
    SELECT *
    FROM articles 
    WHERE article_id = $1;
    `, [article_id])
  

  return Promise.all([commentsQuery, articleQuery]).then(([comments, article]) => {

    if ((comments.rows.length === 0 && article.rows.length !== 0) || comments.rows.length > 0) {
      
      return comments.rows;
    } 
    else {
      return Promise.reject({
        status: 404,
        message: "Not found.",
      });
  }})

}

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *;
    `,
      [article_id, username, body]
    )
    .then((result) => {
      const comment = result.rows[0];
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Username doesn't exist.",
        });
      } else {
        return comment;
      }
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1;
  `,
      [comment_id]
    )

    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Couldn't find a comment with that ID.",
        });
      }
    });
};
