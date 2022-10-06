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
            reject("Error passed to next function")
        } else if (optionalData != null) {
            req.nextData = optionalData
        }
        resolve('middleware done')
    }

    function cancel(...args) {
        let optionalMessage = "Cancel function called"
        if (typeof args[0] === "function") {
            args[0](req)
        } else if (typeof args[0] === "string" && typeof args[1] === "function"){
            optionalMessage = args[0]
            args[1](req)
        } else if (typeof args[0] === "string") {
            optionalMessage = args[0]
        }
        emitter.emit('request-cancelled', {
            path: req.path,
            message: optionalMessage
        })
        res.end()
    }

    mid(req, res, next, cancel)
}
