declare module "@juniordev/routinejs"{
    import {RequestListener, ServerResponse} from "http";

    export class Routine {
        constructor(props?: config)
        get: HttpMethodCall
        post: HttpMethodCall
        put: HttpMethodCall
        patch: HttpMethodCall
        delete: HttpMethodCall
        use: Function
        listen: Listen
    }

    class Response extends ServerResponse {
        json(jsonObject: JSON | string | unknown)
        status: (num: number) => Response;
    }

    interface Request extends RequestListener{
        params: QueryOrParam
        query: QueryOrParam
        nextData: QueryOrParam | any
        body: QueryOrParam | any
        path: string
        [key: string]: unknown
    }

    type NextFunction = (data?: any) => void;
    type CancelFunction = (optionalCancellationMessage?: string, optionalCallback?: Function) => void;
    class Router extends Omit(Routine, ['listen']) {}

    export default Routine
    export {Router, Request, Response, NextFunction, CancelFunction}
}

const Omit = <T, K extends keyof T>(Class: new () => T, keys: K[]): new () => Omit<T, typeof keys[number]> => Class;

interface config {
    allowMultipart?: boolean
    errorHandler?: Function
    catchErrors?: boolean
    enableBodyParsing?: boolean
    suppressInitialLog?: boolean
}
type FunctionWithPort = (port: number) => void;
type Listen = (port?: number, cb?: FunctionWithPort) => void;
type HttpMethodCall = (url: string, ...handlers: Array<Function>) => void;
interface QueryOrParam {
    [key: string]: unknown
}


