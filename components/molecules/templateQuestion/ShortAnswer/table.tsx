import { useEffect, useRef, useState } from 'react'

import ContentEditable from 'react-contenteditable'

type PropType = {
  correctStr: string
  className?: string
  onChange: (data: any) => void
}

export default function ShortAnswerTable({
  correctStr,
  className = '',
  onChange,
}: PropType) {
  const [answers, setAnswers] = useState<string[]>(correctStr?.split('%/%'))

  const groupKey = useRef(Math.random()).current
  const isInit = useRef(true)

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false
    } else {
      if (typeof onChange === 'function') {
        onChange(answers.join('%/%'))
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
      setAnswers([...answers, ''])
    } else {
      setAnswers([''])
    }

    setTimeout(() => {
      document.getElementById(`${groupKey}_${answers?.length ?? 0}`)?.focus()
    }, 0)
  }

  const onChangeText = (index: number, event: any) => {
    const el: HTMLElement = event.currentTarget
    let text = ''
    for (let i = 0, len = el.childNodes.length; i < len; i++) {
      const childNode = el.childNodes[i]
      if (childNode.nodeName === 'B') {
        text += `%${childNode.textContent}%`
      } else {
        text += childNode.textContent
      }
    }
    answers[index] = text
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {answers?.map((answer: string, answerIndex: number) => (
          <tr key={`${groupKey}_${answerIndex}`}>
            <td>
              <ContentEditable
                id={`${groupKey}_${answerIndex}`}
                spellCheck={false}
                className={`div-input ${groupKey}`}
                html={answer}
                contentEditable="true"
                onChange={onChangeText.bind(null, answerIndex)}
              />
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
