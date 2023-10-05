/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
"use strict";
const connectDB = require("../db/connect.js");
const bookModel = require("../db/bookModel");
const { ObjectId } = require("mongoose").Types;

connectDB();

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      const listOfBooks = await bookModel.find({}).sort({ _id: 1 });
      return res.send(listOfBooks);
    })
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        return res.send("missing required field title");
      }
      const newBook = await bookModel.create({
        title,
        _id: new ObjectId(),
        comments: [],
        commentcount: 0,
      });
      return res.json({
        title: title,
        _id: newBook["_id"],
      });
    })
    .delete(async function (req, res) {
      await bookModel.deleteMany({});
      return res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      const bookid = req.params.id;
      const validateId = ObjectId.isValid(bookid);
      const result = await bookModel.findById(new ObjectId(bookid));
      
      if (!validateId || !result) {
        return res.send("no book exists");
      }

      return res.json(result);
    })
    .post(async function (req, res) {
      let bookid = req.params.id;
      const { comment } = req.body;

      if (!comment) {
        return res.send("missing required field comment");
      }

      const validateId = ObjectId.isValid(bookid)
      const result = await bookModel.findById(new ObjectId(bookid));

      if (!validateId || !result) {
        return res.send("no book exists")
      }
      result.comments.push(comment);
      result.commentcount++;
      await result.save()
      .then(book => {
        return res.send(book)
      })
    })
    .delete(async function (req, res) {
      let bookid = req.params.id;

      const validateId = ObjectId.isValid(bookid);
      const result = await bookModel.findById(new ObjectId(bookid));

      if (!validateId || !result) {
        return res.send("no book exists");
      }

      await bookModel.deleteOne(new ObjectId(bookid));
      return res.send("delete successful");
    });
};
