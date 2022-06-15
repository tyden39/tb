import { NextApiRequest, NextApiResponse } from 'next'

import { QuestionDataType } from 'interfaces/types'
import { query, queryWithTransaction } from 'lib/db'
import { getSession } from 'next-auth/client'
import { userInRight } from 'utils'
import { USER_ROLES } from 'interfaces/constants'
import { calcuQuestion } from '.'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!userInRight([USER_ROLES.Operator], session)) {
    return res.status(403).end('Forbidden')
  }
  const user: any = session.user

  switch (req.method) {
    case 'POST':
      return createQuestions()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function createQuestions() {
    const list: QuestionDataType[] = req.body
    try {
      const listQ: any[] = []
      const dateNow = new Date()
      for (const item of list) {
        listQ.push(() => [
          `INSERT INTO question (publisher, test_type, series, grade, cerf, format, types, skills, question_type, level, \`group\`, parent_question_description, parent_question_text, question_description, question_text, image, video, audio, answers, correct_answers, points, created_date, audio_script, created_by, total_question)
         VALUES (?)`,
          [
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
              dateNow,
              item.audio_script,
              user.id,
              calcuQuestion(item),
            ],
          ],
        ])
      }

      const result = await queryWithTransaction(listQ)

      if (result.length === 0) {
        throw Error('import failed')
      }
      return res.json(true)
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
