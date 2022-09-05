const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

describe("profile", () => {

    it("returns a 404 error when profile with id does not exist", async() => {
        const response  = await request.get(`/profiles/1`)
       
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No profile with id (1) found');
    })

    it("Create a profile when all required parameters are sent correctly", async() => {
        const response = await request.post("/profiles").send({"name": "A Martinez", "description": "Adolph Larrue Martinez III.", "mbti": "ISFJ", "enneagram": "9w3", "variant": "sp/so", "tritype": 725, "socionics": "SEE", "sloan": "RCOEN", "psyche": "FEVL"})

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Profile created successfully.');
    })

    it("returns a 400 error when name param is not sent", async() => {
        const response = await request.post("/profiles").send({title: 'Title', comment : 'comment'})
        expect(response.status).toBe(400);
    })

    it("returns a 400 error when title param is not sent", async() => {
        const response = await request.post("/profiles").send({name: 'John', comment : 'comment'})
        expect(response.status).toBe(400);
    })

    it("returns a 400 error when comment param is not sent", async() => {
        const response = await request.post("/profiles").send({name: 'John', title : 'Title'})
        expect(response.status).toBe(400);
    })
    
})