const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../middleware/appError");
const joi = require("joi");
const Todo = require("../models/todo.model");

const createTodo = asyncWrapper(async (req, res, next) => {
  const { title, desc } = req.body;

  const schema = joi.object({
    title: joi.string().trim().required(),
    desc: joi.string().trim().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    const err = appError.create(error.message, 400);
    return next(err);
  }

  const todo = await Todo.create({
    title,
    desc,
    auther: req.user.id,
  });
  res.status(201).json({ todo });
});

const updateTodo = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { title, desc } = req.body;

  const schema = joi.object({
    title: joi.string().min(3).max(100),
    desc: joi.string().min(3),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    const err = appError.create(error.message, 400);
    return next(err);
  }

  const oldTodo = await Todo.findById(id);

  if (!oldTodo) {
    const err = appError.create("Todo not found", 404);
    return next(err);
  }
  if (oldTodo.auther.toString() !== req.user.id) {
    const err = appError.create(
      "You are not authorized to update this todo",
      403
    );
    return next(err);
  }

  const todo = await Todo.findByIdAndUpdate(id, { title, desc }, { new: true });
  if (!todo) {
    const err = appError.create("Todo not found", 404);
    return next(err);
  }
  res.status(200).json({ todo });
});
const deleteTodo = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  if (!todo) {
    const err = appError.create("Todo not found", 404);
    return next(err);
  }
  if (todo.auther.toString() !== req.user.id) {
    const err = appError.create(
      "You are not authorized to delete this todo",
      403
    );
    return next(err);
  }

  await Todo.findByIdAndDelete(id);
  res.status(200).json({ message: "Todo deleted successfully" });
});

const getTodos = asyncWrapper(async (req, res, next) => {
  const todos = await Todo.find({ auther: req.user.id });
  res.status(200).json({ todos });
});

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
};
