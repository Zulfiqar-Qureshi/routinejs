const trieRouter = require('find-my-way')({
    defaultRoute: (req, res) => {
        res.statusCode = 404
        res.end()
    }
})

module.exports = trieRouter