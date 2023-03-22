declare module '@juniordev/routinejs' {
    import { RequestListener, ServerResponse } from 'http'
    import { CookieSerializeOptions } from 'cookie'

    export class Routine {
        constructor(props?: config)
        get: HttpMethodCall
        post: HttpMethodCall
        put: HttpMethodCall
        patch: HttpMethodCall
        delete: HttpMethodCall
        options: HttpMethodCall
        use: Function
        listen: Listen
    }

    class Response extends ServerResponse {
        json(json: JSON | string | unknown)
        status: (num: number) => Response
        sendStatus(status: string | unknown)
        setCookie(name: string, value: any, options?: CookieSerializeOptions)
        send(data: JSON | object | string | Buffer)
    }

    interface Request extends RequestListener {
        params: QueryOrParam
        query: QueryOrParam
        nextData: QueryOrParam | any
        body: QueryOrParam | any
        path: string
        cookies?: object | any
        [key: string]: any
    }

    type NextFunction = (data?: any) => void
    class Router extends Omit(Routine, ['listen']) {}

    export default Routine
    export { Router, Request, Response, NextFunction }
}

const Omit = <T, K extends keyof T>(
    Class: new () => T,
    keys: K[]
): new () => Omit<T, (typeof keys)[number]> => Class

interface config {
    enableBodyParsing?: boolean
    suppressInitialLog?: boolean
    enableCookieParsing?: boolean
    suppressRouteLog?: boolean
}
type FunctionWithPort = (port: number) => void
type Listen = (port?: number | string, cb?: FunctionWithPort) => void
type HttpMethodCall = (url: string, ...handlers: Array<Function>) => void
interface QueryOrParam {
    [key: string]: unknown
}
