const http = require('http')
const url = require('url')
const executeRouteHandlers = require('./helper/route_handler')
const bodyParser = require('./helper/body_parser')

class Router {
    routes = []

    //Method to push route data into the routes array,
    //since the behaviour is only different in case of methodString
    //i.e. GET, POST etc. we abstracted this push behaviour into a
    //separate method, hence called routePush
    routePush(methodString, url, ...handlers) {
        this.routes.push({
            url,
            method: methodString,
            handler: handlers.pop(),
            middlewares: handlers,
        })
    }

    get(url, ...handlers) {
        this.routePush('GET', url, ...handlers)
    }

    post(url, ...handlers) {
        this.routePush('POST', url, ...handlers)
    }

    put(url, ...handlers) {
        this.routePush('PUT', url, ...handlers)
    }

    patch(url, ...handlers) {
        this.routePush('PATCH', url, ...handlers)
    }

    delete(url, ...handlers) {
        this.routePush('DELETE', url, ...handlers)
    }

    /*
     * @param PORT {number} Port to start listening on, default is 8080
     * @param handler {function} callback function to call once server is successfully started
     */
    Listen(PORT = 8080, handler = null) {
        let server = http.createServer(async (req, res) => {
            //Custom method allowing easy json transmission as ExpressJS does
            res.json = (json) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(json))
                return 0
            }
            res.status = (statusCode = 200) => {
                res.statusCode = statusCode
                return res
            }

            //Parsing request url and the 'true' is for allowing the parser to also parse
            // any query strings if present
            let parsedUrl = url.parse(req.url, true)

            //attaching incoming query strings to request.query object
            req.query = parsedUrl.query

            //If pathname is just "/" then we do not want to remove that slash, because that
            //means that the request is coming from the main domain
            //but if the pathname is something like '/xyz/' then we would remove that trailing
            //slash, and that would give us '/xyz'
            req.path =
                parsedUrl.pathname === '/'
                    ? parsedUrl.pathname
                    : parsedUrl.pathname.replace(/(\/)+$/g, '')

            //Checking to see that the incoming requests matches any route in our code
            let route = this.routes.find((obj) => {
                return obj.url === req.path && obj.method === req.method
            })

            //If match is found (means the above route var is not undefined),
            //then we proceed with the request, otherwise we sent a 404 Not found
            //message in the else block
            if (route !== undefined) {
                //Since these below methods allow a payload inside request body,
                // we need to parse it and attach it to the req.body object
                if (['PUT', 'PATCH', 'POST'].indexOf(req.method) !== -1) {
                    if (
                        req.headers['content-type'].split(';')[0] ===
                        'multipart/form-data'
                    ) {
                        res.status(500).json({
                            message:
                                'Multipart data is not currently supported within routine',
                        })
                    }

                    req.body = await bodyParser(req)

                    await executeRouteHandlers(route, req, res)
                    //This else block means if request is of type GET where body
                    //should not be present or should not be parsed
                } else {
                    await executeRouteHandlers(route, req, res)
                }
            } else {
                res.json(404, {
                    message: 'Route not found',
                })
            }
        })
        server.listen(PORT)
        //Callback handler for our custom listen function so that user could log
        //something or run something once this router server is started on provided
        //port
        if (handler != null) {
            handler()
        }

        return server
    }
}

module.exports = Router
