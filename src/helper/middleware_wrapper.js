module.exports = function middlewareWrapper(
    mid,
    req,
    res,
    resolve,
    reject,
    rejectOuter,
) {
    function next(optionalData = null) {
        if (optionalData != null) {
            req.nextData = optionalData
        }
        resolve('middleware done')
    }

    function cancel(handler = null, optionalMessage = 'Request Cancelled') {
        req.rejectedByCancel = true
        rejectOuter(optionalMessage)
        if (handler) {
            handler(req)
        }
        res.end()
    }

    mid(req, res, next, cancel)
}
