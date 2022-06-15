import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { USER_ROLES } from 'interfaces/constants'
import { query } from 'lib/db'
import { userInRight } from 'utils'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  const user: any = session.user
  // if (!userInRight([USER_ROLES.Teacher], session)) {
  //   return res.status(403).end('Forbidden')
  // }
  //const user = { id: 'be6af6a4-42be-11ec-82a9-d8bbc10864fc' }

  switch (req.method) {
    case 'GET':
      return getUnitTestById()
    case 'DELETE':
      return deleteUnitTest()
    case 'PATCH':
      return updatePartialUnitTest()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getUnitTestById() {
    const { id } = req.query
    try {
      const session = await getSession({ req })
      const unitTests: any[] = await query<any[]>(
        'SELECT * FROM unit_test WHERE deleted = 0 AND id = ? LIMIT 1',
        [id],
      )
      if (unitTests.length > 0 && unitTests[0]?.id) {
        const scope = unitTests[0].scope || 0
        if (req.query?.mode === 'edit') {
          if (scope === 0) {
            const check = userInRight([USER_ROLES.Operator], session)
            if (!check)
              return res.json({ message: 'Not have access right', status: 403 })
          } else if (scope === 1) {
            const check = userInRight([USER_ROLES.Teacher], session)
            if (!check)
              return res.json({ message: 'Not have access right', status: 403 })
          }
        } else if (req.query?.mode === 'view') {
          if (scope === 1) {
            const check = userInRight([USER_ROLES.Teacher], session)
            if (!check)
              return res.json({ message: 'Not have access right', status: 403 })
          }
        }
      }
      const unitTest = unitTests[0]
      if (unitTests.length === 0) {
        return res.status(400).json({ message: 'data not found' })
      }
      const scope = unitTest.scope || 0
      if (req.query?.mode === 'edit') {
        if (scope === 0) {
          const check = userInRight([USER_ROLES.Operator], session)
          if (!check)
            return res.json({ message: 'Not have access right', status: 403 })
        } else if (scope === 1) {
          const check = userInRight([USER_ROLES.Teacher], session)
          if (!check)
            return res.json({ message: 'Not have access right', status: 403 })
        }
      } else if (req.query?.mode === 'view') {
        if (scope === 1) {
          const check = userInRight([USER_ROLES.Teacher], session)
          if (!check)
            return res.json({ message: 'Not have access right', status: 403 })
        }
      }
      const sections: any[] = await query<any[]>(
        'SELECT * FROM unit_test_section WHERE deleted = 0 AND unit_test_id = ?',
        [id],
      )
      if (sections.length > 0) {
        unitTest.sections = sections
      }
      const sectionIds = sections.map((m) => m.id)
      const parts: any[] = await query<any[]>(
        'SELECT * FROM unit_test_section_part WHERE deleted = 0 AND unit_test_section_id IN (?)',
        [sectionIds],
      )
      if (parts.length > 0) {
        for (const item of sections) {
          item.parts = parts.filter((m) => m.unit_test_section_id === item.id)
        }
      }
      const partIds = parts.map((m) => m.id)
      const questions: any[] = await query<any[]>(
        `SELECT utspq.unit_test_section_part_id, q.* FROM unit_test_section_part_question utspq
         LEFT JOIN question q ON utspq.question_id = q.id
         WHERE utspq.deleted = 0 AND utspq.unit_test_section_part_id IN (?)`,
        [partIds],
      )
      if (questions.length > 0) {
        for (const item of parts) {
          item.questions = questions.filter(
            (m) => m.unit_test_section_part_id === item.id,
          )
        }
      }
      return res.json({ data: unitTest, status: 200 })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function deleteUnitTest() {
    const { id } = req.query
    try {
      const result = await query<any>(
        `UPDATE unit_test SET deleted = 1 WHERE id = ? ${
          user.is_admin ? '' : 'AND created_by = ?'
        }`,
        [id, user.id],
      )
      res.json(result.affectedRows === 1)
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function updatePartialUnitTest() {
    const { id } = req.query
    const { is_publish } = req.body
    try {
      const result = await query<any>(
        `UPDATE unit_test SET is_publish = ? WHERE id = ? ${
          user.is_admin ? '' : 'AND created_by = ?'
        }`,
        [is_publish ?? false, id, user.id],
      )
      res.json(result.affectedRows === 1)
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
