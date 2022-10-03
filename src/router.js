//ts-check
/**
 * @file router.js is the root file for this framework
 * @author Zulfiqar Ali Qureshi
 * @see <a href="https://author.juniordev.net">My Resume</a>
 */
const http = require('http')
const url = require('url')
const safeStringify = require('fast-safe-stringify')
const { match } = require('path-to-regexp')
const executeRouteHandlers = require('./helper/route_handler')
const executeMiddlewareHandler = require('./helper/middleware_handler')
const bodyParser = require('./helper/body_parser')
const clc = require('cli-color')
const { EventEmitter } = require('node:events')
const emitter = new EventEmitter()
const ascii = require('./ascii.json')
const packageJson = require('../package.json')

/**
 * Function to find a matching route from the array of routes within the framework
 * @param {Object} req - Request Object
 * @param {Array<Object>} routes - Routes array to be searched in
 * @returns {Object | Undefined} - Returns possible route object if matched, otherwise undefined
 * */
function findMatchingRoute(req, routes) {
    return routes.find((obj) => {
        let fn = match(obj.url, { decode: decodeURIComponent })
        let tokens = fn(req.path)
        if (tokens !== false && obj.method === req.method) {
            req.params = tokens.params
        }
        return !!tokens
    })
}

/**
 * A main route object
 * @typedef {Object} Route
 * @property {string} url - path of the route, such as '/xyz' or '/xyz/abc'
 * @property {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'} method - Http method of the route
 * @property {Function} handler - main handler function for the route
 * @property {Function | Undefined} middlewares - any possible middleware functions given prior to handler func
 * */

function Router() {
    /**
     * @param {Array<Route>} routes - routes array where individual route objects are pushed upon code traversal
     * */
    let routes = []
    //Method to push route data into the routes array,
    //since the behaviour is only different in case of methodString
    //i.e. GET, POST etc. we abstracted this push behaviour into a
    //separate method, hence called routePush
    /**
     * Method to push route data into the routes array
     * @param {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'} methodString - http method for the route
     * @param {string} url - Path of the route
     * @param {Array<Function>} handlers - Array of handler functions, from which the last one is
     * main route handler while other functions before it are treated as middleware functions
     * @returns {void}
     * */
    function routePush(methodString, url, ...handlers) {
        routes.push({
            url,
            method: methodString,
            handler: handlers.pop(),
            middlewares: handlers,
        })
    }

    return {
        get: (url, ...handlers) => {
            routePush('GET', url, ...handlers)
        },

        post: (url, ...handlers) => {
            routePush('POST', url, ...handlers)
        },

        put: (url, ...handlers) => {
            routePush('PUT', url, ...handlers)
        },

        patch: (url, ...handlers) => {
            routePush('PATCH', url, ...handlers)
        },

        delete: (url, ...handlers) => {
            routePush('DELETE', url, ...handlers)
        },

        routes,
    }
}

/**
 * Entry point to our framework, everything starts by creating an object of this class
 * */
class Routine {

    /**
     * @private array
     * */
    routes = []

    /**
     * @private array
     * */
    middlewares = []

    /**
     * @private object
     * */
    conf = {
        allowMultipart: false,
        catchErrors: true,
        enableBodyParsing: true,
        errorHandler: function (error, ...restargs) {
            console.error(
                clc.red.underline(`ERROR CAUGHT-->`),
                clc.yellow(error.toString().split(':')[1])
            )
            restargs[restargs.length - 1].end()
        },
    }

    /**
     * @constructor
     * @param boolean allowMultipart
     * */
    constructor(conf) {
        if (
            conf?.allowMultipart != undefined &&
            typeof conf.allowMultipart === 'boolean'
        ) {
            this.conf.allowMultipart = conf?.allowMultipart
        }
        if (
            conf?.enableBodyParsing != undefined &&
            typeof conf.enableBodyParsing === 'boolean'
        ) {
            this.conf.enableBodyParsing = conf?.enableBodyParsing
        }
        if (
            conf?.catchErrors != undefined &&
            typeof conf.catchErrors === 'boolean'
        ) {
            this.conf.catchUnhandledErrors = conf?.catchUnhandledErrors
        }
        if (conf?.errorHandler && typeof conf.errorHandler === 'function') {
            this.conf.errorHandler = conf?.errorHandler
        } else if (
            conf?.errorHandler &&
            typeof conf.errorHandler !== 'function'
        ) {
            console.error(
                clc.red.underline(`ERROR -->`),
                clc.greenBright.underline(`function`),
                clc.yellow(`expected as error handler got`),
                clc.red.underline(`${typeof conf.errorHandler}`)
            )
            process.exit(-1)
        }
    }

