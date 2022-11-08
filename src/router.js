//ts-check
/**
 * @file router.js is the root file for this framework
 * @author Zulfiqar Ali Qureshi
 * @see <a href="https://author.juniordev.net">My Resume</a>
 */
const clc = require('cli-color')
const {use, Router, listen} = require('./helper/utils')
const trieRouter = require('./helper/trie')

/**
 * A main route object
 * @typedef {Object} Route
 * @property {string} url - path of the route, such as '/xyz' or '/xyz/abc'
 * @property {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'} method - Http method of the route
 * @property {Function} handler - main handler function for the route
 * @property {Function | Undefined} middlewares - any possible middleware functions given prior to handler func
 * */

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
        suppressInitialLog: false,
        errorHandler: function (error, req, res) {
            console.error(
                clc.red.underline(`ERROR CAUGHT-->`),
                clc.yellow(error.toString().split(':')[1])
            )
            res.end()
        },
    }

    /**
     * @constructor
     * @param boolean allowMultipart
     * */
    constructor(conf) {
        if (
            conf?.suppressInitialLog != undefined &&
            typeof conf.suppressInitialLog === 'boolean'
        ) {
            this.conf.suppressInitialLog = conf?.suppressInitialLog
        }
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

    use = use

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

    /**
     * @private method
     * */
    registerRoutes() {
        this.routes.forEach(obj => {
            trieRouter.on(obj.method, obj.url, (req, res) => {
                obj.handler(req, res)
            }, obj)
        })
    }

    /*
     * @param PORT {number} Port to start listening on, default is 8080
     * @param handler {function} callback function to call once server is successfully started
     */
    listen = listen
}

module.exports = Routine
exports = module.exports
exports.Router = Router
