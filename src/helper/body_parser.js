const StringDecoder = require('string_decoder').StringDecoder

module.exports = async function bodyParser(req) {
    const decoder = new StringDecoder('utf-8')
    let buffer = ''
    await new Promise((resolve, reject) => {
        //Every body comes as a nodejs data stream, we need to read
        //that stream as it comes, decode it and attach it to a buffer
        req.on('data', (data) => {
            buffer += decoder.write(data)
        })

        //Once request ends, we JSON.parse the buffer and attach it to
        // the req.body object and proceed with the handler functions
        req.on('end', async () => {
            buffer += decoder.end()
            resolve('body parsed')
        })

        req.on('error', (err) => {
            console.error('An error is encountered while parsing body')
            reject(err)
        })
    })
    return JSON.parse(buffer)
}
