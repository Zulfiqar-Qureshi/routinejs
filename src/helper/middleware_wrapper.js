module.exports = function middlewareWrapper(
    mid,
    req,
    res,
    resolve,
    reject,
    rejectOuter,
    emitter
) {
    function next(optionalData = null) {
        if (optionalData != null) {
            req.nextData = optionalData
        }
        resolve('middleware done')
    }

    function cancel(handler = null, optionalMessage = 'Request Cancelled') {
        if (handler) {
            handler(req)
        }
        rejectOuter(optionalMessage)
        res.end()
        emitter.emit('request-cancelled', optionalMessage)
    }

    mid(req, res, next, cancel)
}
