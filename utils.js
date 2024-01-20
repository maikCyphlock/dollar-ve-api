import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export async function saveJsonIntoDb (jsonData, filePath = 'db/dolar.json') {
  if (filePath === null || filePath === undefined) {
    throw new Error('File path is not valid or the file cannot be written')
  }
  if (typeof filePath !== 'string') {
    throw new Error('File path is not valid or the file cannot be written')
  }
  if (jsonData === null || jsonData === undefined) {
    throw new Error('JSON object is null or undefined')
  }
  if (typeof jsonData !== 'object') {
    throw new Error('JSON object is not valid')
  }
  if (jsonData === null || jsonData === undefined) {
    throw new Error('File path is not valid or the file cannot be written')
  }
  // check if filepath is valid route
  const fsPromises = fs.promises

  async function checkFileWritable (filePath) {
    try {
      await fsPromises.access(filePath, fs.constants.W_OK)
      return true
    } catch {
      return false
    }
  }

  const isWritable = await checkFileWritable(filePath)
  if (!isWritable) {
    throw new Error('File path is not writable')
  }

  try {
    const jsonString = JSON.stringify(jsonData, null, 2)

    return fs.writeFileSync(filePath, jsonString)
  } catch (error) {
    return error
  }
}

export async function saveAllDataWithHistory (ALL_DATA) {
  const fsPromises = fs.promises
  const historyDbPath = path.join(__dirname, 'db', 'history_dolar.json')
  const dbPath = path.join(__dirname, 'db', 'dolar.json')
  try {
    const currentData = await fsPromises.readFile(dbPath, 'utf8')
    const currentJson = JSON.parse(currentData)

    let historyJson = { history: [] }
    // Check if history file exists and read it
    try {
      const historyData = await fsPromises.readFile(historyDbPath, 'utf8')
      historyJson = JSON.parse(historyData)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error // Rethrow if the error is not about non-existing file
      }
      // If history file does not exist, initialize it
      historyJson = { history: [] }
    }

    // Add current data to the history
    historyJson.history.push({ ...currentJson, date: new Date().toISOString() })

    // Write new history data to file
    const historyDataString = JSON.stringify(historyJson, null, 2)
    await fsPromises.writeFile(historyDbPath, historyDataString)
  } catch (error) {
    // fs.writeFileSync(ERROR_LOG_PATH, JSON.stringify(error.stack, null, 2))
    console.error(error)
  }
}
