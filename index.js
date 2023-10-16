import { extractFromHtml } from "@extractus/article-extractor";
import fs from 'node:fs';
const URL = "https://www.bcv.org.ve/"

async function MainScrapeBCV() {
  try {
    const res = await fetch(URL)
    const html = await res.text()
    const article = await extractFromHtml(html, URL)
    const { tasaCambiariaBancoMatch, valorDolar } = RegexBanks(article)
    const Banks = ExtractBANK(tasaCambiariaBancoMatch)
    const ALL_DATA = {
      usd_bcv: valorDolar,
      exchange_rate: Banks,
      date: new Date(),
      source: article.source,
      logo_img: article.favicon
    };
    SaveJSON(ALL_DATA)
  } catch (error) {
    fs.writeFileSync('log/error.txt', JSON.stringify(error, null, 2));
    console.error(error);
  }
}

function SaveJSON(jsonData) {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const filePath = 'db/dolar.json';
  fs.writeFileSync(filePath, jsonString);
}
function ExtractBANK(texto) {
  const regex = /<h2>Tasas Informativas del Sistema Bancario \(Bs\/USD\)<\/h2>\s*<div>([\s\S]*?)<\/table>\s*<\/div>/;
  const match = regex.exec(texto);

  if (match) {
    const tablaHTML = match[1];
    const bancoRegex = /<tr>\s*<td>\s*(.*?)\s*<\/td>\s*<td>\s*([0-9,.]+)\s*<\/td>\s*<td>\s*([0-9,.]+)\s*<\/td>\s*<\/tr>/g;

    const bancos = [];
    let bancoMatch;

    while ((bancoMatch = bancoRegex.exec(tablaHTML)) !== null) {
      const banco = {
        bank: bancoMatch[1].trim(),
        buying: bancoMatch[2].replace(/,/g, '.').trim(),
        selling: bancoMatch[3].replace(/,/g, '.').trim(),
      };

      bancos.push(banco);
    }

    const resultado = bancos
    console.log(resultado);
    return resultado
  } else {
    console.log("No se encontró la tabla de bancos.");
  }
}

function RegexBanks(article) {
  const tasaCambiariaBancoMatch = article.content.match(/<h2>Tasas Informativas del Sistema Bancario \(Bs\/USD\)<\/h2>\s*<div>\s*<table>([\s\S]*?)<\/table>\s*<\/div>/i)

  const TasaDolarMatch = article.content.match(/<span>\s*USD\s*<\/span>\s*<\/p>\s*<p><strong>\s*([0-9,.]+)\s*<\/strong>\s*<\/p>/
  )
  const valorDolar = TasaDolarMatch[1];

  return {
    tasaCambiariaBancoMatch,
    valorDolar
  }

}

MainScrapeBCV()