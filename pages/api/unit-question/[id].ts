import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { USER_ROLES } from 'interfaces/constants'
import { PRACTICE_TEST_ACTIVITY, SKILLS_SELECTIONS } from 'interfaces/struct'
import { query } from 'lib/db'
import { userInRight } from 'utils'

let baseHostUrl = ''

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getSession({ req })
  // if (!userInRight([USER_ROLES.Operator], session)) {
  //   return res.status(403).end('Forbidden')
  // }
  baseHostUrl = req.headers.referer.split('/').splice(0, 3).join('/')

  switch (req.method) {
    case 'GET':
      return getDataById()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getDataById() {
    const { id } = req.query
    try {
      const unitTests: any[] = await query<any[]>(
        'SELECT * FROM unit_test WHERE id = ? LIMIT 1',
        [id],
      )
      if (unitTests.length === 0) {
        return res.status(400).json({ message: 'data not found' })
      }
      const unitTest = unitTests[0]
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
      return res.json(convertDataToPracticeTest(unitTest))
    } catch (e: any) {
      console.log(e)
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler

const convertDataToPracticeTest = (unitTest: any) => {
  const sectionNames: any = {}
  SKILLS_SELECTIONS.map((value: any) => {
    sectionNames[value.code] = value.display
  })

  const data: any = {
    name: unitTest.name,
    time: unitTest.time,
    sections: [],
  }
  for (const item of unitTest.sections) {
    data.sections.push({
      id: item.id,
      name: item.parts[0].name,
      totalGroup: 1,
      totalPoint: item.parts[0].points,
      list: item.parts[0].questions.map(convertQuestion),
      code: item.section,
    })
  }
  return data
}

const convertQuestion = (question: any) => {
  const questionType = PRACTICE_TEST_ACTIVITY[question.question_type]
  const questionList = question.question_text?.split('#')
  const answerList = question.answers?.split('#')
  const correctAnswerList = question.correct_answers?.split('#')
  const result = {
    id: question.id,
    activityType: questionType,
    audioInstruction: getFullUrl(question.audio),
    audioScript: question.audio_script,
    imageInstruction: getFullUrl(question.image),
    instruction: question.question_description,
    questionInstruction: '',
    totalQuestion: correctAnswerList.length,
    listContent: [{}],
  }

  if (questionType === 1) {
    result.listContent = answerList.map(
      (answers: any, answerIndex: number) => ({
        id: question.id,
        activityType: questionType,
        question: questionList ? questionList[answerIndex] : '',
        answers: answers.split('*').map((answer: any) => ({
          text: answer,
          isCorrect: answer === correctAnswerList[answerIndex],
        })),
      }),
    )
  } else if (questionType === 11) {
    result.instruction = question.parent_question_description
    result.questionInstruction = question.parent_question_text
    result.listContent = [
      {
        questionsGroup: questionList.map((qt: any, qtIndex: number) => {
          const answers = answerList[qtIndex].split('*')
          return {
            id: question.id,
            question: qt,
            activityType: questionType,
            answers: answers.map((answer: any) => ({
              text: answer,
              isCorrect: answer === correctAnswerList[qtIndex],
            })),
          }
        }),
      },
    ]
  } else if (questionType === 2) {
    result.listContent = questionList.map((ql: any, qlIndex: number) => {
      const answers = answerList[qlIndex].split('*')
      return {
        id: question.id,
        activityType: questionType,
        question: ql,
        answers: answers.map((answer: any) => ({
          word: answer.toUpperCase(),
          answerList: correctAnswerList[qlIndex],
        })),
      }
    })
  } else if (questionType === 3) {
    result.listContent = questionList.map((ql: any, qlIndex: number) => {
      return {
        id: question.id,
        activityType: questionType,
        question: ql,
        answers: correctAnswerList.map((ca: any, caIndex: number) => ({
          answer: ca.replaceAll('%/%', '/'),
          position: caIndex,
        })),
      }
    })
  } else if (questionType === 4) {
    result.listContent = answerList.map((al: any, alIndex: number) => {
      const answers = al.split('*')
      return {
        id: question.id,
        activityType: questionType,
        answers: answers.map((answer: any) => ({
          text: answer,
          isCorrect: answer.replace(/%/g, '') === correctAnswerList[alIndex],
        })),
      }
    })
  } else if (questionType === 5) {
    result.listContent = questionList.map((ql: any, qlIndex: number) => {
      return {
        id: question.id,
        activityType: questionType,
        question: ql,
        answers: answerList.map((answer: any, answerIndex: number) => ({
          answer: correctAnswerList[qlIndex],
          answerList: answer.replaceAll('*', '/'),
          position: answerIndex,
        })),
      }
    })
  } else if (questionType === 6) {
    result.listContent = answerList.map((al: any, alIndex: number) => {
      const correctAnswers = correctAnswerList[alIndex].split('%/%')
      const correctOrders = correctAnswers.map((answer: any) => {
        return answer.trim().split('*')
      })
      return {
        id: question.id,
        activityType: questionType,
        question: al.replaceAll('*', '/'),
        answer: correctAnswers.map((answer: any) => {
          return answer
            .trim()
            .replaceAll('*', ' ')
            .replaceAll(' .', '.')
            .replaceAll(' !', '!')
            .replaceAll('%/%', '/')
        })[0],
        answerOrder: correctOrders,
      }
    })
  } else if (questionType === 7) {
    result.listContent = [
      {
        id: question.id,
        activityType: questionType,
        question: questionList[0]?.replaceAll('%u%', '%u'),
        answers: [
          {
            start: answerList ? answerList[0] : '',
            answer: correctAnswerList[0],
          },
        ],
      },
    ]
  } else if (questionType === 8) {
    result.questionInstruction = question.question_text
    result.listContent = [
      {
        id: question.id,
        activityType: questionType,
        answers: answerList.map((answer: any, answerIndex: number) => ({
          text: answer,
          isCorrect: correctAnswerList[answerIndex] === 'T',
        })),
      },
    ]
  } else if (questionType === 9) {
    result.questionInstruction = question.question_text
    const partLeft = answerList[0].split('*')
    const partRight = answerList[1].split('*')
    result.listContent = [
      {
        id: question.id,
        activityType: questionType,
        answers: partRight.map((pr: any, prIndex: number) => ({
          left: partLeft[prIndex],
          right: pr,
          rightAnswerPosition: partRight.findIndex(
            (m: any) => m === correctAnswerList[prIndex],
          ),
        })),
      },
    ]
  } else if (questionType === 12 || questionType === 13) {
    result.listContent = [
      {
        id: question.id,
        activityType: questionType,
        answers: answerList.map((as: any) => ({
          text: as,
          isCorrect: correctAnswerList.includes(as),
        })),
      },
    ]
  } else if (questionType === 14) {
    result.listContent = [
      {
        id: question.id,
        activityType: questionType,
        answers: [
          {
            answers: correctAnswerList,
          },
        ],
      },
    ]
  } else if (questionType === 15) {
    const answerValues: any = { T: 'TRUE', F: 'FALSE', NI: 'NI' }
    result.questionInstruction = question.question_text ?? ''
    result.listContent = [
      {
        id: question.id,
        activityType: questionType,
        answers: answerList.map((as: any, asIndex: number) => ({
          text: as,
          answer: answerValues[correctAnswerList[asIndex]],
          answerList: Object.values(answerValues).join('/'),
        })),
      },
    ]
  }
  return result
}

const getFullUrl = (url: string) => {
  let result = ''
  if (url != null && url != '') {
    return `${baseHostUrl}/upload/${url}`
  }
  return result
}
