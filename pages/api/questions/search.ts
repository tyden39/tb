import { NextApiRequest, NextApiResponse } from 'next'

//import { QuestionDataType } from 'interfaces/types'
import { getSession } from 'next-auth/client'

import { USER_ROLES } from 'interfaces/constants'
import { query } from 'lib/db'
import { userInRight } from 'utils'

// type BodyData = {
//   publisher: string
//   test_type: string
//   series: string
//   grade: string
//   cerf: string
//   format: string
//   types: string
//   skill: string
//   question_type: string
//   page: number
// }

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const user: any = session.user
  if (!userInRight([USER_ROLES.Operator, USER_ROLES.Teacher], session)) {
    return res.status(403).end('Forbidden')
  }

  switch (req.method) {
    case 'POST':
      return getQuestions()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getQuestions() {
    const data: any = req.body
    const pageSize = data.limit ?? 10
    const params = []
    const exceptProps = ['page', 'search', 'sid', 'scope', 'excludeId']
    console.log(data)
    try {
      let queryStr = `SELECT * FROM question 
                      WHERE (deleted = 0 OR id IN (?))`
      let queryStrTotal = `SELECT COUNT(*) as total FROM question
                           WHERE (deleted = 0 OR id IN (?))`
      params.push(data.sid?.length === 0 ? [0] : data.sid)
      if (data?.excludeId) {
        queryStr += ` AND id NOT IN (?)`
        queryStrTotal += ` AND id NOT IN (?)`
        params.push(data.excludeId)
      }
      for (const prop in req.body) {
        if (!exceptProps.some((m) => m === prop)) {
          if (data[prop]) {
            if (!Array.isArray(data[prop])) {
              queryStr += ` AND ${prop} = ?`
              queryStrTotal += ` AND ${prop} = ?`
            } else {
              queryStr += ` AND ${prop} IN (?)`
              queryStrTotal += ` AND ${prop} IN (?)`
            }
            params.push(data[prop])
          }
        }
      }
      if (data.search) {
        queryStr += ` AND (\`group\` LIKE ? OR question_text LIKE ? OR question_description LIKE ?)`
        queryStrTotal += ` AND (\`group\` LIKE ? OR question_text LIKE ? OR question_description LIKE ?)`
        const searchValue = `%${data.search}%`
        params.push(searchValue)
        params.push(searchValue)
        params.push(searchValue)
      }
      let tempQuery = ''
      if (!data.scope || data.scope.includes('0')) {
        tempQuery += 'scope = 0'
      }
      if (!data.scope || data.scope.includes('1')) {
        tempQuery += `${
          tempQuery != '' ? ' OR' : ''
        } (scope = 1 AND created_by = ?)`
        params.push(user.id)
      }
      queryStr += ` AND (${tempQuery})`
      queryStrTotal += ` AND (${tempQuery})`

      queryStr += ' ORDER BY created_date desc'
      if (data.page !== undefined) {
        queryStr += ` LIMIT ${pageSize} OFFSET ${data.page * pageSize}`
      }
      const total = await query<any[]>(queryStrTotal, params)
      const results: any[] = await query<any[]>(queryStr, params)
      return res.json({
        data: results,
        totalPage: Math.ceil(total[0].total / pageSize),
        totalRecords: total[0].total,
      })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
