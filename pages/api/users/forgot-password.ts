import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { UserDataType } from 'interfaces/types'
import { query } from 'lib/db'
import { userInRight } from 'utils'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('API===', req)
  switch (req.method) {
    case 'PUT':
      return changePassword()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function changePassword() {
    const item: UserDataType = req.body
    console.log('ITEM====', item)
    try {
      const salt = await bcrypt.genSalt(10)
      const password = await bcrypt.hash(item.password, salt)

      const result = await query<any>(
        `UPDATE user SET salt = ?, password = ? WHERE user_name = ?`,
        [salt, password, item.user_name],
      )

      if (result.affectedRows !== 1) {
        throw Error('insert failed')
      }
      return res.json({ isSuccess: true })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
