const express = require('express');
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
    res.send({
      tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    try {
        const postsByTagName = await getPostsByTagName(tagName);
        const filteredPosts = postsByTagName.filter(postByTagName => {
            return postByTagName.active || (req.user && postByTagName.author.id === req.user.id);
        });
        res.send({posts: filteredPosts});
    } catch ({ name, message }) {
        next({name, message});
    }
  });

module.exports = tagsRouter;