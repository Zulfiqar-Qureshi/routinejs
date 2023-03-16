const Routine = require('../src/router')
const { Router } = require('../src/router')
const axios = require('axios')
const app = new Routine({
    suppressInitialLog: true,
})
const router = new Router()
const router2 = new Router()

const PORT = 1237
const URL = `http://localhost:${PORT}`

router2.get(`/inside-router2`, (req, res) => {
    res.json('done')
})

router.use(`/inside-router`, router2)

app.use(`/use`, router)

app.listen(PORT)

test('multifile-routing test', async () => {
    expect(
        (await axios.get(`${URL}/use/inside-router/inside-router2`)).data
    ).toBe('done')
})
