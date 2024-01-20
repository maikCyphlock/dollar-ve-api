import { extractFromHtml } from '@extractus/article-extractor'
import fs from 'node:fs'
import { saveJsonIntoDb, saveAllDataWithHistory } from './utils.js'
const URL = 'https://www.bcv.org.ve/'

/**
 * Error Handling due servers misconfigurations and unauthorized accesss
 */
// eslint-disable-next-line
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
async function MainScrapeBCV () {
  try {
    const res = await fetch(URL)
    const html = await res.text()
    const article = await extractFromHtml(html, URL)
    const { tasaCambiariaBancoMatch, valorDolar } = RegexBanks(article)
    const Banks = ExtractBANK(tasaCambiariaBancoMatch)
    const ALL_DATA = {

      exchange_rate: [...Banks, {
        bank: 'BCV',
        selling: parseFloat(valorDolar),
        buying: parseFloat(valorDolar),
        urlname: 'bcv'
      }],
      date: new Date(),
      source: article.source,
      logo_img: article.favicon
    }
    await saveJsonIntoDb(ALL_DATA)
    await saveAllDataWithHistory(ALL_DATA)
  } catch (error) {
    fs.writeFileSync('log/error.txt', JSON.stringify(error.stack, null, 2))
    console.error(error)
  }
}

function ExtractBANK (texto) {
  const regex = /<h2>Tasas Informativas del Sistema Bancario \(Bs\/USD\)<\/h2>\s*<div>([\s\S]*?)<\/table>\s*<\/div>/
  const match = regex.exec(texto)

  if (match) {
    const tablaHTML = match[1]
    const bancoRegex = /<tr>\s*<td>\s*(.*?)\s*<\/td>\s*<td>\s*([0-9,.]+)\s*<\/td>\s*<td>\s*([0-9,.]+)\s*<\/td>\s*<\/tr>/g

    const bancos = []
    let bancoMatch

    while ((bancoMatch = bancoRegex.exec(tablaHTML)) !== null) {
      const banco = {
        bank: bancoMatch[1].trim(),
        urlname: bancoMatch[1].trim().toLowerCase().replace(/\s/g, '_'),
        buying: parseFloat(bancoMatch[2].replace(/,/g, '.').trim()),
        selling: parseFloat(bancoMatch[3].replace(/,/g, '.').trim())
      }

      bancos.push(banco)
    }

    const resultado = bancos
    console.log(resultado)
    return resultado
  } else {
    console.log('No se encontró la tabla de bancos.')
  }
}

export function RegexBanks (article) {
  const tasaCambiariaBancoMatch = (() => {
    try {
      return article.content.match(/<h2>Tasas Informativas del Sistema Bancario \(Bs\/USD\)<\/h2>\s*<div>([\s\S]*?)<\/table>\s*<\/div>/)[0] ?? null
    } catch (error) {
      return null
    }
  })()

  const TasaDolarMatch = (() => {
    try {
      return article.content.match(/<span>\s*USD\s*<\/span>\s*<\/p>\s*<p><strong>\s*([0-9,.]+)\s*<\/strong>\s*<\/p>/
      )
    } catch (error) {
      return null
    }
  })()
  const valorDolar = (() => {
    try {
      return TasaDolarMatch[1].replace(',', '.')
    } catch (error) {
      return null
    }
  })()

  return {
    tasaCambiariaBancoMatch,
    valorDolar
  }
}

MainScrapeBCV()
