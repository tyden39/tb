import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { query } from 'lib/db'

const limit = 10

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const user: any = session?.user

  switch (req.method) {
    case 'POST':
      return filterUnittest(req, res)
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function filterUnittest(req: NextApiRequest, res: NextApiResponse) {
    try {
      // data
      const page: any = req?.body?.page || 0
      const name = req?.body?.name || ''
      const level = req?.body?.template_level_id || []
      const time = req?.body?.time || null
      const total_question = req?.body?.total_question || null
      const skill = req?.body?.skills || []
      const start_date = req?.body?.start_date
        ? new Date(req.body.start_date)
        : null
      const end_date = req?.body?.end_date ? new Date(req.body.end_date) : null
      const status = req?.body?.status || 'AL'
      const scope = req?.body?.scope || 0
      // filter conditions
      let unittestCondition = ''
      if (name) unittestCondition += ` AND (ut.name LIKE '%${name}%')`
      if (level.length > 0) {
        let levelStrArr = ''
        level.forEach(
          (item: string, i: number) =>
            (levelStrArr += `${i !== 0 ? ',' : ''}"${item}"`),
        )
        unittestCondition += ` AND ut.template_level_id IN (${levelStrArr})`
      }
      if (time) unittestCondition += ` AND ut.time = '${time}'`
      if (total_question)
        unittestCondition += ` AND ut.total_question = '${total_question}'`
      if (skill.length > 0) {
        let skillStrArr = ''
        skill.forEach(
          (item: string, i: number) =>
            (skillStrArr += `${i !== 0 ? ',' : ''}"${item}"`),
        )
        unittestCondition += ` AND uts.section IN (${skillStrArr})`
      }
      const d = new Date()
      const currentDate = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join(
        '-',
      )
      const startDate = start_date
        ? [
            start_date.getFullYear(),
            start_date.getMonth() + 1,
            start_date.getDate(),
          ].join('-')
        : null
      const endDate = end_date
        ? [
            end_date.getFullYear(),
            end_date.getMonth() + 1,
            end_date.getDate(),
          ].join('-')
        : null
      if (startDate)
        unittestCondition += ` AND DATE(ut.start_date) = '${startDate}'`
      if (endDate) unittestCondition += ` AND DATE(ut.end_date) = '${endDate}'`
      switch (status) {
        case 'AC':
          unittestCondition += ` AND DATE(ut.start_date) <= '${currentDate}' AND DATE(ut.end_date) >= '${currentDate}'`
          break
        case 'DI':
          unittestCondition += ` AND (DATE(ut.start_date) > '${currentDate}' OR DATE(ut.end_date) < '${currentDate}')`
          break
        default:
          break
      }
      switch (scope) {
        case 0:
          unittestCondition += ` AND ut.scope = 0`
          break
        case 1:
          unittestCondition += ` AND ut.scope = 1 AND ut.created_by = '${user.id}'`
          break
        case 2:
          unittestCondition += ` AND ut.scope = 1`
          break
        default:
          break
      }

      // templates
      const unitTests: any[] = await query(
        `SELECT ut.*, count(*) as totalSection, GROUP_CONCAT(uts.section) as sections FROM unit_test ut
        JOIN unit_test_section uts ON ut.id = uts.unit_test_id
        WHERE ut.deleted = 0 ${unittestCondition}
        GROUP BY ut.id
        ORDER BY ut.id DESC
        LIMIT ${limit} OFFSET ${parseInt(page) * limit}`,
        [user.id],
      )
      for (let i = 0; i < unitTests.length; i++) {
        const currentUnitTest = unitTests[i]
        const sections = await query<any>(
          `SELECT * FROM unit_test_section
          WHERE unit_test_id = ${currentUnitTest.id} AND deleted = 0`,
        )
        currentUnitTest.sections = sections.map((item: any) => ({
          id: item.id,
          name: item?.section ? item.section.split(',') : [],
        }))
      }

      // total templates
      const totalUnitTests: any[] = await query(
        `SELECT DISTINCT ut.id FROM unit_test ut
              JOIN unit_test_section uts ON ut.id = uts.unit_test_id
              WHERE ut.deleted = 0 ${unittestCondition}`,
      )

      // return data
      return res.status(200).json({
        unitTests,
        totalPages: Math.ceil(totalUnitTests.length / limit),
        currentPage: parseInt(page),
      })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
