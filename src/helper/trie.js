const path = require('path')

let config = {
    allowUnsafeRegex: false,
    caseSensitive: false,
    maxParamLength: 100,
    maxParamCount: 32,
    wildcardPolicy: 'free',
    mergeParams: true,
    allowUnsafePath: false,
}

try {
    const configFile = path.resolve(process.cwd(), 'routine.config.js')
    const conf = require(configFile)
    config = {
        ...config,
        ...conf,
    }
} catch (err) {}

const trieRouter = require('find-my-way')(config)

module.exports = trieRouter
