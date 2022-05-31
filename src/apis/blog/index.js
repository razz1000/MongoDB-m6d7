import express from "express";
import createError from "http-errors";
import blogPostModel from "./model.js";

const blogPostRouter = express.Router();

blogPostRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new blogPostModel(req.body);
    const { _id } = await newBlogPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await blogPostModel.find();
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/:blogpostId", async (req, res, next) => {
  try {
    const blogpost = await blogPostModel.findById(req.params.blogpostId);

    if (blogpost) {
      res.send(blogpost);
    } else {
      next(
        createError(404, `BlogPost with id ${req.params.blogpostId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.put("/:blogpostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await blogPostModel.findByIdAndUpdate(
      req.params.blogpostId, // WHO
      req.body, // HOW
      { new: true, runValidators: true }
    );

    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(
        createError(404, `Blogpost with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.delete("/:blogpostId", async (req, res, next) => {
  try {
    const deletedUser = await blogPostModel.findByIdAndDelete(
      req.params.blogpostId
    );
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(
        createError(404, `Blogpost with id ${req.params.blogpostId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostRouter;
