const http = require('http')

class Router {
    routes = []
    // middlewares = []
    //
    // // constructor() {
    // //     this.next = this.next.bind(this)
    // // }
    //
    // use(url = null, handler) {
    //     this.middlewares.push({
    //         url: url,
    //         handler,
    //     })
    // }

    get(url, ...handlers) {
        this.routes.push({
            url,
            method: 'GET',
            handler: handlers.pop(),
            middlewares: handlers,
        })
    }

    /*
     * @param PORT {number} Port to start listening on, default is 8080
     * @param handler {function} callback function to call once server is successfully started
     */
    Listen(PORT = 8080, handler = null) {
        http.createServer((req, res) => {
            res.json = (json) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(json))
            }

            // function nextFunction(req, res) {
            //     console.log('next func')
            // }
            //
            // function handleAppLevelMiddleware(middleware) {
            //     console.log(middleware)
            //     if (middleware.url == null)
            //         middleware.handler(req, res, nextFunction)
            //     else if (req.url === middleware.url)
            //         middleware.handler(req, res, nextFunction)
            //     else
            //         res.writeHead(404, {
            //             'Content-Type': 'application/json',
            //         }).end(
            //             JSON.stringify({
            //                 message: 'Not found',
            //             })
            //         )
            // }

            // function handleRouteLevelMiddleware(handlerFunction) {
            //     handlerFunction(req, res, nextFunction)
            // }
            //
            // // let filteredMiddlewares = this.middlewares.filter(obj => obj.url === '/')
            //
            // for (let middleware of this.middlewares) {
            //     handleAppLevelMiddleware(middleware)
            // }

            let route = this.routes.find((obj) => {
                return obj.url === req.url && obj.method === req.method
            })
            if (route !== undefined) {
                for (let mid of route.middlewares) mid(req, res)
                route.handler(req, res)
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' }).end(
                    JSON.stringify({
                        message: 'Not found',
                    })
                )
            }
        }).listen(PORT)
        if (handler != null) {
            handler()
        }
    }
}

module.exports = Router
