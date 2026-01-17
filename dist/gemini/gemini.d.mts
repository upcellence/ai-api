import { type GoogleGenAIOptions } from '@google/genai';
import { ProductData } from '../api/humanize-product.mjs';
export declare class UpcellenceAI {
    private _ai;
    private _model;
    private _defaultOpts;
    constructor(model: string, genaiOptions: GoogleGenAIOptions);
    set model(value: string);
    get model(): string;
    set options(value: GoogleGenAIOptions);
    get options(): GoogleGenAIOptions;
    test(prompt: string): Promise<import("@google/genai").GenerateContentResponse>;
    humanizeProduct(prompt: string, productData: ProductData): Promise<import("@google/genai").GenerateContentResponse>;
}
//# sourceMappingURL=gemini.d.mts.map