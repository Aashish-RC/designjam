declare module "@modelcontextprotocol/sdk/server/mcp.js" {
    export class McpServer {
        constructor(serverInfo: { name: string; version: string }, options?: Record<string, unknown>);
        connect(transport: unknown): Promise<void>;
        registerTool(name: string, config: any, handler: (args: any) => Promise<any>): void;
        tool(name: string, description: string, schema: unknown, handler: (...args: any[]) => Promise<any>): void;
        close(): void | Promise<void>;
    }
}

declare module "@modelcontextprotocol/sdk/server/sse.js" {
    export class SSEServerTransport {
        constructor(endpoint: string, res: unknown);
        sessionId: string;
        handlePostMessage(req: unknown, res: unknown, body?: unknown): Promise<void>;
        close(): Promise<void>;
    }
}

declare module "@modelcontextprotocol/sdk/server/streamableHttp.js" {
    export interface StreamableHTTPServerTransportOptions {
        sessionIdGenerator?: () => string;
        onsessioninitialized?: (sessionId: string) => void;
        onsessionclosed?: (sessionId: string) => void;
    }

    export class StreamableHTTPServerTransport {
        constructor(options?: StreamableHTTPServerTransportOptions);
        sessionId?: string;
        onclose?: () => void;
        handleRequest(req: unknown, res: unknown, body?: unknown): Promise<void>;
        close(): Promise<void>;
    }
}

declare module "express" {
    export interface Request {
        url: string;
        method: string;
        headers: Record<string, any>;
        query: Record<string, any>;
        body: any;
    }

    export interface Response {
        status(code: number): Response;
        json(data: any): Response;
        send(data: any): Response;
        setHeader(name: string, value: any): Response;
        writeHead(statusCode: number, headers?: any): Response;
        end(data?: any): void;
    }

    export interface ExpressApp {
        use(...args: any[]): ExpressApp;
        get(path: string, ...handlers: any[]): ExpressApp;
        post(path: string, ...handlers: any[]): ExpressApp;
        listen(port: number, host?: string | (() => void), callback?: () => void): any;
    }

    function express(): ExpressApp;
    namespace express {
        export function json(options?: any): any;
        export function raw(options?: any): any;
        export function text(options?: any): any;
        export function urlencoded(options?: any): any;
    }
    export default express;
}

declare module "node:crypto" {
    export function randomUUID(): string;
    export * from "crypto";
}

declare module "async_hooks" {
    export class AsyncLocalStorage<T> {
        getStore(): T | undefined;
        run<R>(store: T, callback: () => R): R;
        exit<R>(callback: () => R): R;
    }
}

declare module "zod" {
    export interface ZodType<T = any> {
        describe(desc: string): this;
        optional(): this;
        default(val: any): this;
        min(length: number, message?: string): this;
        max(length: number, message?: string): this;
        int(): this;
        positive(): this;
    }

    export interface ZodString extends ZodType<string> {}
    export interface ZodNumber extends ZodType<number> {}
    export interface ZodBoolean extends ZodType<boolean> {}
    export interface ZodObject<T = any> extends ZodType<T> {}

    export namespace z {
        export type ZodRawShape = Record<string, any>;
        export type infer<T> = any;
    }

    export const z: {
        string: () => ZodString;
        number: () => ZodNumber;
        boolean: () => ZodBoolean;
        enum: <T extends readonly [string, ...string[]] | string[]>(values: T) => ZodType<T[number]>;
        object: <T extends Record<string, any>>(shape: T) => ZodObject<T>;
        array: <T>(schema: ZodType<T>) => ZodType<T[]>;
        record: <T>(schema: ZodType<T>) => ZodType<Record<string, T>>;
        infer: any;
        [key: string]: any;
    };

    export type infer<T> = any;
    export default z;
}

declare module "reflect-metadata" {}

declare module "@penpot/mcp-common" {
    export interface ExecuteCodeTaskParams {
        code: string;
    }
    export interface ExecuteCodeTaskResultData<T = any> {
        [key: string]: any;
    }
    export interface PluginTaskResult<T = any> {
        data: T;
        error?: string;
    }
}

declare module "pino" {
    export interface TransportTargetOptions {
        [key: string]: any;
    }
    export interface Logger {
        [key: string]: any;
    }
    const pino: any;
    export function pino(...args: any[]): any;
    export default pino;
}

declare module "pino-pretty" {
    const pinoPretty: any;
    export default pinoPretty;
}

declare module "pino-loki" {
    const pinoLoki: any;
    export default pinoLoki;
}

declare module "sharp" {
    const sharp: any;
    export default sharp;
}

declare module "ws" {
    export class WebSocketServer {
        constructor(options?: any);
        on(event: string, cb: (...args: any[]) => void): void;
    }
    export default WebSocketServer;
}

declare var process: any;
declare var Buffer: any;
declare var path: any;
declare var fs: any;
declare var crypto: any;
declare var http: any;
declare var https: any;


