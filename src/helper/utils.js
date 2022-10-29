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

exports.use = use
exports.findMatchingRoute = findMatchingRoute
exports.initialLog = initialLog