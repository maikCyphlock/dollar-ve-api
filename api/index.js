import dolar from '../db/dolar.json'
import history from '../db/history_dolar.json'
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { serveStatic } from 'hono/serve-static.module'

const app = new Hono()
// eslint-disable-line
app.get('/', (ctx) => ctx.json(dolar))
app.get('/history', (ctx) => ctx.json(history))

app.get('/static/*', serveStatic({ root: './' }))
app.get('*', cache({ cacheName: 'dolar-api', cacheControl: 'max-age=3600' }))

export default app
