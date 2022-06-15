import fs from 'fs'
import unzipper from 'unzipper'

const exist = function (path: fs.PathLike): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if (err) reject(err)
      else resolve(stat)
    })
  })
}

const createDir = function (
  path: fs.PathLike,
  options?: fs.MakeDirectoryOptions & { recursive: true },
): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, options, (err, pathDir) => {
      if (err) reject(err)
      else resolve(pathDir)
    })
  })
}

const remove = function (path: fs.PathLike): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

const readFile = function (
  path: fs.PathLike | number,
  options?:
    | { encoding?: null | undefined; flag?: string | undefined }
    | undefined
    | null,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

const writeFile = function (
  path: fs.PathLike | number,
  data: string | NodeJS.ArrayBufferView,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

const unzip = function (path: string, destination: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(unzipper.Extract({ path: destination }))
      .on('error', reject)
    resolve(true)
  })
}

export default { exist, createDir, remove, readFile, writeFile, unzip }
