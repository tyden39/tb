import { useEffect, useRef, useState } from 'react'

import ContentEditable from 'react-contenteditable'

import { MyCustomCSS } from 'interfaces/types'

type PropType = {
  answerStr: string
  correctStr: string
  styleBold?: boolean
  className?: string
  onChange: (data: any) => void
}

export default function MultiChoiceTable({
  answerStr,
  correctStr,
  styleBold = false,
  className = '',
  onChange,
}: PropType) {
  const [answers, setAnswers] = useState<Answers[]>(
    answerStr?.split('*')?.map((m: string) => ({
      text: m,
      isCorrect: m.replace(/\%/g, '') === correctStr,
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
          answers: answers.map((m) => m.text).join('*'),
          correct_answers: answers
            .find((m) => m.isCorrect)
            ?.text.replace(/\%/g, ''),
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
    answers.forEach((answer: Answers, answerIndex: number) => {
      answer.isCorrect = index === answerIndex
    })
    setAnswers([...answers])
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
    answers[index].text = text.replace(/(\*|\#)/g, '')
    setAnswers([...answers])
  }

  const onDeleteAnswer = (index: number) => {
    answers.splice(index, 1)
    setAnswers([...answers])
  }

  const onBold = () => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    let start = 0
    let end = -1
    const parent = range.commonAncestorContainer
    let el: HTMLElement = null
    let parentEl =
      parent.nodeType === 3 ? parent.parentElement : (parent as HTMLElement)
    while (parentEl.parentElement) {
      if (parentEl.classList.contains('div-input')) {
        el = parentEl
        break
      }
      parentEl = parentEl.parentElement
    }
    if (el)
      for (let i = 0, len = el.childNodes.length; i < len; i++) {
        let childNode = el.childNodes[i]
        if (childNode.nodeType != 3) childNode = childNode.firstChild
        if (!childNode) continue
        if (childNode === range.startContainer) {
          if (childNode === range.endContainer) {
            end = start + range.endOffset
            start += range.startOffset
            break
          } else {
            start += range.startOffset
            end = start + childNode.textContent.length - range.startOffset
          }
        } else if (childNode === range.endContainer) {
          end += range.endOffset
          break
        } else {
          if (end === -1) {
            start += childNode.textContent.length
          } else {
            end += childNode.textContent.length
          }
        }
      }
    if (end != -1) {
      const index = parseInt(el.id.replace(`${groupKey}_`, ''))
      answers[index].text = `${el.textContent.substring(
        0,
        start,
      )}%${el.textContent.substring(start, end)}%${el.textContent.substring(
        end,
      )}`
    }
    setAnswers([...answers])
  }

  return (
    <table className={`question-table ${className}`}>
      <thead>
        <tr>
          <th>Đáp án đúng</th>
          <th>Danh sách đáp án</th>
          <th align="right">
            {styleBold && (
              <div
                className="icon-mask icon-action-style"
                onClick={onBold}
                style={
                  { '--image': 'url(/images/icons/ic-bold.png)' } as MyCustomCSS
                }
              ></div>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {answers?.map((answer: Answers, answerIndex: number) => [
          <tr key={`${groupKey}_${answerIndex}`}>
            <td align="center">
              <input
                type="radio"
                name={groupKey.toString()}
                checked={answer.isCorrect}
                onChange={onChangeIsCorrect.bind(null, answerIndex)}
              />
            </td>
            <td className="input-placeholder">
              <ContentEditable
                id={`${groupKey}_${answerIndex}`}
                spellCheck={false}
                className={`div-input ${groupKey}`}
                html={answer.text
                  .split('%')
                  .map((m: string, mIndex: number) =>
                    mIndex === 1 ? `<b>${m}</b>` : m,
                  )
                  .join('')}
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
          </tr>,
        ])}
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
