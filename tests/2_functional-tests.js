/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
      });
    done();
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    this.timeout(7000);

    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Space Odyssey" })
            .end((req, res) => {
              assert.property(
                res.body,
                "_id",
                "New book should have its unique id auto generated."
              );
              assert.property(res.body, "title", "Space Odyssey");
            });
          done();
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end((req, res) => {
              assert.property(res.text, "missing required field title");
            });
          done();
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((req, res) => {
            assert.isArray(res.body, "The response should be an array");
            assert.property(res.body[0], "comments");
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "title");
            assert.property(res.body[0], "commentcount");
          });
        done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/6518b5a26f8e00089c61722a")
          .end((req, res) => {
            assert.equal(res.text, "no book exists");
          });
        done();
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/65187f9a6f8e00089c617220")
          .end((req, res) => {
            assert.property(res.body, "title");
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments)
            assert.equal(res.body.commentcount, res.body.comments.length)
          });
        done();
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/65187f9a6f8e00089c617220")
            .send({ comment: "nice read" })
            .end((req, res) => {
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              assert.property(res.body, "comments");
              assert.equal(res.body.comments[res.body.comments.length - 1], "nice read")
              assert.isArray(res.body.comments)
              assert.equal(res.body.commentcount, res.body.comments.length)
            });
          done();
        });

        test("Test POST /api/books/[id] without comment field", function(done) {
          chai
            .request(server)
            .post("/api/books/65187f9a6f8e00089c617220")
            .send("")
            .end((req, res) => {
              assert.equal(res.text, "missing required field comment")
            });
          done();
        });

        test("Test POST /api/books/[id] with comment, id not in db", function(done) {
          chai
            .request(server)
            .post("/api/books/65187f9a6f8e00089c61722a")
            .send({ comment: "nice read" })
            .end((req, res) => {
              assert.equal(res.text, "no book exists")
            });
          done();
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function() {
      test("Test DELETE /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .delete("/api/books/65187f9a6f8e00089c617220")
          .end((req, res) => {
            assert.equal(res.text, "delete successful")
          });
        done();
      });

      test("Test DELETE /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .delete("/api/books/65187f9a6f8e00089c61722a")
          .end((req, res) => {
            assert.equal(res.text, "no book exists")
          });
        done();
        after(function() {
          chai.request(server).get('/api')
        });
      });
    });
  });
});
