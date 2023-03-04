// implement your server here
// require your posts router and connect it here

const express = require('express');
const Post = require('./posts/posts-model');

const server = express();
server.use(express.json());

const postRoutes = require('./posts/posts-router');

server.use('/api/posts', postRoutes);

module.exports = server;