const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, "Title must be at most 50 character"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listsOrder: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Label",
    },
  ],
  sharedWith: {
    type: [String],
  },
});

export default mongoose.models.Board || mongoose.model("Board", boardSchema);
