const Routine = require('../src/router')
const axios = require('axios')
const app = new Routine({
    suppressInitialLog: true,
})

const PORT = 1235
const URL = `http://localhost:${PORT}`

app.post(`/bodyparse`, (req, res) => {
    res.json(req.body.name)
})

app.listen(PORT)

test('post request body parsing', async () => {
    expect(
        (
            await axios.post(`${URL}/bodyparse`, {
                name: 'zulfiqar',
            })
        ).data
    ).toBe('zulfiqar')
})
