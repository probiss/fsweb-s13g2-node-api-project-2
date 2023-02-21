// post routerları buraya yazın
const express = require('express');
const Posts = require('./posts-model');
const router = express.Router();


//GET
router.get("/", (req, res) => {
    Posts.find().then((posts) => {
        res.json(posts)
    }).catch((err) => {
        res.status(500).json({ message: "Gönderiler alınamadı" })
    });
});

//POST
router.post("/", async (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
    }
    else {
        try {
            let {id} = await Posts.insert({title,contents});
            let insetedPosts = await Posts.findById(id);
            res.status(201).json(insetedPosts);
        } catch (error) {
            res.status(500).json({message:"Veritabanına kaydedilirken bir hata oluştu"})
        }
    }
});

module.exports = router;