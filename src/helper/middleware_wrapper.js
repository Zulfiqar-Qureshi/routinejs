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

    function cancel(optionalMessage = 'Cancel function called', handler = null) {
        if (handler) {
            handler(req)
        }
        emitter.emit('request-cancelled', {
            path: req.path,
            message: optionalMessage
        })
        res.end()
    }

    mid(req, res, next, cancel)
}
