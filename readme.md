# Dollar API Venezuela
[![Deploy API](https://github.com/maikCyphlock/dollar-ve-api/actions/workflows/deploy-api.yml/badge.svg?branch=master)](https://github.com/maikCyphlock/dollar-ve-api/actions/workflows/deploy-api.yml) [![Scrape Dolar api](https://github.com/maikCyphlock/dollar-ve-api/actions/workflows/cron-scrapper.yml/badge.svg)](https://github.com/maikCyphlock/dollar-ve-api/actions/workflows/cron-scrapper.yml)

This is a backend application for the Dollar API Venezuela, which automatically updates the Dolar pricing and uses Cloudflare Workers service to speed up requests. It can easily be connected to a frontend application.

## Features
Automatically updates Dolar pricing.
Uses Cloudflare Workers service to speed up requests.
Easy to connect to a frontend application.

## Usage
To use the dolar-api backend, follow these steps:

* Clone this repository to your local machine.

* Install the required dependencies by running ``npm install`` command.

* Run the application using ``npm start`` command.

Access the API by sending GET requests to the specified endpoints.
You can also run the scraper separately using the npm run scrapper command.

If you want to use the Cloudflare Workers service to deploy the application, you can use the following commands:

* ``npm run wrangler:dev``: Runs the application in development mode using the Wrangler CLI.
* ``npm run wrangler:prod``: Publishes the application to the Cloudflare Workers service using the Wrangler CLI.

### Endpoints
```
`/`: Returns the current Dolar pricing in Venezuela.
`/history`: Returns the history of Dolar pricing in Venezuela.
`/average`: Returns the average Dolar pricing in Venezuela over the specified time range.
```
```javascript
import dolar from '../db/dolar.json'
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { serveStatic } from 'hono/serve-static.module'

const app = new Hono()
let d = dolar.sort((a, b) => a.origin.localeCompare(b.origin)) // eslint-disable-line

app.get('/', (ctx) => ctx.json(d))

app.get('/static/*', serveStatic({ root: './' }))
app.get('*', cache({ cacheName: 'dolar-api', cacheControl: 'max-age=3600' }))

export default app

```
### Deployment
This application is set up to deploy automatically using GitHub Actions. The deploy-api.yml workflow deploys the application to Cloudflare Workers service. The cron-scrapper.yml workflow runs every hour to scrape the Dolar pricing data.

### Contributing
Contributions to this project are welcome. Please open an issue or pull request if you find any bugs or have any suggestions for improvements.

### License
This project is licensed under the MIT License. See the LICENSE file for details.
