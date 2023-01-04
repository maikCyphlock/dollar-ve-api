import pupperteer from 'puppeteer'
import { writeFile } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
async function main () {
  const DB_PATH = path.join(process.cwd(), './db/')
  // Open a Chromium browser. We use headless: false
  // to be able to watch what's going on.
  const browser = await pupperteer.launch({
    headless: true
  })
  // Open a new page / tab in the browser.
  const page = await browser.newPage({
    bypassCSP: true // This is needed to enable JavaScript execution on GitHub.
  })
  // Tell the tab to navigate to the JavaScript topic page.
  // await page.goto('https://www.instagram.com/', {
  //   waitUntil: 'domcontentloaded'
  // })
  // await page.waitForSelector('input[name="username"]')
  // await page.type('input[name="username"]', 'unitedstate.cyph@gmail.com')
  // await page.type('input[name="password"]', 'warcraft30054068')
  // await page.click('button[type="submit"]')
  // await page.waitForSelector('input[type="text"]')
  // await page.waitForNetworkIdle()

  await page.goto('https://exchangemonitor.net/dolar-venezuela', {
    waitUntil: 'domcontentloaded'
  })

  const links = await page.$$('div.col-xs-12.col-sm-6.col-md-4.col-tabla')

  const store = []

  for (const link of links) {
    const obj = { origin: '', price: '', stock: '' }
    obj.origin = await link
      .$('h6')
      .then(e => e.evaluate(node => node.innerText))

    obj.price = await link
      .$('p.precio')
      .then(e => e.evaluate(node => node.innerText))

    obj.stock = await (
      await (await link.$$('div'))[4].evaluate(node => node.innerText)
    )
      .replace(/\n/g, ' ')
      .replace(/CAMBIO 24H/, '')
      .trim()

    store.push(obj)
  }

  console.log(store)
  writeFile(`${DB_PATH}/dolar.json`, JSON.stringify(store, null, 2), err => {
    console.log(err)
  })

  // Turn off the browser to clean up after ourselves.
  await browser.close()
}

main()
