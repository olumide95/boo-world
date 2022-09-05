const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    name: String,
    image: String,
    mbti: String,
    enneagram: String,
    description: String,
    variant: String,
    tritype: Number,
    socionics: String,
    sloan: String,
    psyche: String,
    created: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
    name: String,
    created: { type: Date, default: Date.now }
});

const CommentSchema = new Schema({
    title: String,
    comment: String,
    votes: Array,
    profileId: mongoose.Types.ObjectId,
    username: mongoose.Types.ObjectId,
    likes: { type: Number, default: 0 },
    created: { type: Date, default: Date.now }
});

const CommentLikeSchema = new Schema({
    name: String,
    commentId: mongoose.Types.ObjectId,
});

const User = mongoose.model("users", UserSchema)
const Profile = mongoose.model("profiles", ProfileSchema)
const Comment = mongoose.model("comments", CommentSchema);
const CommentLike = mongoose.model("comment_likes", CommentLikeSchema);

module.exports = { User, Profile, Comment, CommentLike };