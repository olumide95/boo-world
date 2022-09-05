const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

describe("profile", () => {

    it("returns a 404 error when profile with id does not exist", async() => {
        const response  = await request.get(`/profiles/1`)
       
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No profile with id (1) found');
    })
    
})