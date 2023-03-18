const middlewareWrapper = require('./middleware_wrapper')

module.exports = async function executeRouteHandlers(route, req, res) {
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
    await new Promise(async (resolve) => {
        for (let mid of route.store.middlewares) {
            await new Promise((resolveInner) => {
                middlewareWrapper(mid, req, res, resolveInner)
            })
        }
        resolve('done')
    })
    req.params = route.params
    //Here we are running the main last handler of
    //the matched route
    route.handler(req, res)
}
