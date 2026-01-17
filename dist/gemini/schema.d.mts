import z from 'zod';
export declare const product: z.ZodObject<{
    product_name: z.ZodString;
    specs: z.ZodString;
    description_html: z.ZodString;
    selected_voice: z.ZodString;
    keywords: z.ZodArray<z.ZodString>;
}, z.z.core.$strip>;
export declare const productSchema: z.ZodObject<{
    product_name: z.ZodString;
    specs: z.ZodString;
    description_html: z.ZodString;
    selected_voice: z.ZodString;
    keywords: z.ZodArray<z.ZodString>;
}, z.z.core.$strip>;
export declare const bulkProductsSchema: z.ZodObject<{
    products: z.ZodArray<z.ZodObject<{
        product_name: z.ZodString;
        specs: z.ZodString;
        description_html: z.ZodString;
        selected_voice: z.ZodString;
        keywords: z.ZodArray<z.ZodString>;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
//# sourceMappingURL=schema.d.mts.map