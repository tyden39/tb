import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fileUtils from '../../../utils/file'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await handleRequest(req, res)
    res.json(true)
  } catch (err) {
    res.status(500).json(err)
  }
}

const handleRequest = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) throw err
        await saveFile(files.file)
        resolve(true)
      } catch (ex: any) {
        reject(ex)
      }
    })
  })
}

const saveFile = async (file: any) => {
  const uploadPath = `./public/upload`
  await fileUtils.unzip(file.filepath, uploadPath)
  await fileUtils.remove(file.filepath)
}

export default handler
