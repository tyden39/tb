import { useEffect, useRef, useState } from 'react'

import ContentEditable from 'react-contenteditable'

type PropType = {
  answerStr: string
  correctStr: string
  styleBold?: boolean
  className?: string
  onChange: (data: any) => void
}

export default function MatchingGameTable({
  answerStr,
  correctStr,
  className = '',
  onChange,
}: PropType) {
  const correctList = correctStr?.split('#') ?? []
  const leftRight = answerStr?.split('#') ?? []
  const [left, setLeft] = useState<Answer[]>(
    leftRight[0]?.split('*')?.map((m, mIndex) => ({
      id: `${Math.random()}_${mIndex}`,
      text: m,
    })) ?? [],
  )
  const [right, setRight] = useState<Answer[]>(
    leftRight[1]?.split('*')?.map((m, mIndex) => ({
      id: `${Math.random()}_${mIndex}`,
      text: m,
      order: correctList.findIndex((g) => g === m) + 1,
    })) ?? [],
  )

  const isInit = useRef(true)

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false
    } else {
      if (typeof onChange === 'function') {
        const rigtTemp = right.filter((m) => m.order > 0)
        onChange({
          answers: `${left.map((m) => m.text).join('*')}#${right
            .map((m) => m.text)
            .join('*')}`,
          correct_answers: rigtTemp
            .sort((a, b) => a.order - b.order)
            .map((m) => m.text)
            .join('#'),
        })
      }
    }
  }, [left, right])

  const onAddAnswer = (index: number) => {
    if (index === 0) {
      left.push({ id: `${Math.random()}_0`, text: '' })
      setLeft([...left])
    } else {
      right.push({ id: `${Math.random()}_0`, text: '' })
      setRight([...right])
    }

    const posIndex = index === 0 ? left?.length : right?.length
    setTimeout(() => {
      console.log(posIndex)
      const el = document.querySelector(
        `table:nth-child(${index + 1}) tbody tr:nth-child(${
          posIndex ?? 1
        }) td input`,
      ) as HTMLInputElement
      el?.focus()
    }, 0)
  }

  const onChangeText = (index: number, answerIndex: number, event: any) => {
    const el: HTMLInputElement = event.currentTarget
    if (index === 0) {
      left[answerIndex].text = el.value.replace(/(\*|\#)/g, '')
      setLeft([...left])
    } else {
      right[answerIndex].text = el.value.replace(/(\*|\#)/g, '')
      setRight([...right])
    }
  }

  const onChangeOrder = (answerIndex: number, event: any) => {
    const el: HTMLInputElement = event.currentTarget
    let order = parseInt(el.value)
    if (order != NaN) {
      right[answerIndex].order = order
      setRight([...right])
    }
  }

  const onDeleteAnswer = (index: number, answerIndex: number) => {
    if (index === 0) {
      left.splice(answerIndex, 1)
      setLeft([...left])
    } else {
      right.splice(answerIndex, 1)
      setRight([...right])
    }
  }

  return (
    <div className={`box-table ${className}`}>
      <table className={`question-table`}>
        <thead>
          <tr>
            <th align="left">Cột bên trái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {left?.map((answer: Answer, answerIndex: number) => (
            <tr key={answer.id}>
              <td className="input-placeholder">
                <input
                  type="text"
                  value={answer.text}
                  onChange={onChangeText.bind(null, 0, answerIndex)}
                  data-exist={answer.text != ''}
                />
                <span className="placeholder">{`Đáp án ${
                  answerIndex + 1
                }`}</span>
              </td>
              <td>
                <img
                  className="ic-action"
                  src="/images/icons/ic-trash.png"
                  onClick={onDeleteAnswer.bind(null, 0, answerIndex)}
                />
              </td>
            </tr>
          ))}
          <tr className="action">
            <td align="left" colSpan={2}>
              <label
                className="add-new-answer"
                onClick={onAddAnswer.bind(null, 0)}
              >
                <img
                  src="/images/icons/ic-plus-sub.png"
                  width={17}
                  height={17}
                />{' '}
                Thêm đáp án
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      <table className={`question-table`}>
        <thead>
          <tr>
            <th align="left">Vị trí đúng</th>
            <th align="left">Cột bên phải</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {right?.map((answer: Answer, answerIndex: number) => (
            <tr key={answer.id}>
              <td>
                <input
                  type="number"
                  defaultValue={answer.order}
                  onChange={onChangeOrder.bind(null, answerIndex)}
                />
              </td>
              <td className="input-placeholder">
                <input
                  type="text"
                  value={answer.text}
                  onChange={onChangeText.bind(null, 1, answerIndex)}
                  data-exist={answer.text != ''}
                />
                <span className="placeholder">{`Đáp án ${
                  answerIndex + 1
                }`}</span>
              </td>
              <td>
                <img
                  className="ic-action"
                  src="/images/icons/ic-trash.png"
                  onClick={onDeleteAnswer.bind(null, 1, answerIndex)}
                />
              </td>
            </tr>
          ))}
          <tr className="action">
            <td align="left" colSpan={3}>
              <label
                className="add-new-answer"
                onClick={onAddAnswer.bind(null, 1)}
              >
                <img
                  src="/images/icons/ic-plus-sub.png"
                  width={17}
                  height={17}
                />{' '}
                Thêm đáp án
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

type Answer = {
  id: string
  text: string
  order?: number
}
