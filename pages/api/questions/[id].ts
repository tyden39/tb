import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { USER_ROLES } from 'interfaces/constants'
import { query } from 'lib/db'
import { userInRight } from 'utils'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!userInRight([USER_ROLES.Operator, USER_ROLES.Teacher], session)) {
    return res.status(403).end('Forbidden')
  }

  switch (req.method) {
    case 'GET':
      return getQuestionById()
    case 'DELETE':
      return deleteQuestion()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getQuestionById() {
    const { id } = req.query
    try {
      if (!id) {
        return res.status(400).json({ message: '`id` required' })
      }
      const results = await query<any[]>(
        'SELECT * FROM question WHERE id = ? LIMIT 1',
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

  async function deleteQuestion() {
    const { id } = req.query
    try {
      if (!id) {
        return res.status(400).json({ message: '`id` required' })
      }

      const result = await query<any>(
        'UPDATE question SET deleted = 1 WHERE id = ?',
        [id],
      )
      res.json(result.affectedRows === 1)
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
