// implement your server here
// require your posts router and connect it here

const express = require('express');
const Posts = require('./posts/posts-model');

const server = express();
server.use(express.json());

const postRoutes = require('./posts/posts-router');

server.use('/api/posts', postRoutes);

//GET
server.get("/api/posts/:id", (req, res) => {
    Posts.findById(req.params.id).then((posts) => {
        if (!posts) {
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        } else {
            res.status(200).json(posts);
        }
    }).catch((err) => {
        res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    })
});

server.get("/api/posts/:id/comments", (req, res) => {
    Posts.findCommentById(req.params.id).then((posts) => {
        if (!posts) {
            res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
        }
    }).catch((err) => {
        Posts.findPostComments(req.params.post_id).then((comments) => {
            if (!comments) {
                res.status(500).json({ message: "Girilen ID'li gönderi bulunamadı." });
            }
        })
    });
});
//PUT
server.put("/api/posts/:id", async (req, res) => {
    try {
        let willBeUpdatedPost = await Posts.findById(req.params.id);
        if (!willBeUpdatedPost) {
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        } else {
            if (!req.body.title || !req.body.contents) {
                res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" });
            } else {
                let updatedPosts = await Posts.update(req.params.id, req.body);

                res.status(200).json(updatedPosts);
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
    }
});

//DELETE
server.delete("/api/posts/:id", async (req, res) => {
    try {
        let willBeDeletedPost = await Posts.findById(req.params.id);
        if (!willBeDeletedPost) {
            res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
        } else {
            await Posts.remove(req.params.id);
            res.status(200).json(willBeDeletedPost);
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi silinemedi" });
    }
});

module.exports = server;