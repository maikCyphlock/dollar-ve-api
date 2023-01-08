import dolar from '../db/dolar.json'
import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'

const app = new Hono()
 let d = dolar.sort((a, b) => a.origin.localeCompare(b.origin)) // eslint-disable-line

app.get('/', (ctx) => ctx.json(d))

app.get('/static/*', serveStatic({ root: './' }))

export default app
