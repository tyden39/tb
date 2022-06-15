import { NextApiResponse, NextApiRequest } from 'next'
import { getSession } from 'next-auth/client'

import { USER_ROLES } from 'interfaces/constants'
import { query } from 'lib/db'
import { userInRight } from 'utils'

const limit = 10

class TEMPLATE_API {
  async createTemplate(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req })
    const checkUserInRight = userInRight([USER_ROLES.Operator], session)
    const user: any = session.user
    try {
      const name = req.body?.name || ''
      const templateLevelId = req.body?.template_level_id || ''
      const totalQuestion = req.body?.total_question || 0
      const totalPoint = req.body?.total_point || 0
      const time = req.body?.time || 0
      const deleted = 0
      const status = 1
      const createdDate = new Date()
      const createdBy = user.id
      const scope = checkUserInRight ? 0 : 1
      const sections = req.body?.sections || []

      const newTemplate = await query<any>(
        `INSERT INTO template (name, template_level_id, total_question, total_point, time, deleted, status, created_date, created_by, scope)
        VALUES(?,?,?,?,?,?,?,?,?,?)`,
        [
          name,
          templateLevelId,
          totalQuestion,
          totalPoint,
          time,
          deleted,
          status,
          createdDate,
          createdBy,
          scope,
        ],
      )
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const sectionResult = await query<any>(
          'INSERT INTO template_section (template_id, section_id, deleted) VALUES(?,?,?)',
          [
            newTemplate.insertId,
            section?.section_id ? section.section_id.join(',') : '',
            0,
          ],
        )
        for (let j = 0; j < section.parts.length; j++) {
          const part = section.parts[j]
          await query(
            'INSERT INTO template_section_part (template_section_id, name, question_types, total_question, points) VALUES(?,?,?,?,?)',
            [
              sectionResult.insertId,
              part?.name || '',
              part?.question_types || '',
              part?.total_question || 0,
              part?.points || 0,
            ],
          )
        }
      }
      return res
        .status(200)
        .json({ message: 'Insert successfully!', status: 200 })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  // ======================================================
  // ======================================================
  // ======================================================

  async deleteTemplateById(res: NextApiResponse, id: any) {
    try {
      await query('UPDATE template SET deleted = 1 WHERE id = ?', [id])
      return res.json({ message: 'Delete successfully', status: 200 })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  // ======================================================
  // ======================================================
  // ======================================================
  async filterTemplate(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req })
    const user: any = session.user
    try {
      // data
      const id: any = req?.body?.id || null
      const page: any = req?.body?.page || 0
      const name = req?.body?.name || ''
      const level = req?.body?.level || []
      const skill = req?.body?.skill || ''
      const time = req?.body?.time || 0
      const total_questions = req?.body?.totalQuestions || 0
      const scope = req?.body?.scope || 0
      // filter conditions
      let templateCondition = ''
      if (id) templateCondition += ` AND t.id = ${id}`
      if (name)
        templateCondition += ` AND (
                                t.name = '${name}' 
                                OR t.name LIKE '% ${name}%' 
                                OR t.name LIKE '% ${name} %' 
                                OR t.name LIKE '%${name} %'
                              )`
      if (level.length > 0) {
        let levelStrArr = ''
        level.forEach(
          (item: string, i: number) =>
            (levelStrArr += `${i !== 0 ? ',' : ''}"${item}"`),
        )
        templateCondition += ` AND t.template_level_id IN (${levelStrArr})`
      }
      if (skill.length > 0) {
        let skillStrArr = ''
        skill.forEach(
          (item: string, i: number) =>
            (skillStrArr += `${i !== 0 ? ',' : ''}"${item}"`),
        )
        templateCondition += ` AND ts.section_id IN (${skillStrArr})`
      }
      if (time) templateCondition += ` AND t.time = '${time}'`
      if (total_questions)
        templateCondition += ` AND t.total_question = '${total_questions}'`
      switch (scope) {
        case 0:
          templateCondition += ` AND t.scope = 0`
          break
        case 1:
          templateCondition += ` AND t.scope = 1 AND t.created_by = '${user.id}'`
          break
        case 2:
          templateCondition += ` AND t.scope = 1`
          break
        case 3:
        default:
          templateCondition += ` AND (t.scope = 0 OR t.created_by = '${user.id}')`
          break
      }
      // templates
      const templates: any[] = await query(
        `SELECT t.*, count(*) as totalSection, GROUP_CONCAT(ts.section_id) as sections FROM template t
        JOIN template_section ts ON t.id = ts.template_id
        WHERE t.deleted = 0 ${templateCondition}
        GROUP BY t.id
        ORDER BY t.id DESC
        LIMIT ${limit} OFFSET ${parseInt(page) * limit}`,
      )
      for (let i = 0; i < templates.length; i++) {
        const currentTemplate = templates[i]
        const countUnitTestOnTemplate = await query<any>(`
          SELECT COUNT(*) as total FROM unit_test 
          WHERE template_id = ${currentTemplate.id} AND deleted = 0
        `)
        currentTemplate.total_unit_test = countUnitTestOnTemplate?.total || 0
        const sections = await query<any>(
          `SELECT * FROM template_section
          WHERE template_id = ${currentTemplate.id} AND deleted = 0`,
        )
        currentTemplate.sections = sections.map((item: any) => ({
          id: item.id,
          name: item.section_id,
        }))
      }
      // total templates
      const totalTemplates: any[] = await query(
        `SELECT DISTINCT t.id FROM template t
              JOIN template_section ts ON t.id = ts.template_id
              WHERE t.deleted = 0 ${templateCondition}`,
      )
      // return data
      return res.status(200).json({
        templates,
        totalPages: Math.ceil(totalTemplates.length / limit),
        currentPage: parseInt(page),
      })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  // ======================================================
  // ======================================================
  // ======================================================

  async getOriginData(res: NextApiResponse) {
    try {
      const results = await Promise.all([
        query('SELECT * FROM template_level'),
        query(
          'SELECT * FROM section WHERE deleted = 0 ORDER BY created_date desc',
        ),
      ])
      const [levelList, sectionList] = results
      return res.json({ sectionList, levelList })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  // ======================================================
  // ======================================================
  // ======================================================

  async getTemplates(req: NextApiRequest, res: NextApiResponse) {
    try {
      const page: any = req?.query?.page || 0
      // templates
      const templates: any[] = await query(
        `SELECT * FROM template
        WHERE deleted = 0 
        LIMIT ? OFFSET ?`,
        [limit, parseInt(page) * limit],
      )
      // section by template
      for (let i = 0; i < templates.length; i++) {
        const currentTemplate = templates[i]
        const sections: any[] = await query(
          `SELECT * FROM template_section
          WHERE template_id = ? AND deleted = 0
          `,
          [currentTemplate.id],
        )
        currentTemplate.sections = sections.map((item) => ({
          id: item.id,
          name: item.section_id,
        }))
      }
      // total page
      const totalPages = await query<any[]>(
        'SELECT COUNT(*) as total FROM template WHERE deleted = 0',
      )
      return res.status(200).json({
        templates,
        totalPages: totalPages[0]?.total
          ? Math.ceil(totalPages[0].total / limit)
          : 1,
        currentPage: parseInt(page),
      })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  // ======================================================
  // ======================================================
  // ======================================================

  async getTemplateById(req: NextApiRequest, res: NextApiResponse, id: any) {
    try {
      if (!id) return res.status(400).json({ message: '`id` required' })

      const session = await getSession({ req })
      const templates = await query<any>(
        'SELECT * FROM template WHERE id = ? AND deleted = 0',
        [id],
      )
      const templateResult: any[] = []
      if (templates.length > 0 && templates[0]?.id) {
        const templateId = templates[0].id
        const scope = templates[0].scope || 0
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
        if (templateId) {
          const sections = await query<any>(
            'SELECT * FROM template_section WHERE template_id = ? AND deleted = 0',
            [templateId],
          )
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i]
            const sectionResult = Object.create({})
            sectionResult.id = section.id
            sectionResult.section_id = section.section_id.split(',')
            const parts = await query<any>(
              'SELECT * FROM template_section_part WHERE template_section_id = ?',
              [section.id],
            )
            sectionResult.parts = parts || []
            templateResult.push(sectionResult)
          }
        }
        templates[0].sections = templateResult
        return res.json({ data: templates[0] || null, status: 200 })
      } else return res.json({ message: 'Not found', status: 404 })
    } catch (e: any) {
      res.status(500).json({ message: e.message, status: 500 })
    }
  }

  // ======================================================
  // ======================================================
  // ======================================================

  async updateTemplateById(req: NextApiRequest, res: NextApiResponse, id: any) {
    try {
      if (!id) {
        return res
          .status(422)
          .json({ message: 'Tempalte not found', status: 422 })
      }

      const currentTemplate = req.body
      const isOnlyTemplate: boolean = req.body?.isQuickEdit || false

      if (!isOnlyTemplate) {
        // DELETE CURRENT SECTIONS AND PARTS
        // get sections
        const sectionList: any = await query(
          `SELECT * FROM template_section WHERE template_id = ${id}`,
        )
        // delete parts
        for (let i = 0; i < sectionList.length; i++) {
          const section = sectionList[i]
          if (section?.id)
            await query(
              `DELETE FROM template_section_part WHERE template_section_id = ${section.id}`,
            )
        }
        // delete sections
        await query(`DELETE FROM template_section WHERE template_id = ${id}`)
        // *********************************
      }

      // UPDATE TEMPLATE AND ADD NEW SECTIONS + PARTS
      // collect data
      const name = currentTemplate?.name || ''
      const level = currentTemplate?.template_level_id || ''
      const time = currentTemplate?.time || 0
      const totalQuestion = currentTemplate?.total_question || 0
      const point = currentTemplate?.total_point || 0
      const activate = [true, false].includes(currentTemplate?.status)
        ? currentTemplate.status
        : null
      const sections = currentTemplate?.sections || []
      // get update query template
      let templateQueryConditionStr = ''
      if (name) templateQueryConditionStr += `, name = '${name}'`
      if (level) templateQueryConditionStr += `, template_level_id = '${level}'`
      if (time) templateQueryConditionStr += `, time = ${time}`
      if (totalQuestion)
        templateQueryConditionStr += `, total_question = ${totalQuestion}`
      if (point) templateQueryConditionStr += `, total_point = ${point}`
      if (activate !== null)
        templateQueryConditionStr += `, status = ${activate ? 1 : 0}`
      // remove first <, >
      templateQueryConditionStr = templateQueryConditionStr.replace(', ', '')
      // update template
      if (templateQueryConditionStr)
        await query(
          `UPDATE template SET ${templateQueryConditionStr} WHERE id = ${id}`,
        )

      // insert sections
      if (!isOnlyTemplate)
        for (let i = 0; i < sections.length; i++) {
          const currentSection = sections[i] || null
          if (currentSection) {
            const newSection = await query<any>(
              `INSERT INTO template_section (template_id, section_id, deleted) VALUES(?,?,?)`,
              [
                id,
                currentSection?.section_id
                  ? currentSection.section_id.join(',')
                  : '',
                0,
              ],
            )
            // insert parts
            for (let j = 0; j < currentSection.parts.length; j++) {
              const currentPart = currentSection.parts[j]
              if (newSection?.insertId) {
                await query(
                  'INSERT INTO template_section_part (template_section_id, name, question_types, total_question, points) VALUES(?,?,?,?,?)',
                  [
                    newSection.insertId,
                    currentPart?.name || '',
                    currentPart?.question_types &&
                    Array.isArray(currentPart.question_types)
                      ? currentPart.question_types.join(',')
                      : '',
                    currentPart?.total_question || 0,
                    currentPart?.points || 0,
                  ],
                )
              }
            }
          }
        }
      // *********************************
      return res
        .status(200)
        .json({ message: 'Update successfully!', status: 200 })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

const TemplateApi = new TEMPLATE_API()

export default TemplateApi
