'use strict'

const autocannon = require('autocannon')
const Push = require('./pushToResults')
const config = require('./config')

autocannon(
    {
        url: 'http://localhost:3000',
        connections: config.connections, //default
        pipelining: config.pipelining, // default
        duration: config.duration, // default
        title: 'Restify',
    },
    Push
)
