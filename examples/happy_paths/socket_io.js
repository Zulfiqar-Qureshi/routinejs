const Routine = require('routinejs')
const {Server} = require("socket.io");
const cors = require('cors')
const app = new Routine({
    enableBodyParsing: true,
    catchErrors: true,
    errorHandler: (error, req, res) => {
        res.json({
            message: error.stack
        })
    }
})

app.use(cors())
const morgan = require('morgan')

app.use(morgan('[LOG 🌈] :method :url :status :res[content-length] - :response-time ms'))


const server = app.listen(8080)
let io = new Server(server, {
    cors: {
        origin: "https://amritb.github.io",
        methods: ["GET", "POST"]
    }
})
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('hello', (data) => {
        console.log(data)
        socket.emit('chat', data)
        io.emit('chat', data)
    })
});

