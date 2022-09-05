const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const { setupDB } = require('../test-setup')
setupDB()

describe("user", () => {

    it("Creates a user when all required parameters are sent correctly", async() => {
        const response = await request.post("/users").send({name: 'User name'})

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully.');
    })

    it("returns a 400 error when name param is not sent", async() => {
        const response = await request.post("/users").send()
        expect(response.status).toBe(400);
    })
    
})