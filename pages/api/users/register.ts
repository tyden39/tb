import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { UserDataType } from 'interfaces/types'
import { query } from 'lib/db'
import { userInRight } from 'utils'

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
      let salt = null
      let password = null
      if (item.password) {
        salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(item.password, salt)
      }

      const newId = (await query<any[]>('SELECT uuid() as newId'))[0].newId

      const user = await query<any[]>(
        'SELECT 1 FROM user WHERE user_name = ? LIMIT 1',
        [item.user_name],
      )

      if (user.length > 0) {
        return res.json({
          error: true,
          message: 'Tên đang nhập đã được sử dụng',
        })
      }

      const result = await query<any>(
        `INSERT INTO user (id, user_name, email, password, salt, user_role_id, created_date)
                   VALUES (?,?,?,?,?,?,?)`,
        [
          newId,
          item.user_name,
          item.email,
          password,
          salt,
          item.user_role_id,
          new Date(),
        ],
      )

      if (result.affectedRows !== 1) {
        throw Error('insert failed')
      }
      return res.json({ id: newId })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
