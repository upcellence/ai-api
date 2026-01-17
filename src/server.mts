import { config } from 'dotenv'
import { H3, serve } from 'h3'
import humanizeProduct from './api/humanize-product.mjs'

config()

const app = new H3({ debug: true, onError: console.error })

app.use('/humanize-product', humanizeProduct)

app.get('/', async (e) => {
	return { message: 'Hello World' }
})

export const POST = app.fetch
export const GET = app.fetch

serve(app, {})
