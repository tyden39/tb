import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { query } from 'lib/db'
import { userInRight } from 'utils'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!userInRight([], session)) {
    return res.status(403).end('Forbidden')
  }

  switch (req.method) {
    case 'GET':
      return getUserById()
    case 'PUT':
      return changeStatus()
    case 'DELETE':
      return deleteUser()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getUserById() {
    const { id } = req.query
    try {
      if (!id) {
        return res.status(400).json({ message: '`id` required' })
      }
      const results = await query<any[]>(
        'SELECT id, user_name, email, is_admin, deleted, user_role_id FROM user WHERE id = ? LIMIT 1',
        [id],
      )
      if (results.length === 0) {
        return res.status(400).json({ message: 'data not found' })
      }
      return res.json(results[0])
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function changeStatus() {
    const { id } = req.query
    try {
      if (!id) {
        return res.status(400).json({ message: '`id` required' })
      }

      const result = await query<any>(
        'UPDATE user SET deleted = !deleted WHERE id = ?',
        [id],
      )
      res.json(result.affectedRows === 1)
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function deleteUser() {
    const { id } = req.query
    try {
      if (!id) {
        return res.status(400).json({ message: '`id` required' })
      }

      const result = await query<any>('DELETE FROM user WHERE id = ?', [id])
      res.json(result.affectedRows === 1)
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
