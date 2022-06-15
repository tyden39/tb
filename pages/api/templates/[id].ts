import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import TemplateApi from 'api/modules/templateAPI'

const handler: any = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  switch (req.method) {
    case 'DELETE':
      return TemplateApi.deleteTemplateById(res, id)
    case 'GET':
      return TemplateApi.getTemplateById(req, res, id)
    case 'PUT':
      return TemplateApi.updateTemplateById(req, res, id)
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
