export declare class ProductData {
    product_name: string;
    specs: string;
    description_html: string;
    selected_voice: string;
    keywords: string;
    constructor(product: {
        title: string;
        specs: string;
        description_html: string;
        selected_voice: string;
        keywords: string;
    });
    toObject(): {
        product_name: string;
        specs: string;
        description_html: string;
        selected_voice: string;
        keywords: string;
    };
    toJSon(): string;
    toMap(): Map<string, string>;
}
declare const _default: import("h3").EventHandlerWithFetch<import("h3").EventHandlerRequest, Promise<{
    product_name: string;
    specs: string;
    description_html: string;
    selected_voice: string;
    keywords: string[];
} | {
    message: string;
    status: number;
}>>;
export default _default;
//# sourceMappingURL=humanize-product.d.mts.map