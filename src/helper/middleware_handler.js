const middlewareWrapper = require('./middleware_wrapper')

module.exports = async function executeMiddlewareHandler(
    req,
    res,
    middlewares,
    parsedUrl,
) {
    req.rejectedByCancel = false
    await new Promise(async (resolve, reject) => {
        for (let mid of middlewares) {
            if (!mid.url) {
                await new Promise((resolveInner, rejectInner) => {
                    middlewareWrapper(
                        mid.handler,
                        req,
                        res,
                        resolveInner,
                        rejectInner,
                        reject,
                    )
                })
            } else {
                let path =
                    parsedUrl.pathname === '/'
                        ? parsedUrl.pathname
                        : parsedUrl.pathname.replace(/(\/)+$/g, '')

                //Checking to see that the incoming requests matches any route in our code
                let route = middlewares.find((obj) => {
                    return obj.url === path
                })

                if (route !== undefined) {
                    await new Promise((resolveInner, rejectInner) => {
                        middlewareWrapper(
                            mid.handler,
                            req,
                            res,
                            resolveInner,
                            rejectInner,
                            reject,
                        )
                    })
                }
            }
        }
        resolve('done')
    })
}