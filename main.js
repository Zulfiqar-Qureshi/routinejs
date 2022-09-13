const Router = require('./lib/router')
const app = new Router()

function mid(req, res, next) {
    let obj = {
        message: 'data from mid middleware function',
        isPresent: false,
    }
    // next(obj)
    // res.json(obj)
    req.local = 'worked'
    next(obj)
}

function mid2(req, res, next, cancel) {
    if (req.nextData.isPresent) {
        req.nextData.anotherField = 'Created dynamically inside mid2'
        next()
    } else {
        cancel((req) => {
            console.log(req.path)
            res.json('worked')
        })
    }
}

app.get('/new', (req, res) => {
    res.json({
        message: 'worked again on json method :D',
    })
})

app.post('/new', mid, (req, res) => {
    res.status(200).json({
        body: req.body,
    })
})

app.get(`/`, mid, mid2, (req, res) => {
    try {
        res.json({
            message: 'index on json method',
            nextData: req.nextData,
        })
    } catch (e) {
        res.json(e)
    }
})

app.Listen(8080, () => console.log(`Server started on port 8080`))
