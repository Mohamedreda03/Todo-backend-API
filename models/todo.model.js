const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    auther: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Todo", todoSchema);
