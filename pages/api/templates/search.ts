import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import TemplateApi from 'api/modules/templateAPI'

const handler: any = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return TemplateApi.filterTemplate(req, res)
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
