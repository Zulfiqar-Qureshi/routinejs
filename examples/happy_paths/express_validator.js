const Routine = require('routinejs')
const cors = require('cors')
const {body, validationResult} = require('express-validator');
const app = new Routine({
    enableBodyParsing: true,
    catchErrors: true,
    errorHandler: (error, req, res) => {
        res.json({
            message: error.stack
        })
    }
})
const route = require('./router')

app.use(cors())
const morgan = require('morgan')

app.use(morgan('[LOG 🌈] :method :url :status :res[content-length] - :response-time ms'))

app.use('/testing', route)


app.post('/user',
    body('username').isEmail(),
    body('password').isLength({min: 5}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
    })
app.listen(8080)