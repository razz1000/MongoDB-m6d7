import express from "express";
import createError from "http-errors";
import LikesModel from "./model.js";

const likesRouter = express.Router();

likesRouter.post("/", async (req, res, next) => {
  try {
    const newLike = new LikesModel(req.body);
    const { _id } = await newLike.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

likesRouter.get("/", async (req, res, next) => {
  try {
    const like = await LikesModel.find();
    res.send(like);
  } catch (error) {
    next(error);
  }
});

likesRouter.get("/:likeId", async (req, res, next) => {
  try {
    const like = await LikesModel.findById(req.params.likeId);
    if (like) {
      res.send(like);
    } else {
      next(createError(404, `Like with id ${req.params.likeId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

likesRouter.put("/:likeId", async (req, res, next) => {
  try {
    const updatedLike = await LikesModel.findByIdAndUpdate(
      req.params.likeId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedLike) {
      res.send(updatedLike);
    } else {
      next(createError(404, `Like with id ${req.params.likeId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

likesRouter.delete("/:likeId", async (req, res, next) => {
  try {
    const deletedLike = await LikesModel.findByIdAndDelete(req.params.likeId);
    if (deletedLike) {
      res.status(204).send();
    } else {
      next(createError(404, `Like with id ${req.params.likeId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default likesRouter;
