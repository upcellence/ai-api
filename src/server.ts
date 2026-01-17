import { config } from 'dotenv'
import { H3, serve } from 'h3'
import humanizeProduct from './api/humanize-product.js'

config()

const app = new H3({ debug: true, onError: console.error })

app.use(({ req, res }, next) => {
	// Set the allowed origin
	res.headers.set('Access-Control-Allow-Origin', 'https://extensions.shopifycdn.com')
	// Set the allowed methods
	res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	// Set the allowed headers
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	// Allow credentials (if your frontend sends cookies/auth headers)
	res.headers.set('Access-Control-Allow-Credentials', 'true')
	// Handle preflight requests
	if (req.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
		})
	}
	next()
})

app.use('/humanize-product', humanizeProduct)

app.get('/', async (e) => {
	return { message: 'Hello World' }
})

export const POST = app.fetch
export const GET = app.fetch

serve(app, {})
