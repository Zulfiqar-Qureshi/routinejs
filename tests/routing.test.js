const Routine = require('../src/router')
const axios = require('axios')
const app = new Routine({
    suppressInitialLog: true,
})

const PORT = 1234
const URL = `http://localhost:${PORT}`

app.get(`/`, (req, res) => res.json('get route working'))
app.get('/query', (req, res) => res.json(req.query.name))
app.get('/param/:randomVal', (req, res) => res.json(req.params.randomVal))

app.listen(PORT)

test('get request working', async () => {
    expect((await axios.get(`${URL}/`)).data).toBe('get route working')
})

test('path params test', async () => {
    expect((await axios.get(`${URL}/param/zulfiqar`)).data).toBe('zulfiqar')
})

test('query params test', async () => {
    expect(
        (await axios.get(`${URL}/query`, { params: { name: 'zulfiqar' } })).data
    ).toEqual('zulfiqar')
})
