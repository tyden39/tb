import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { USER_ROLES } from 'interfaces/constants'
import { query, queryWithTransaction } from 'lib/db'
import { userInRight } from 'utils'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const user: any = session?.user
  if (!userInRight([USER_ROLES.Teacher], session)) {
    return res.status(403).end('Forbidden')
  }
  // const user = { id: 'be6af6a4-42be-11ec-82a9-d8bbc10864fc' }

  switch (req.method) {
    case 'GET':
      return getUnitTest()
    case 'POST':
      return createUnitTest()
    case 'PUT':
      return updateUnitTest()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getUnitTest() {
    const { page, limit } = req.query
    try {
      const results: any[] = await query<any[]>(
        `SELECT * FROM unit_test WHERE deleted = 0 
         ${user.is_admin ? '' : 'AND created_by = ?'} 
         ORDER BY created_date desc
         LIMIT ${limit} OFFSET ${
          parseInt(page.toString()) * parseInt(limit.toString())
        }`,
        [user.id],
      )
      const totals = await query<any[]>(
        `SELECT COUNT(*) as total FROM unit_test WHERE deleted = 0 
         ${user.is_admin ? '' : 'AND created_by = ?'}`,
        [user.id],
      )
      return res.json({
        data: results,
        totalRecords: totals[0].total,
      })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function createUnitTest() {
    const data = req.body
    const dateNow = new Date()
    const startDate = data?.start_date ? new Date(data.start_date) : null
    const endDate = data?.end_date ? new Date(data.end_date) : null
    try {
      const listIndex: any = { index: 0, sections: [] }
      let index = 0
      const listQ: any[] = [
        () => [
          `INSERT INTO unit_test(template_id, name, template_level_id, total_question, time, is_publish, created_by, created_date, total_point, start_date, end_date, scope) 
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            data.template_id,
            data.name,
            data.template_level_id,
            data.total_question ?? 0,
            data.time,
            data.is_publish ?? 0,
            user.id,
            dateNow,
            data.total_point,
            startDate,
            endDate,
            data?.scope || 0,
          ],
        ],
      ]
      data.sections.forEach((section: any, sectionIndex: number) => {
        listQ.push((r1: any, r2: any) => {
          return [
            `INSERT INTO unit_test_section(unit_test_id, section, modified_date) VALUES(?,?,?)`,
            [
              r2[listIndex.index].insertId,
              section?.section ? section.section.join(',') : '',
              dateNow,
            ],
          ]
        })
        index++
        listIndex.sections.push({ index, parts: [] })
        section.parts.forEach((part: any, partIndex: number) => {
          listQ.push((r1: any, r2: any) => {
            return [
              `INSERT INTO unit_test_section_part(unit_test_section_id, name, question_types, total_question, points, modified_date) 
               VALUES(?,?,?,?,?,?)`,
              [
                r2[listIndex.sections[sectionIndex].index].insertId,
                part.name,
                part.question_types,
                part.total_question,
                part.points,
                dateNow,
              ],
            ]
          })
          index++
          listIndex.sections[sectionIndex].parts.push({ index })
          listQ.push((r1: any, r2: any) => {
            return [
              `INSERT INTO unit_test_section_part_question(unit_test_section_part_id, question_id, modified_date) VALUES ?`,
              [
                part.questions.map((question: any) => [
                  r2[listIndex.sections[sectionIndex].parts[partIndex].index]
                    .insertId,
                  question,
                  dateNow,
                ]),
              ],
            ]
          })
          index++
        })
      })

      const result = await queryWithTransaction<any>(listQ)

      return res.json({ id: result[0].insertId, userId: user.id })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function updateUnitTest() {
    const data: any = req.body
    const dateNow = new Date()
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    try {
      const unitTest = await query<any>(
        `SELECT 1 FROM unit_test WHERE deleted = 0 AND created_by = ? AND id = ? LIMIT 1`,
        [user.id, data.id],
      )
      if (unitTest.length === 0) {
        return res.status(400).json({ message: 'data not found' })
      }
      const listIndex: any = { index: 0, sections: [] }
      let index = 1
      const listQ: any[] = [
        () => [
          `UPDATE unit_test SET name = ?, total_question = ?, time = ?, total_point = ?, start_date = ?, end_date = ?
           WHERE id = ?`,
          [
            data.name,
            data.total_question ?? 0,
            data.time,
            data.total_point,
            startDate,
            endDate,
            data.id,
          ],
        ],
      ]
      listQ.push(() => {
        return [
          `DELETE FROM unit_test_section WHERE unit_test_id = ?`,
          [data.id],
        ]
      })
      data.sections.forEach((section: any, sectionIndex: number) => {
        listQ.push((r1: any, r2: any) => {
          return [
            `INSERT INTO unit_test_section(unit_test_id, section, modified_date) VALUES(?,?,?)`,
            [
              data.id,
              section?.section ? section.section.join(',') : '',
              dateNow,
            ],
          ]
        })
        index++
        listIndex.sections.push({ index, parts: [] })
        section.parts.forEach((part: any, partIndex: number) => {
          listQ.push((r1: any, r2: any) => {
            return [
              `INSERT INTO unit_test_section_part(unit_test_section_id, name, question_types, total_question, points, modified_date) 
               VALUES(?,?,?,?,?,?)`,
              [
                r2[listIndex.sections[sectionIndex].index].insertId,
                part?.name || '',
                part.question_types,
                part.total_question,
                part.points,
                dateNow,
              ],
            ]
          })
          index++
          listIndex.sections[sectionIndex].parts.push({ index })
          listQ.push((r1: any, r2: any) => {
            return [
              `INSERT INTO unit_test_section_part_question(unit_test_section_part_id, question_id, modified_date) VALUES ?`,
              [
                part.questions.map((question: any) => [
                  r2[listIndex.sections[sectionIndex].parts[partIndex].index]
                    .insertId,
                  question,
                  dateNow,
                ]),
              ],
            ]
          })
          index++
        })
      })
      const result = await queryWithTransaction<any>(listQ)
      return res.json({ ...data, id: data.id })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
