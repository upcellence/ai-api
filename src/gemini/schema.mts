import z from 'zod'

export const product = z.object({
	product_name: z.string().describe('The name of the Shopify product'),
	specs: z.string().describe('The product specifications'),
	description_html: z.string().describe("The product's description HTML body"),
	selected_voice: z.string().describe('The brand tone for the product humanization'),
	keywords: z.array(z.string()).describe('The SEO keywords for the product'),
})

export const productSchema = product

export const bulkProductsSchema = z.object({
	products: z.array(productSchema).describe('A list of bulk humanized products'),
})
