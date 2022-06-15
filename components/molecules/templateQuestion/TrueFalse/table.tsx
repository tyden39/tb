import { ChangeEvent, useEffect, useRef, useState } from 'react'

import ContentEditable from 'react-contenteditable'

type PropType = {
  answerStr: string
  correctStr: string
  styleBold?: boolean
  className?: string
  onChange: (data: any) => void
}

export default function TrueFalseTable({
  answerStr,
  correctStr,
  className = '',
  onChange,
}: PropType) {
  const correctA = correctStr?.split('#') ?? ''
  const [answers, setAnswers] = useState<Answers[]>(
    answerStr?.split('#')?.map((m: string, mIndex: number) => ({
      text: m,
      correct: correctA[mIndex],
    })),
  )

  const groupKey = useRef(Math.random()).current
  const isInit = useRef(true)

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false
    } else {
      if (typeof onChange === 'function') {
        onChange({
          answers: answers.map((m) => m.text).join('#'),
          correct_answers: answers.map((m) => m.correct).join('#'),
        })
      }
    }

    setTimeout(() => {
      Array.from(document.getElementsByClassName(`${groupKey}`)).forEach(
        (el) => {
          const div = el as HTMLDivElement
          div.style.width = `${div.offsetWidth}px`
        },
      )
    }, 0)
  }, [answers])

  const onAddAnswer = () => {
    if (answers) {
      setAnswers([...answers, { text: '', correct: 'T' }])
    } else {
      setAnswers([{ text: '', correct: 'T' }])
    }

    setTimeout(() => {
      document.getElementById(`${groupKey}_${answers?.length ?? 0}`)?.focus()
    }, 0)
  }

  const onChangeIsCorrect = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    answers[index].correct = event.target.dataset.value
    setAnswers([...answers])
  }

  const onChangeText = (index: number, event: any) => {
    const el: HTMLElement = event.currentTarget
    let text = ''
    for (let i = 0, len = el.childNodes.length; i < len; i++) {
      let childNode = el.childNodes[i]
      text += childNode.textContent
    }
    answers[index].text = text.replace(/(\*|\#)/g, '')
    setAnswers([...answers])
  }

  const onDeleteAnswer = (index: number) => {
    answers.splice(index, 1)
    setAnswers([...answers])
  }

  return (
    <table className={`question-table ${className}`}>
      <thead>
        <tr>
          <th>True</th>
          <th>False</th>
          <th align="left">Danh sách đáp án</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {answers?.map((answer: Answers, answerIndex: number) => (
          <tr key={`${groupKey}_${answerIndex}`}>
            <td align="center">
              <input
                type="radio"
                data-value="T"
                name={`${groupKey}_${answerIndex}`}
                checked={answer.correct === 'T'}
                onChange={onChangeIsCorrect.bind(null, answerIndex)}
              />
            </td>
            <td align="center">
              <input
                type="radio"
                data-value="F"
                name={`${groupKey}_${answerIndex}`}
                checked={answer.correct === 'F'}
                onChange={onChangeIsCorrect.bind(null, answerIndex)}
              />
            </td>
            <td className="input-placeholder">
              <ContentEditable
                id={`${groupKey}_${answerIndex}`}
                spellCheck={false}
                className={`div-input ${groupKey}`}
                html={answer.text}
                contentEditable="true"
                onChange={onChangeText.bind(null, answerIndex)}
              />
              <span className="placeholder">{`Đáp án ${answerIndex + 1}`}</span>
            </td>
            <td align="right">
              <img
                onClick={onDeleteAnswer.bind(null, answerIndex)}
                className="ic-action"
                src="/images/icons/ic-trash.png"
              />
            </td>
          </tr>
        ))}
        <tr className="action">
          <td></td>
          <td></td>
          <td colSpan={2} align="left">
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

type Answers = {
  text: string
  correct: string
}
