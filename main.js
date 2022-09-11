const Router = require('./router')
const Trie = require('./trie')

const trie = new Trie()

trie.add('foo', 'bar')

const app = new Router()

app.get('/hello', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
        JSON.stringify({
            message: trie.get('foo'),
        })
    )
})

function mid(req, res) {
    console.log('mid')
}

function mid2(req, res, next) {
    console.log('mid 2')
    next()
}

app.get('/new', (req, res) => {
    res.json({
        message: 'worked again on json method :D',
    })
})

app.post('/new', (req, res) => {
    res.status(404).json(req.body)
})

app.get(`/`, (req, res) => {
    res.json({
        message: 'index on json method',
    })
})

app.Listen(8080, () => console.log(`Server started on port 8080`))
