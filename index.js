import { writeFile } from 'node:fs'
import pupperteer from 'puppeteer'
import path from 'node:path'
import process from 'node:process'

const DB_PATH = path.join(process.cwd(), './db/')

const saveImagen = async ({ url }) => {
  const filename = url.match(/([^\/]+)(?=\.\w+$)/g, '')
  console.log(filename)
  // const responseImage = await fetch(url)
  // const arrayBuffer = await responseImage.arrayBuffer()
  // const buffer = Buffer.from(arrayBuffer)

  // writeFile(
  //   path.join(process.cwd(), 'assets', `${filename[0]}.webp`), buffer, err => {
  //     console.log(err)
  //   }

  // )
  return filename[0]
}
const browser = await pupperteer.launch({
  headless: true
})

const page = await browser.newPage({
  bypassCSP: true
})

await page.goto('https://exchangemonitor.net/dolar-venezuela', {
  waitUntil: 'domcontentloaded'
})

const links = await page.$$('div.col-xs-12.col-sm-6.col-md-4.col-tabla')

const store = []

for (const link of links) {
  const obj = { origin: '', price: '', stock: '', imgUrl: '' }
  obj.origin = await link
    .$('h6')
    .then(e => e.evaluate(node => node.innerText))

  obj.imgUrl = await link
    .$('img')
    .then(e => e.evaluate(node => node.src)).then(e => saveImagen({ url: e }))

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

await browser.close()