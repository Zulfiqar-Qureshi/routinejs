const Routine = require('routinejs')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = new Routine({
    enableBodyParsing: true,
    catchErrors: true,
    errorHandler: (error, req, res) => {
        res.json({
            message: error.stack
        })
    }
})
app.use(cookieParser())

app.use(cors())
const morgan = require('morgan')

app.use(morgan('[LOG 🌈] :method :url :status :res[content-length] - :response-time ms'))

app.get('/user',
    (req, res) => {
        console.log('Cookies: ', req.cookies)
        //This will not cause the server to fail
        // res.setHeader(
        //     "Set-Cookie", `mycookie=test`
        // );

        //This will cause the server to fail
        res.writeHead(200, {
            "Set-Cookie": `mycookie=test`
        })
        // res.json("done")
        res.status(404).json("not found")
    })

app.listen(8080)

