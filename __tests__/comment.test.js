const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const { User, Profile, Comment } = require("../models.js")
const { setupDB } = require('../test-setup')
setupDB()

const createUser = () => {
    return (new User({"name": "John"}).save())
}

const createProfile = async () => {
    return await (new Profile({"name": "A Martinez", "description": "Adolph Larrue Martinez III.", "mbti": "ISFJ", "enneagram": "9w3", "variant": "sp/so", "tritype": 725, "socionics": "SEE", "sloan": "RCOEN", "psyche": "FEVL"}).save())
}

const createComment = async (likes = 0) => {
    const userId = createUser()._id
    const profileId = await createProfile()._id
    const comment = 'comment'
    const title = (Math.random() + 1).toString(36).substring(7)
    votes = [{'MBTI' : 'sw1'}];

    return await (new Comment({ profileId, userId, title, comment, votes, likes }).save())
}

describe("comment", () => {

    it("can create comment with vote", async() => {
        createUser()
        const profile = await createProfile()
        const response = await request.post("/comments").send({ "username" : "John", "profileId" : profile._id, "title" : "Title", "comment" : "my comment", "votes" : [{"MBTI": "sw1"}]})

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Your comment has been successfully posted');
    })

    it("returns a 4094 error when no comment is found", async() => {
        const response = await request.get("/comments")

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No comment found');
    })

    it("can list comments", async() => {
        const comment =  await createComment()
        const response = await request.get("/comments")

        expect(response.status).toBe(200);
        expect(response.body.comments[0].title).toEqual(comment.title)
    })

    it("can list comments and sort by most recent", async() => {
        const comment1 =  await createComment()
        const comment2 =  await createComment()

        const response = await request.get("/comments/sortRecent")

        expect(response.status).toBe(200);
        expect(response.body.comments[0].title).toEqual(comment2.title)
        expect(response.body.comments[1].title).toEqual(comment1.title)
    })

    it("can list comments and sort by best (most liked)", async() => {
        const comment1 =  await createComment(1)
        const comment2 =  await createComment(2)

        const response = await request.get("/comments/sortBest")

        expect(response.status).toBe(200);
        expect(response.body.comments[0].title).toEqual(comment2.title)
        expect(response.body.comments[1].title).toEqual(comment1.title)
    })

    it("can like comments", async() => {
        const comment =  await createComment(1)
        const name = 'John'

        const response = await request.post(`/comments/comment_like/${comment._id}`).send({name})

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('You have successfully liked this comment');
    })

})