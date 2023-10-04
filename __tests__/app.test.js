const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const index = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(index));
afterAll(() => db.end());

describe("/api", () => {
  test("GET: 200 sends an object with all available endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("Should check that all available APIs are included.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET: 200 sends an array of topic objects to the client.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 sends all articles in the correct format.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article).toBe("object");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("Should return articles without a body, and with a commment_count.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("Should return articles with correct comment_count.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles[0].comment_count).toBe(2);
      });
  });
  test("Should return sorted articles in desc order by date.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        const latest = articles[0].created_at;
        const earliest = articles[12].created_at;

        expect(latest > earliest).toBe(true);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 sends an article matching the article_id.", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(2);
      });
  });
  test("Article should be of the correct format.", () => {
    return request(app)
      .get("/api/articles/2")
      .then(({ body }) => {
        const article = body.article;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });

  test("GET 404 Article Not Found", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("Article does not exist.");
      });
  });

  test("GET 400 Bad Request", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request.");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 sends array of all comments by article_id.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("Should return comments in correct format.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("Should return sorted comments in desc order by date.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        const latest = comments[0].created_at;
        const earliest = comments[10].created_at;

        expect(latest > earliest).toBe(true);
      });
  });
  test("GET 404 Article Not Found", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("Article does not exist.");
      });
  });

  test("GET 400 Bad Request", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request.");
      });
  });
});

describe("Generic handler", () => {
  test("GET: 404 sends an appropriate status and error message.", () => {
    return request(app)
      .get("/api/top")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found.");
      });
  });
});
