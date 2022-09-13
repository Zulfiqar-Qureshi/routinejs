module.exports = function executeMiddlewareHandler(
    req,
    res,
    middlewares,
    parsedUrl
) {
    try {
        for (let mid of middlewares) {
            if (!mid.url) {
                mid.handler(req, res)
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
                    mid.handler(req, res)
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}
