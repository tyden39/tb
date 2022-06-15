import { useEffect, useRef, useState } from 'react'

import ContentEditable from 'react-contenteditable'

type PropType = {
  answerStr: string
  correctStr: string
  styleBold?: boolean
  className?: string
  onChange: (data: any) => void
}

export default function FillInBlank5Table({
  answerStr,
  correctStr,
  className = '',
  onChange,
}: PropType) {
  const [answers, setAnswers] = useState<Answer[]>(
    correctStr?.split('#')?.map((m, mIndex) => ({
      id: `${Math.random()}_${mIndex}`,
      texts: m.split('*').map((g, gIndex) => ({
        id: `${Math.random()}_${gIndex}`,
        text: g,
      })),
    })),
  )

  const isInit = useRef(true)

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false
    } else {
      if (typeof onChange === 'function') {
        onChange({
          correct_answers: answers
            .map((m) => m.texts.map((g) => g.text).join('*'))
            .join('#'),
        })
      }
    }
  }, [answers])

  const onAddAnswer = () => {
    if (answers) {
      setAnswers([
        ...answers,
        {
          id: `${Math.random()}_${answers?.length ?? 1}`,
          texts: [{ id: `${Math.random()}_1}`, text: '' }],
        },
      ])
    } else {
      setAnswers([
        {
          id: `${Math.random()}_${answers?.length ?? 1}`,
          texts: [{ id: `${Math.random()}_1}`, text: '' }],
        },
      ])
    }

    setTimeout(() => {
      const el = document.querySelector(
        `table tbody tr:nth-child(${(answers?.length ?? 0) + 1}) td input`,
      ) as HTMLInputElement
      el?.focus()
    }, 0)
  }

  const onChangeText = (answerIndex: number, index: number, event: any) => {
    const el: HTMLInputElement = event.currentTarget
    answers[answerIndex].texts[index].text = el.value
    setAnswers([...answers])
  }

  const onDeleteAnswer = (answerIndex: number, index: number) => {
    answers[answerIndex].texts.splice(index, 1)
    setAnswers(answers.filter((m) => m.texts.length > 0))
  }

  const onAddExtraAnswer = (answerIndex: number) => {
    answers[answerIndex].texts.push({
      id: `${Math.random()}_${answers[answerIndex].texts.length}}`,
      text: '',
    })
    setAnswers([...answers])

    setTimeout(() => {
      const el = document.querySelector(
        `table tbody tr:nth-child(${answerIndex + 1}) td:nth-child(${
          answers[answerIndex].texts.length + 1
        }) input`,
      ) as HTMLInputElement
      el?.focus()
    }, 0)
  }

  const maxLength =
    answers?.map((m) => m.texts.length).sort((a, b) => b - a)[0] ?? 1

  return (
    <table className={`question-table fill-in-blank-5 ${className}`}>
      <thead>
        <tr>
          <th></th>
          <th colSpan={maxLength} align="left">
            Câu hỏi và đáp án
          </th>
        </tr>
      </thead>
      <tbody>
        {answers?.map((answer: Answer, answerIndex: number) => (
          <tr key={answer.id}>
            <td align="center">{`(${answerIndex + 1})`}</td>
            {Array.from({ length: maxLength }).map((_, gIndex) => (
              <td
                key={answer.texts[gIndex]?.id ?? `${Math.random()}`}
                className="td-input"
              >
                {answer.texts[gIndex] !== undefined && (
                  <>
                    <input
                      type="text"
                      defaultValue={answer.texts[gIndex].text}
                      onChange={onChangeText.bind(null, answerIndex, gIndex)}
                    />
                    <div className="action">
                      <img
                        src="/images/icons/ic-plus-gray.png"
                        className="ic-action"
                        onClick={onAddExtraAnswer.bind(null, answerIndex)}
                      />
                      <img
                        className="ic-action"
                        src="/images/icons/ic-trash.png"
                        onClick={onDeleteAnswer.bind(null, answerIndex, gIndex)}
                      />
                    </div>
                  </>
                )}
              </td>
            ))}
          </tr>
        ))}
        <tr className="action">
          <td></td>
          <td colSpan={maxLength} align="left">
            <label className="add-new-answer" onClick={onAddAnswer}>
              <img src="/images/icons/ic-plus-sub.png" width={17} height={17} />{' '}
              Thêm đáp án
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

type Answer = {
  id: string
  texts: AnswerText[]
}
type AnswerText = {
  id: string
  text: string
}
