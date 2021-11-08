const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, "Title must be at most 50 character"],
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [400, "Description must be at most 400 character"],
  },
  checklist: [
    {
      checked: { type: Boolean },
      item: {
        type: String,
        required: true,
        trim: true,
        maxlength: [150, "CheckItem must be at most 150 character"],
      },
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date },
      comment: {
        type: String,
        trim: true,
        minLength: [5, "Comment must be at least 5 character"],
        maxlength: [200, "Comment must be at most 200 character"],
      },
    },
  ],
  labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
  dueDate: {
    date: { type: Date },
    state: {
      type: String,
      trim: true,
      enum: ["complete", "due soon", "overdue", ""],
    },
    stateColor: {
      type: String,
      trim: true,
      enum: ["#ef9a9a", "#fff59d", "#a5d6a7", ""],
    },
    checked: { type: Boolean },
  },
  members: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] },
});

export default mongoose.models.Card || mongoose.model("Card", cardSchema);
