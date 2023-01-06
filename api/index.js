import dolar from '../db/dolar' assert { type: 'json' }

let d = dolar.sort((a, b) => a.origin.localeCompare(b.origin)) // eslint-disable-line

export default {
  async fetch (request, env, ctx) {
    return new Response(JSON.stringify(d),{
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
