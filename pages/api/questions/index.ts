import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { USER_ROLES } from 'interfaces/constants'
import { QuestionDataType } from 'interfaces/types'
import { query } from 'lib/db'
import { userInRight } from 'utils'
import { PRACTICE_TEST_ACTIVITY } from 'interfaces/struct'
import { IncomingForm } from 'formidable'
import fileUtils from '../../../utils/file'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!userInRight([USER_ROLES.Operator, USER_ROLES.Teacher], session)) {
    return res.status(403).end('Forbidden')
  }
  const user: any = session.user
  const uploadPath = `./public/upload/${user.id}`

  switch (req.method) {
    case 'GET':
      return getQuestions()
    case 'POST':
      return createQuestion()
    case 'PUT':
      return updateQuestion()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getQuestions() {
    const { page, limit, p, s, g, sk, l, qt, q, m } = req.query
    try {
      const params: any[] = []
      let queryStr = 'SELECT * FROM question WHERE deleted = 0'
      let queryCount =
        'SELECT COUNT(*) as total FROM question WHERE deleted = 0'
      if (p) {
        queryStr += ' AND publisher IN (?)'
        queryCount += ' AND publisher IN (?)'
        params.push((p as String).split(','))
      }
      if (s) {
        queryStr += ' AND series IN (?)'
        queryCount += ' AND series IN (?)'
        params.push((s as String).split(','))
      }
      if (g) {
        queryStr += ' AND grade IN (?)'
        queryCount += ' AND grade IN (?)'
        params.push((g as String).split(','))
      }
      if (sk) {
        queryStr += ' AND skills IN (?)'
        queryCount += ' AND skills IN (?)'
        params.push((sk as String).split(','))
      }
      if (l) {
        queryStr += ' AND level IN (?)'
        queryCount += ' AND level IN (?)'
        params.push((l as String).split(','))
      }
      if (qt) {
        queryStr += ' AND question_type IN (?)'
        queryCount += ' AND question_type IN (?)'
        params.push((qt as String).split(','))
      }
      if (q) {
        const qFormat = `%${q
          .toString()
          .replace(/\%/g, '\\%')
          .replace(/\_/g, '\\_')}%`
        queryStr += ' AND (question_text LIKE ? OR question_description LIKE ?)'
        queryCount +=
          ' AND (question_text LIKE ? OR question_description LIKE ?)'
        params.push(qFormat)
        params.push(qFormat)
      }
      const scopeId = m === '1' ? 1 : 0
      queryStr += ` AND scope = ${scopeId}`
      queryCount += ` AND scope = ${scopeId}`
      if (scopeId === 1) {
        if (!user.is_admin) {
          queryStr += ' AND created_by = ?'
          queryCount += ' AND created_by = ?'
          params.push(user.id)
        }
      }

      const results: any[] = await query<any[]>(
        `${queryStr} ORDER BY created_date desc
         LIMIT ${limit} OFFSET ${
          parseInt(page.toString()) * parseInt(limit.toString())
        }`,
        params,
      )
      const totals = await query<any[]>(queryCount, params)
      return res.json({
        data: results,
        totalRecords: totals[0].total,
      })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function createQuestion() {
    try {
      const item: any = await handleRequest(req)
      if (!item.question_type) {
        return res.status(400).json({ message: '`question type` are required' })
      }
      if (item.image_file) {
        await saveFile(
          item.image_file.filepath,
          uploadPath,
          item.image_file.originalFilename,
        )
        item.image = `${user.id}/${item.image_file.originalFilename}`
      }
      if (item.audio_file) {
        await saveFile(
          item.audio_file.filepath,
          uploadPath,
          item.audio_file.originalFilename,
        )
        item.audio = `${user.id}/${item.audio_file.originalFilename}`
      }
      const isSystem = userInRight([USER_ROLES.Operator], session)
      const result = await query<any>(
        `INSERT INTO question (publisher, test_type, series, grade, cerf, format, types, skills, question_type, 
          level, \`group\`, parent_question_description, parent_question_text, question_description, question_text, 
          image, video, audio, answers, correct_answers, points, created_date, audio_script, created_by, scope, total_question)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          item.publisher ?? 'NA',
          item.test_type,
          item.series ?? 'NA',
          item.grade,
          item.cerf ?? 'NA',
          item.format ?? 'NA',
          item.types ?? 'NA',
          item.skills,
          item.question_type,
          item.level ?? 'NA',
          item.group,
          item.parent_question_description,
          item.parent_question_text,
          item.question_description,
          item.question_text,
          item.image,
          item.video,
          item.audio,
          item.answers,
          item.correct_answers,
          item.points ?? 0,
          new Date(),
          item.audio_script,
          user.id,
          isSystem ? 0 : 1,
          calcuQuestion(item),
        ],
      )
      if (result.affectedRows !== 1) {
        throw Error('insert failed')
      }
      return res.json({ id: result.insertId })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function updateQuestion() {
    try {
      const item: any = await handleRequest(req)
      if (!item.question_type) {
        return res.status(400).json({ message: '`question type` are required' })
      }
      if (item.image_file) {
        await saveFile(
          item.image_file.filepath,
          uploadPath,
          item.image_file.originalFilename,
        )
        item.image = `${user.id}/${item.image_file.originalFilename}`
      }
      if (item.audio_file) {
        await saveFile(
          item.audio_file.filepath,
          uploadPath,
          item.audio_file.originalFilename,
        )
        item.audio = `${user.id}/${item.audio_file.originalFilename}`
      }
      const result = await query<any>(
        `UPDATE question SET publisher = ?, test_type = ?, series = ?, grade = ?, cerf = ?,
         format = ?, types = ?, skills = ?, question_type = ?, level = ?, \`group\` = ?, 
         question_description = ?, question_text = ?, image = ?, video = ?, audio = ?, 
         answers = ?, correct_answers = ?, points = ?, parent_question_description = ?, 
         parent_question_text = ?, audio_script = ?, total_question = ? WHERE id = ? ${
           user.is_admin ? '' : ` AND created_by = '${user.id}'`
         }`,
        [
          item.publisher ?? 'NA',
          item.test_type,
          item.series ?? 'NA',
          item.grade,
          item.cerf ?? 'NA',
          item.format ?? 'NA',
          item.types ?? 'NA',
          item.skills,
          item.question_type,
          item.level ?? 'NA',
          item.group,
          item.question_description,
          item.question_text,
          item.image,
          item.video,
          item.audio,
          item.answers,
          item.correct_answers,
          item.points ?? 0,
          item.parent_question_description,
          item.parent_question_text,
          item.audio_script,
          calcuQuestion(item),
          item.id,
        ],
      )
      if (result.affectedRows !== 1) {
        throw Error('update failed')
      }
      return res.json({ ...item, created_by: user.is_admin ? null : user.id })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler

export const calcuQuestion = (question: QuestionDataType) => {
  let total = 1
  const questionType = PRACTICE_TEST_ACTIVITY[question.question_type]
  const questionList = question.question_text?.split('#')
  const answerList = question.answers?.split('#')
  const correctAnswerList = question.correct_answers?.split('#')
  try {
    if (questionType === 1) {
      total = 1
    } else if (questionType === 11) {
      total = questionList.length
    } else if (questionType === 2) {
      total = questionList.length
    } else if (questionType === 3) {
      total = correctAnswerList.length
    } else if (questionType === 4) {
      total = answerList.length
    } else if (questionType === 5) {
      total = questionList.length
    } else if (questionType === 6) {
      total = answerList.length
    } else if (questionType === 7) {
      total = 1
    } else if (questionType === 8) {
      total = answerList.length
    } else if (questionType === 9) {
      const partLeft = answerList[0].split('*')
      total = partLeft.length
    } else if (questionType === 12 || questionType === 13) {
      total = correctAnswerList.length
    } else if (questionType === 14) {
      total = correctAnswerList.length
    } else if (questionType === 15) {
      total = answerList.length
    }
  } catch (ex) {}
  return total
}

const handleRequest = (req: NextApiRequest) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err)
      resolve({ ...fields, ...files })
    })
  })
}

const saveFile = async (
  filePath: string,
  pathDes: string,
  fileName: string,
) => {
  let file = null
  try {
    file = await fileUtils.exist(pathDes)
  } catch {}
  if (!file) {
    fileUtils.createDir(pathDes, { recursive: true })
  }
  const fileData = await fileUtils.readFile(filePath)
  return await fileUtils.writeFile(`${pathDes}/${fileName}`, fileData)
}
