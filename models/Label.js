const mongoose = require("mongoose");

const labelSchema = mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    maxLength: [25, "Title must be at most 25 character"],
  },
  color: {
    type: String,
    required: true,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  cardIDs: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
  },
});

export default mongoose.models.Label || mongoose.model("Label", labelSchema);
