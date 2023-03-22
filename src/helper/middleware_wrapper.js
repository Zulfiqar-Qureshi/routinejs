module.exports = function middlewareWrapper(mid, req, res, resolve) {
    req.path = req.url
    function next(optionalData = null) {
        if (optionalData != null) {
            req.nextData = optionalData
        }
        resolve('middleware done')
    }

    mid(req, res, next)
}
