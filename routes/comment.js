'use strict';

const express = require('express');
const router = express.Router();
const { body, validationResult} = require('express-validator');
const { User, Profile, Comment,  CommentLike, } = require("../models.js")

module.exports = app => {

    router.get('/sortRecent/',
        body('filter')
        .optional().isIn(["All", "MBTI", "Zodiac", "Enneagram"])
        .withMessage("Filter should either be All, MBTI, Zodiac, Enneagram"),
        async function(req, res, next) {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            const option = req.body.filter
            let filter = (option != "All" && option != null) ? {
                ['votes.' + option]: {
                    '$exists': true
                }
            } : {}

            const comments = await Comment.find(filter).sort({ created: -1})

            if (comments.length > 0){
                return res.json({
                    message: "Comments sorted by most recent",
                    status: true,
                    comments
                })
            }

            return res.status(404).json({
                message: "No comment found",
                status: false,
            });
        })

    router.get('/sortBest/',
        body('filter')
        .optional().isIn(["All", "MBTI", "Zodiac", "Enneagram"])
        .withMessage("Filter should either be All, MBTI, Zodiac, Enneagram"),
        async function(req, res, next) {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            const option = req.body.filter

            let filter = (option != "All" && option != null) ? {
                ['votes.' + option]: {
                    '$exists': true
                }
            } : {}

           
            const comments = await Comment.find(filter).sort({ likes: -1 })

            if (comments.length > 0){
                return res.json({
                    message: "Comments sorted by most liked",
                    status: true,
                    comments
                })
            }
            
            return res.status(404).json({
                message: "No comment found",
                status: false,
            });
    })


    router.post('/comment_like/:id',
        body('name', 'User Name is required').exists(),

        async function(req, res, next) {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            const commentId = req.params.id
            const name = req.body.name

            let user = await User.findOne({ name });

            if (!user) {
                return res.status(422).json({
                    message: `This User doesn't exist`,
                    status: false
                })
            }

            let comment = await Comment.findOne({
                _id: commentId
            })

            if (!comment) {
                return res.status(422).json({
                    message: `This comment doesn't exist`,
                    status: false
                })
            }

            let commentLike = await CommentLike.findOne({
                name,
                commentId
            })

            if (commentLike) {
                return res.json({
                    message: `This comment has already been liked`,
                    status: false
                })
            }

            new CommentLike({
                name,
                commentId
            }).save()

            await Comment.updateOne({ _id: commentId }, { $inc: { likes: 1 } })

            return res.status(201).json({
                message: `You have successfully liked this comment`,
                status: true
            })
        });

    router.post('/comment_unlike/:id',
        body('name', 'user Name is required').exists(),
        async function(req, res, next) {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            const commentId = req.params.id
            const name = req.body.name

            let user = await User.findOne({ name });

            if (!user) {
                return res.status(422).json({
                    message: `This User doesn't exist`,
                    status: false
                })
            }

            const likedComment = CommentLike.deleteOne({ name, commentId  })

            if (likedComment.deletedCount > 0) {
                await Comment.updateOne({ _id: commentId  }, {  $inc: { likes: -1  } })

                return res.json({
                    message: `You have successfully unliked this comment`,
                    status: true
                })

            }
            
            return res.status(422).json({
                message: `Cannot unlike comment!`,
                status: false
            })
    });

    router.post('/',
        body('profileId', 'Profile Id is required').exists(),
        body('username', 'User name is required').exists(),
        body('title', 'Title is required').exists(),
        body('comment', 'Comment is required').exists(),
        body('votes').optional(),

        async function(req, res, next) {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            const { username, profileId, title, comment, votes } = req.body

            const user = await User.findOne({ name: username });

            if (!user) {
                return res.status(422).json({
                    message: `This User doesn't exist`,
                    status: false
                })
            }

            const userId = user._id

            const profile = await Profile.findOne({ _id: profileId });

            if (!profile) {
                return res.status(422).json({
                    message: `This Profile doesn't exist`,
                    status: false
                })
            }

            new Comment({ profileId, userId, title, comment, votes }).save()

            res.status(201).json({
                message: "Your comment has been successfully posted",
                status: true
            })
    });

    router.get('/', async function(req, res, next) {
       const comments = await Comment.find();

       if (comments.length > 0){
            return res.json({
                status: true,
                comments
            })
        }

        return res.status(404).json({
            message: "No comment found",
            status: false,
        });
        
    })

    return router;
}