import { config } from 'dotenv'
import { UpcellenceAI } from './gemini.mts'

config()

export const upcellenceAI = new UpcellenceAI('gemini-flash-latest', {
	apiKey: process.env.GEMINI_API_KEY!,
})
