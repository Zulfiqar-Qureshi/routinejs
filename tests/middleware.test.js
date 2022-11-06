const Routine = require('../src/router')
const axios = require('axios')
const app = new Routine({
    suppressInitialLog: true
})

const PORT = 1236
const URL = `http://localhost:${PORT}`

app.use((req, res, next) => {
    console.log("global middleware function")
    next()
})

function middleware(req, res, next){
    console.log("local middleware function")
    next()
}

app.get(`/middleware-test`,middleware, (req, res) => {
    res.json("done")
})

app.listen(PORT)

test("middleware test", async () => {
    expect(
        (await axios.get(`${URL}/middleware-test`)).data
    ).toBe("done")
})