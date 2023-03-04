// post routerları buraya yazın
const express = require('express');
const Post = require('./posts-model');
const router = express.Router();


//GET
router.get("/", (req, res) => {
    Post.find().then((posts) => {
        res.json(posts)
    }).catch((err) => {
        res.status(500).json({ message: "Gönderiler alınamadı" })
    });
});

router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
    .then((posts) => 
    {
        if (!posts) {
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        } else {
            res.status(200).json(posts);
        }
    })
    .catch((err) => 
    {
        res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    })
});

router.get("/:id/comments", async (req, res) => {
    try {
        let existPost = await Post.findById(req.params.id);
        if (!existPost) {
                res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
            } else {
                let comments = await Post.findPostComments(req.params.id);
                res.status(200).json(comments);
            }
} catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
}
    // Post.findCommentById(req.params.id).then((posts) => {
    //     if (!posts) {
    //         res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    //     }
    // }).catch((err) => {
    //     Post.findPostComments(req.params.post_id).then((comments) => {
    //         if (!comments) {
    //             res.status(500).json({ message: "Girilen ID'li gönderi bulunamadı." });
    //         }
    //     })
    // });
});

//POST
router.post("/", async (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
    }
    else {
        try {
            let {id} = await Post.insert({title,contents});
            let insertedPosts = await Post.findById(id);
            res.status(201).json(insertedPosts);
        } catch (error) {
            res.status(500).json({message:"Veritabanına kaydedilirken bir hata oluştu"})
        }
    }
});

// router.post("/",(req,res) => {
//     const {title, contents} = req.body;
//     if (!title || !contents) {
//         res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
//     }else {
//         Post.insert({title, contents})
//         .then(({id}) => {
//             Post.findById(id).then(findedPost => {
//                 res.status(201).json(findedPost);
//             });
//         }).catch(err=>{
//             res.status(500).json({message:"Veritabanına kaydedilirken bir hata oluştu"});
//         })
//     }
// });


//PUT
router.put('/:id', async (req, res) => {
    let existPost = await Post.findById(req.params.id);
    if(!existPost) {
        res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }else {
        let { title, contents } = req.body;
        if (!title || !contents) {
            res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" });
        }else {
            try {
                let updatedPostId = await Post.update(req.params.id,req.body);
                let updatedPost = await Post.findById(updatedPostId);
                res.status(200).json(updatedPost);
            }catch (err) {
                console.log(err);
            res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
        }
    }   
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        let willBeDeletedPost = await Post.findById(req.params.id);
        if (!willBeDeletedPost) {
            res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
        } else {
            await Post.remove(req.params.id);
            res.status(200).json(willBeDeletedPost);
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi silinemedi" });
    }
});


module.exports = router;