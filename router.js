const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

class Router {
    routes = []

    //Method to push route data into the routes array,
    //since the behaviour is only different incase of methodString
    //i.e GET, POST etc, we abstracted this push behaviour into a
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
        http.createServer(async (req, res) => {
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
                    const decoder = new StringDecoder('utf-8')
                    let buffer = ''

                    //Every body comes as a nodejs data stream, we need to read
                    //that stream as it comes, decode it and attach it to a buffer
                    req.on('data', (data) => {
                        buffer += decoder.write(data)
                    })

                    //Once request ends, we JSON.parse the buffer and attach it to
                    // the req.body object and proceed with the handler functions
                    req.on('end', () => {
                        buffer += decoder.end()
                        req.body = JSON.parse(buffer)

                        //This for loop is running middleware functions
                        for (let mid of route.middlewares) mid(req, res)

                        //Here we are running the main last handler of
                        //the matched route
                        route.handler(req, res)
                    })
                    //This else block means if request is of type GET where body
                    //should not be present or should not be parsed
                } else {
                    /*
                     * Lots of things are happening here, so let's break them down one by one
                     * Firstly, we are utilizing a promise so that it waits until the inner loop is completed
                     * Secondly, another promise inside the loop to wait for each function execution to
                     *  - complete before moving to next iteration
                     * Lastly, we have two functions
                     *   - midWrapper and inside it is a next() middleware caller function
                     *   - midWrapper and next both work on the resolve function of the two
                     *   - promises, cleverly, we get a middleware execution pattern
                     * */
                    await new Promise(async (resolve, reject) => {
                        for (let mid of route.middlewares) {
                            await new Promise((resolveInner, rejectInner) => {
                                midWrapper(
                                    mid,
                                    req,
                                    res,
                                    resolveInner,
                                    rejectInner
                                )
                            })
                        }
                        resolve('done')
                    })

                    function midWrapper(mid, req, res, resolve, reject) {
                        function next(optionalData = null) {
                            if (optionalData != null) {
                                req.nextData = optionalData
                            }
                            resolve('middleware done')
                        }

                        mid(req, res, next)
                    }

                    //Here we are running the main last handler of
                    //the matched route
                    route.handler(req, res)
                }
            } else {
                res.json(404, {
                    message: 'Not found',
                })
            }
        }).listen(PORT)
        //Callback handler for our custom listen function so that user could log
        //something or run something once this router server is started on provided
        //port
        if (handler != null) {
            handler()
        }
    }
}

module.exports = Router
