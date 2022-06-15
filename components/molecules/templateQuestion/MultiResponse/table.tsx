import { CheckBox } from 'components/atoms/checkbox'
import { MyCustomCSS } from 'interfaces/types'
import { useEffect, useRef, useState } from 'react'
import ContentEditable from 'react-contenteditable'

type PropType = {
  answerStr: string
  correctStr: string
  className?: string
  onChange: (data: any) => void
}

export default function MultiResponseTable({
  answerStr,
  correctStr,
  className = '',
  onChange,
}: PropType) {
  const listCorrect = correctStr?.split('#') ?? []
  const [answers, setAnswers] = useState<Answers[]>(
    answerStr?.split('#')?.map((m: string) => ({
      text: m,
      isCorrect: listCorrect.includes(m),
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
          correct_answers: answers
            .filter((m) => m.isCorrect)
            .map((m) => m.text)
            .join('#'),
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
      setAnswers([...answers, { text: '', isCorrect: false }])
    } else {
      setAnswers([{ text: '', isCorrect: false }])
    }

    setTimeout(() => {
      document.getElementById(`${groupKey}_${answers?.length ?? 0}`)?.focus()
    }, 0)
  }

  const onChangeIsCorrect = (index: number) => {
    answers[index].isCorrect = !answers[index].isCorrect
    setAnswers([...answers])
  }

  const onChangeText = (index: number, event: any) => {
    let el: HTMLElement = event.currentTarget
    let text = ''
    for (let i = 0, len = el.childNodes.length; i < len; i++) {
      let childNode = el.childNodes[i]
      text += childNode.textContent
    }
    answers[index].text = text
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
          <th>Đáp án đúng</th>
          <th align="left">Danh sách đáp án</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {answers?.map((answer: Answers, answerIndex: number) => (
          <tr key={`${groupKey}_${answerIndex}`}>
            <td align="center">
              <CheckBox
                checked={answer.isCorrect}
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
  isCorrect: boolean
}
