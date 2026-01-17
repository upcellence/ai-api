import { GoogleGenAI, type GoogleGenAIOptions } from '@google/genai'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { ZodType, ZodTypeDef } from 'zod/v3'
import type { ProductData } from '../api/humanize-product.mts'
import { productSchema } from './schema.mts'

export class UpcellenceAI {
	private _ai: GoogleGenAI
	private _model: string

	private _defaultOpts: GoogleGenAIOptions = {}

	constructor(model: string, genaiOptions: GoogleGenAIOptions) {
		this._model = model
		this._defaultOpts = {
			...this._defaultOpts,
			...genaiOptions,
		}
		this._ai = new GoogleGenAI({
			...this._defaultOpts,
			...genaiOptions,
		})
	}

	set model(value: string) {
		this._model = value
	}

	get model() {
		return this._model.toString()
	}

	set options(value: GoogleGenAIOptions) {
		this._defaultOpts = {
			...this._defaultOpts,
			...value,
		}
		this._ai = new GoogleGenAI({ ...this._defaultOpts })
	}

	get options() {
		return this._defaultOpts
	}

	async test(prompt: string) {
		const res = await this._ai.models.generateContent({
			model: this._model,
			contents: prompt,
		})
		return res
	}

	async humanizeProduct(prompt: string, productData: ProductData) {
		const { product_name, specs, description_html, selected_voice, keywords } = productData
		try {
			const response = await this._ai.models.generateContent({
				model: this._model,
				contents: prompt ?? '',
				config: {
					candidateCount: 1,
					responseMimeType: 'application/json',
					responseJsonSchema: zodToJsonSchema(
						productSchema as unknown as ZodType<any, ZodTypeDef, any>
					),
					systemInstruction: {
						role: 'system',
						parts: [
							{
								text: `
								### ROLE
								You are a world-class E-commerce Copywriter and Brand Strategist.
								Your goal is to transform dry, technical manufacturer specifications into high-converting, "vibe-aligned" product descriptions for Shopify stores.

								### INPUT DATA
								- Product Name: ${product_name}
								- Techical Specs: ${specs}
								- Current Description HTML: ${description_html}
								- Target Brand Voice: ${selected_voice} (e.g., Gen-Z Snarky, Quiet Luxury, Outdoor Rugged)

								### EXECUTION STEPS
								1. ANALYZE THE VIBE: Identify the core emotionalbenefit of the product. Who is the "hero" using this?
								2. HOOK: Write a one-sentence opening that calls out a specific point or desire.
								3. THE "HUMAN" TOUCH: Rewrite the specs as benefits. Instead of "5000mAh battery," write "Enough juice to power your 3-day weekend without touching a wall outlet."
								4. CALL TO ACTION: End with a subtle, brand-aligned nudge to "Add to Cart."

								### CONSTRAINTS
								- NO "AI-isms": Avoid words like "unleash", "tapestry", "delve", or "elevate".
								- SEO INTEGRATION: Naturally weave in keywords: ${keywords}.
								- FORMATTING: Use HTML tags (<b>, <br>, <ul> or other richtext supported HTML tags) so it looks perfect in the Shopify editor.
								-LENGTH: Keep it between 150-250 words.
								-TONE: Use the provided brand voice.

								### VOICE-SPECIFIC DIRECTION
								- ALWAYS: Use a language based on the target brand voice, or tone of the product input data.
								${
									/**- If 'Quiet Luxury': Use sophisticated, minimal language. Focus on heritage and quality.
								- If 'Gen-Z Snarky': Use  lowercase occasionally, self-aware humor, and directness.
								- If 'Outdoor Rugged': Use punchy, action-oriented verbs. Focus on durability and "the elements."
								*/ ''
								}

								### OUTPUT FORMAT
								- JSON 
									{
										"product_name": humanized_string,
										"specs": enhanced_and_humanized_string (adhere to the brand voice and tone provided),
										"description_html": raw_html_string (adhere to the brand voice and tone provided. Make as humanised as can be),
										"selected_voice": string (brand voice used),
										"keywords": enhanced_and_humanized_string[] (Humanize and generate from the general product data provided)
									}
							`,
							},
						],
					},
					temperature: 1.0,
				},
			})

			return response
		} catch (e) {
			throw { status: 500, ...(e as unknown as Error) }
		}
	}
}
