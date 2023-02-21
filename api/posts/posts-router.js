// post routerları buraya yazın
const express = require('express');
const Posts = require('./posts-model');
const router = express.Router();


//GET
router.get("/",(req,res) => {
    Posts.find().then((posts) => {
        res.status(201).json(posts)
    }).catch((err) =>{
        res.status(500).json({message:"Gönderiler alınamadı"})
    });
});

//POST
router.post("/",(req,res) => {
    let post1 = req.body;
    if(!post1.title || !post1.contents) {
        res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" })
    }else {
        Posts.insert(post1).then((posts)=>{
            res.status(201).json(posts);
        }) .catch((err)=>{
            res.status(500).json({message:"Veritabanına kaydedilirken bir hata oluştu"})
        });
    }
});

module.exports = router;