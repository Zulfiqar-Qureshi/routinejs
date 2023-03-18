module.exports = function middlewareWrapper(mid, req, res, resolve) {
    function next(optionalData = null) {
        if (optionalData != null) {
            req.nextData = optionalData
        }
        resolve('middleware done')
    }

    mid(req, res, next)
}
