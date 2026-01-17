import { config } from 'dotenv'
import { H3, serve } from 'h3'
import { ProductData } from './api/humanize-product.js'
import { upcellenceAI } from './gemini/index.js'
import { productSchema } from './gemini/schema.js'

config()

const app = new H3({ debug: true, onError: console.error })

app.use(async ({ res }, next) => {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.headers.set('Access-Control-Allow-Credentials', 'true')
	await next()
})

app.all('/humanize-product', async ({ req, res }) => {
	if (req.method.toUpperCase() === 'OPTIONS') {
		res.status = 200
		return new Response(null, {
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Max-Age': '86400',
			}),
			status: 200,
			statusText: 'OK',
		})
	}
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
})

app.get('/', async (e) => {
	return { message: 'Hello World' }
})

export const POST = app.fetch
export const GET = app.fetch

if (process.env.DEV === 'true') serve(app, {})
