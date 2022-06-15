import { NextApiRequest, NextApiResponse } from 'next'

import { UserDataType } from 'interfaces/types'
import { query } from 'lib/db'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return createUser()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function createUser() {
    const item: UserDataType = req.body
    try {
      const user = await query<any[]>(
        'SELECT 1 FROM user WHERE user_name = ? OR email = ? LIMIT 1',
        [item.user_name, item.user_name],
      )

      if (user.length > 0) {
        return res.json({
          isExist: true,
        })
      }
      return res.json({ isExist: false })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
