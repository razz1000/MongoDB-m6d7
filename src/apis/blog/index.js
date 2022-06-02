import express from "express";
import createError from "http-errors";
import blogPostModel from "./model.js";
import commentModel from "../comment/model.js";
import likeModel from "../likes/model.js";
import q2m from "query-to-mongo";

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
    console.log("QUERY: ", req.query);
    console.log("MONGO-QUERY: ", q2m(req.query));
    const mongoQuery = q2m(req.query);
    const total = await blogPostModel.countDocuments(mongoQuery.criteria);
    const blogPosts = await blogPostModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit)
      .sort(mongoQuery.options.sort)
      .populate({ path: "authors", select: "firstName lastName" });
    res.send({
      links: mongoQuery.links("http://localhost:3001/blogposts", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      blogPosts,
    });
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/:blogpostId", async (req, res, next) => {
  try {
    const blogpost = await blogPostModel
      .findById(req.params.blogpostId)
      .populate({ path: "authors", select: "firstName lastName" });

    /*     const likes = await blogPostModel.findOne(req.body.likes); */
    const likes2 = blogpost.likes.length;

    console.log("BLOGPOST LIKES:", likes2);

    /* const numberOfLikes = [];
     
    likes2.forEach((like, index) => {
      if (like.indexOf(like) === index) {
        uniqueCount += 1;
        numberOfLikes.push(uniqueCount);
      }
    }); 
    console.log("COUNT:", uniqueCount); */

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
      req.params.blogpostId,
      req.body,
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

blogPostRouter.post("/:blogpostId", async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req.body.commentId, { _id: 0 });
    const likes2 = blogpost.likes.length;
    console.log("COMMENT", comment);
    if (comment) {
      const commentToInsert = {
        ...comment.toObject(),
        commentDate: new Date(),
      };

      console.log("COMMENT TO INSERT", commentToInsert);
      const updatedblogPost = await blogPostModel.findByIdAndUpdate(
        req.params.blogpostId,
        { $push: { comments: commentToInsert /*  blogpostLikes: likes2 */ } },
        { new: true, runValidators: true }
      );
      console.log("UPDATED BLOG POST", updatedblogPost);
      if (updatedblogPost) {
        res.send(updatedblogPost);
      } else {
        next(
          createError(
            404,
            `blogPost with id ${req.params.blogpostId} not found!`
          )
        );
      }
    } else {
      next(
        createError(404, `Comment with id ${req.body.commentId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/:blogpostId/comments", async (req, res, next) => {
  try {
    const blogPost = await blogPostModel.findById(req.params.blogpostId);
    if (blogPost) {
      res.send(blogPost.comments);
    } else {
      next(
        createError(404, `blogPost with id ${req.params.blogpostId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get(
  "/:blogpostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPost = await blogPostModel.findById(req.params.blogpostId);

      if (blogPost) {
        const blogpostComment = blogPost.comments.find(
          (c) => req.params.commentId === c._id.toString()
        );
        if (blogpostComment) {
          res.send(blogpostComment);
        } else {
          next(
            createError(
              404,
              `Comment with id ${req.params.commentId} not found!`
            )
          );
        }
      } else {
        next(
          createError(
            404,
            `BlogPost with id ${req.params.blogpostId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostRouter.put(
  "/:blogpostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPost = await blogPostModel.findById(req.params.blogpostId);

      if (blogPost) {
        const index = blogPost.comments.findIndex(
          (c) => c._id.toString() === req.params.commentId
        );

        if (index !== -1) {
          //- Update blogpost
          blogPost.comments[index] = {
            ...blogPost.comments[index].toObject(),
            ...req.body,
          };

          await blogPost.save();
          res.send(blogPost);
        } else {
          next(
            createError(
              404,
              `Comment with id ${req.params.commentId} not found!`
            )
          );
        }
      } else {
        next(
          createError(
            404,
            `BlogPost with id ${req.params.blogpostId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostRouter.delete(
  "/:blogpostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const updatedBlogpost = await blogPostModel.findByIdAndUpdate(
        req.params.blogpostId,
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true }
      );

      if (updatedBlogpost) {
        res.send(updatedBlogpost);
      } else {
        next(
          createError(
            404,
            `Blogpost with id ${req.params.blogpostId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostRouter;
