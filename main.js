const Router = require('./router')
const app = new Router()

function mid(req, res, next) {
    let bool = {
        message: 'data from mid middleware function',
        isPresent: false,
    }
    next(bool)
}

function mid2(req, res, next) {
    if (req.nextData.isPresent) {
        req.nextData.anotherField = 'Created dynamically inside mid2'
        res.json(req.nextData)
    } else {
        next()
    }
}
app.get('/new', (req, res) => {
    res.json({
        message: 'worked again on json method :D',
    })
})

app.patch('/new', (req, res) => {
    res.status(200).json(req.body)
})

app.get(`/`, mid, mid2, (req, res) => {
    res.json({
        message: 'index on json method',
        nextData: req.nextData,
    })
})

app.Listen(8080, () => console.log(`Server started on port 8080`))
