import { defineHandler } from 'h3'
import { upcellenceAI } from '../gemini/index.js'
import { productSchema } from '../gemini/schema.js'

export class ProductData {
	product_name
	specs
	description_html
	selected_voice
	keywords

	constructor(product: {
		title: string
		specs: string
		description_html: string
		selected_voice: string
		keywords: string
	}) {
		this.product_name = product.title
		this.specs = product.specs
		this.description_html = product.description_html
		this.selected_voice = product.selected_voice
		this.keywords = product.keywords
	}

	static toObject(productData: ProductData) {
		return {
			product_name: productData.product_name,
			specs: productData.specs,
			description_html: productData.description_html,
			selected_voice: productData.selected_voice,
			keywords: productData.keywords,
		}
	}

	static toJSon(productData: ProductData) {
		return JSON.stringify(ProductData.toObject(productData))
	}

	toMap() {
		return new Map<string, string>([
			['product_name', this.product_name],
			['specs', this.specs],
			['description_html', this.description_html],
			['selected_voice', this.selected_voice],
			['keywords', this.keywords],
		])
	}
}

export default defineHandler({
	async handler({ req }) {
		if (req.method.toUpperCase() === 'GET') {
			return {
				message: 'Method not allowed',
				status: 405,
				usage: {
					method: 'POST',
					body: {
						description_html: 'string',
						keywords: 'string',
						prompt: 'string',
						selected_voice: 'string',
						specs: 'string',
						title: 'string',
					},
				},
			}
		} else if (req.method.toUpperCase() === 'POST') {
			const { prompt, title, specs, description_html, selected_voice, keywords } =
				(await req.json()) as {
					prompt: string
					title: string
					specs: string
					description_html: string
					selected_voice: string
					keywords: string
				}

			if (!title || !specs || !keywords || !selected_voice || !description_html) {
				return { message: 'Provide all required fields', status: 401 }
			}

			const productData = new ProductData({
				title: title!,
				specs: specs!,
				description_html: description_html!,
				selected_voice: selected_voice!,
				keywords: keywords!,
			})
			const response = await upcellenceAI.humanizeProduct(prompt, productData)
			return productSchema.parse(
				JSON.parse(response.text ?? JSON.stringify({ ...response.candidates?.[0] }))
			)
		}
	},
	middleware: [
		async ({ context, req, res }, next) => {
			req.headers.set('Access-Control-Allow-Origin', '*')
			req.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
			req.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
			req.headers.set('Access-Control-Max-Age', '86400')

			res.headers.set('Access-Control-Allow-Origin', '*')
			res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
			res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
			res.headers.set('Access-Control-Max-Age', '86400')

			return next()
		},
	],
})
