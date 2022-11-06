const {match} = require("path-to-regexp");
const clc = require("cli-color");
const ascii = require("../ascii.json");
const packageJson = require("../../package.json");

function use(...args){
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

function initialLog(){
    console.log(clc.green(ascii.art[3]))
    console.log(clc.green(`Version: `), clc.yellow(packageJson.version))
    console.log(
        clc.green(`Please consider leaving a ⭐ at `),
        clc.yellow.underline(
            `https://github.com/Zulfiqar-Qureshi/routine-js`
        )
    )
    console.log(
        clc.green(`documentation can be found at `),
        clc.yellow.underline(`https://routinejs.juniordev.net\n`)
    )
}

function Router() {
    /**
     * @param {Array<Route>} routes - routes array where individual route objects are pushed upon code traversal
     * */
    let routes = []

    let middlewares = []
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
        use,
        middlewares,
        routes,
    }
}

exports.use = use
exports.initialLog = initialLog
exports.Router = Router