export interface PlsParser {
    setGlobal: (key: string, value: any) => void;
    run: (plsCode: string) => void;
}
export declare const parserFactory: () => PlsParser;
