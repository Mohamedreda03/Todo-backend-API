const express = require("express");
const {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} = require("../controllers/todo.controller");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, createTodo);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);
router.get("/", verifyToken, getTodos);

module.exports = router;
