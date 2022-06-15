import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { UserDataType } from 'interfaces/types'
import { query } from 'lib/db'
import { userInRight } from 'utils'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!userInRight([], session)) {
    return res.status(403).end('Forbidden')
  }

  switch (req.method) {
    case 'GET':
      return getRoles()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getRoles() {
    try {
      const results: any[] = await query<any[]>(
        `SELECT id, name FROM user_role WHERE deleted = 0`,
      )
      return res.json(results)
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
