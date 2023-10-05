const mongoose = require("mongoose");
const connectDB = require("./connect");
const BookModel = require("./bookModel");

const ObjectId = mongoose.Types.ObjectId;

connectDB();

async function seedDB() {
  await BookModel.deleteMany({});
  await BookModel.insertMany([
    {
      _id: new ObjectId("65187f9a6f8e00089c617220"),
      title: "Space Odyssey",
      commentcount: 0,
      comments: []
    }
  ]);
  console.log("reset successfully");
}

seedDB().then(() => mongoose.disconnect());
