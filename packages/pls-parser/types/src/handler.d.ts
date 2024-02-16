import type { Statement, Expression } from 'estree';
export type Scope = any;
type Handler<T, R> = (node: T, scope: Scope, ...args: any[]) => R;
export interface ParserMeta {
    onFunction: boolean;
    onLoop: boolean;
    onSwitch: boolean;
    doReturn: boolean;
    doBreak: boolean;
    doContinue: boolean;
    returnValue?: any;
}
export declare const statementHandler: Handler<Statement, Scope>;
export declare const expressionHandler: Handler<Expression, unknown>;
export {};