    use(...args) {
        if (args.length === 1)
            this.middlewares.push({
                url: null,
                handler: args[0],
            })
        else if (typeof args[1] === 'object')
            for (let obj of args[1].routes) {
                this.routes.push({
                    url: `${args[0]}${obj.url}`,
                    method: obj.method,
                    handler: obj.handler,
                    middlewares: obj.middlewares,
                })
            }
        else
            this.middlewares.push({
                url: args[0],
                handler: args[1],
            })
    }

    //Method to push route data into the routes array,
    //since the behaviour is only different in case of methodString
    //i.e. GET, POST etc. we abstracted this push behaviour into a
    //separate method, hence called routePush
    /**
     * @private method
     * */
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
    listen(
        PORT = 8080,
        handler = (port) =>
            console.log(`ROUTINE SERVER STARTED ON PORT: ${port}`)
    ) {
        console.log(clc.green(ascii.art[3]))
        console.log(clc.green(`Version: `), clc.yellow(packageJson.version))
        console.log(
            clc.green(`Please consider leave a ⭐ at `),
            clc.yellow.underline(
                `https://github.com/Zulfiqar-Qureshi/routine-js`
            )
        )
        console.log(
            clc.green(`documentation can be found at `),
            clc.yellow.underline(`https://routinejs.juniordev.net\n`)
        )
        let conf = this.conf
        let requestRef, responseRef
        let server = http.createServer(async (req, res) => {
            res.setHeader('X-Powered-By', 'routinejs')
            requestRef = req
            responseRef = res
            //Custom method allowing easy json transmission as ExpressJS does
            res.json = (json) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(safeStringify(json))
            }
            res.status = (statusCode = 200) => {
                res.statusCode = statusCode
                return res
            }

            //Parsing request url and the 'true' is for allowing the parser to also parse
            // any query strings if present
            let parsedUrl = url.parse(req.url, true)

            await executeMiddlewareHandler(
                req,
                res,
                this.middlewares,
                parsedUrl,
                emitter
            )
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

            // console.log(isRouteMatch(req, this.routes))
            // console.log(req.params)
            //Checking to see that the incoming requests matches any route in our code
            // let route = this.routes.find((obj) => {
            //     return obj.url === req.path && obj.method === req.method
            // })

            let route = findMatchingRoute(req, this.routes)

            //If match is found (means the above route var is not undefined),
            //then we proceed with the request, otherwise we sent a 404 Not found
            //message in the else block
            if (route !== undefined) {
                //Since these below methods allow a payload inside request body,
                // we need to parse it and attach it to the req.body object
                if (['PUT', 'PATCH', 'POST'].indexOf(req.method) !== -1) {
                    if (
                        req.headers['content-type'].split(';')[0] ===
                            'multipart/form-data' &&
                        !this.conf.allowMultipart
                    ) {
                        res.status(500).json({
                            message: 'Multipart form-data is not allowed',
                        })
                        return
                    }

                    if (conf.enableBodyParsing) {
                        req.body = await bodyParser(req)
                    }

                    await executeRouteHandlers(route, req, res, emitter)
                    //This else block means if request is of type GET where body
                    //should not be present or should not be parsed
                } else {
                    await executeRouteHandlers(route, req, res, emitter)
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
        handler(PORT)

        if (conf.catchErrors) {
            process.on('uncaughtException', function (err) {
                conf.errorHandler(err, requestRef, responseRef)
            })
            process.on('unhandledPromiseRejection', function (err) {
                conf.errorHandler(err, requestRef, responseRef)
            })
        }
        emitter.on('request-cancelled', (e) => {
            console.log(
                clc.blue.underline(`INFO -->`),
                clc.yellow(
                    `Request at ${clc.yellow.underline(e.path)} was cancelled`
                ),
                clc.blue.underline(`\nREASON -->`),
                clc.yellow(e.message)
            )
        })
        return server
    }
}

module.exports = Routine
exports = module.exports
exports.Router = Router
