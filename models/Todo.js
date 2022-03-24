const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  value: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("TODO", TodoSchema);
module.exports = Todo;
