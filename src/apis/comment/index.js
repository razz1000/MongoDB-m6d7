import express from "express";
import createError from "http-errors";

import commentModel from "./model.js";

const commentRouter = express.Router();

commentRouter.post("/", async (req, res, next) => {
  try {
    const newComment = new commentModel(req.body);
    const { _id } = await newComment.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/", async (req, res, next) => {
  try {
    const comments = await commentModel.find();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/:commentId", async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);

    if (comment) {
      res.send(comment);
    } else {
      next(
        createError(404, `Comment with id ${req.params.commentId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

commentRouter.put("/:commentId", async (req, res, next) => {
  try {
    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId, // WHO
      req.body, // HOW
      { new: true, runValidators: true }
    );

    if (updatedComment) {
      res.send(updatedComment);
    } else {
      next(
        createError(404, `Comment with id ${req.params.commentId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

commentRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const deletedComment = await commentModel.findByIdAndDelete(
      req.params.commentId
    );
    if (deletedComment) {
      res.status(204).send();
    } else {
      next(
        createError(404, `Comment with id ${req.params.commentId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default commentRouter;
