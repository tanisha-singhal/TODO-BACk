const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const fetchUser = require("../middleware/fetchUser");
// ROUTE 1:GET ALL THE TODO USING :GET "/api/todo/fetchtodo".Login required.
router.get("/fetchtodo", fetchUser, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

//ROUTE 2:ADD A NEW TODO USING :POST "api/todo/addtodo". Login required.
router.post("/addtodo", fetchUser, async (req, res) => {
  try {
    const { value, checked } = req.body.value;

    const todo = await Todo.create({
      user: req.user._id,
      value: value,
      checked: checked,
    });
    const savedtodo = await todo.save();
    res.json(savedtodo);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

//ROUTE 3:UPDATE AN EXISTING TODO USING :PUT "api/todo/updatetodo".login required.
router.put("/updatetodo/:id", fetchUser, async (req, res) => {
  const todoToBeUpdated = req.body;
  console.log(todoToBeUpdated);

  try {
    //Find the todo to be updated and update it.
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send("Not Found");
    }

    if (todo.user.toString() !== req.user._id) {
      return res.status(401).send("Not Allowed");
    }
    todo.checked = !todo.checked;
    await todo.save().then((updatedTodo) => {
      console.log(updatedTodo);
    });
    res.json({ todo });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

//Route 4:Delete an existing todo using DELETE "/api/todo/deletetodo".Login required.
router.delete("/deletetodo/:id", fetchUser, async (req, res) => {
  try {
    //Find the todo to be delete and delete it.
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send("Not Found");
    }
    //Allow deletion only if user owns this todo.
    if (todo.user.toString() !== req.user._id) {
      return res.status(401).send("Not Allowed");
    }

    todo = await Todo.findByIdAndDelete(req.params.id);
    res.json({ Success: "Todo has been deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

module.exports = router;
