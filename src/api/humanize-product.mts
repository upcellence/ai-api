import { defineEventHandler } from 'h3'
import { upcellenceAI } from '../gemini/index.js'
import { productSchema } from '../gemini/schema.mjs'

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

	toObject() {
		return {
			product_name: this.product_name,
			specs: this.specs,
			description_html: this.description_html,
			selected_voice: this.selected_voice,
			keywords: this.keywords,
		}
	}

	toJSon() {
		return JSON.stringify(this.toObject())
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

export default defineEventHandler(async ({ req }) => {
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

	if (req.method.toUpperCase() === 'POST') {
		const response = await upcellenceAI.humanizeProduct(prompt, productData)
		return productSchema.parse(
			JSON.parse(response.text ?? JSON.stringify({ ...response.candidates?.[0] }))
		)
	} else {
		return { message: 'Method not allowed', status: 405 }
	}
})
