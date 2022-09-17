const middlewareWrapper = require('./middleware_wrapper')

module.exports = async function executeRouteHandlers(
    route,
    req,
    res,
    asyncErrorHandler
) {
    /*
     * Lots of things are happening here, so let's break them down one by one
     * Firstly, we are utilizing a promise so that it waits until the inner loop is completed
     * Secondly, another promise inside the loop to wait for each function execution to
     *  - complete before moving to next iteration
     * Lastly, we have two functions
     *   - middlewareWrapper and inside it is a next() middleware caller function
     *   - middlewareWrapper and next both work on the resolve function of the two
     *   - promises, cleverly, we get a middleware execution pattern
     * */
    try {
        await new Promise(async (resolve, reject) => {
            for (let mid of route.middlewares) {
                try {
                    await new Promise((resolveInner, rejectInner) => {
                        middlewareWrapper(
                            mid,
                            req,
                            res,
                            resolveInner,
                            rejectInner,
                            reject
                        )
                    })
                } catch (e) {
                    asyncErrorHandler(e)
                }
            }
            resolve('done')
            //Here we are running the main last handler of
            //the matched route

            route.handler(req, res)
        })
    } catch (e) {
        asyncErrorHandler(e)
    }
}
