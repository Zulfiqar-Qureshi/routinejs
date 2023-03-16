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
        if (optionalData != null && optionalData instanceof Error) {
            res.status(500).end()
            reject('Error passed to next function')
        } else if (optionalData != null) {
            req.nextData = optionalData
        }
        resolve('middleware done')
    }

    function cancel() {
        res.destroy()
    }

    mid(req, res, next, cancel)
}
