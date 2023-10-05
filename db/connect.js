const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const BookSchema = new Schema({
  _id: ObjectId,
  comments: [String],
  title: String,
  commentcount: Number,
});

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;
