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
