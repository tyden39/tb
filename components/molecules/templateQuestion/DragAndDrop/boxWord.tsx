import { useEffect, useRef, useState } from 'react'

import { TagPicker } from 'rsuite'

type PropType = {
  answerStr: string
  correctStr: string
  styleBold?: boolean
  className?: string
  onChange: (data: any) => void
}

export default function DragDropBoxWord({
  answerStr,
  correctStr,
  className = '',
  onChange,
}: PropType) {
  const [words, setWords] = useState(answerStr?.split('*') ?? [])
  const [correctWords, setCorrectWords] = useState(
    correctStr?.split('%/%')?.map((m) => m.split('*') ?? []),
  )

  const groupKey = useRef(Math.random()).current
  const isInit = useRef(true)

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false
    } else {
      if (typeof onChange === 'function') {
        onChange({
          answers: words?.join('*'),
          correct_answers:
            correctWords?.map((m) => m.join('*')).join('%/%') ?? '',
        })
      }
    }
  }, [words, correctWords])

  const onKeyDown = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (e.target.value === '' || words.includes(e.target.value)) return
      setWords([...words, e.target.value])
      e.target.value = ''
    }
  }

  const onClickRemove = (index: number, e: any) => {
    const wordStr = words[index]
    setWords(words.filter((_, wIndex: number) => wIndex != index))
    setCorrectWords(correctWords.map((m) => m.filter((g) => g != wordStr)))
  }

  const onChangeCorrectAnswer = (index: number, value: any) => {
    correctWords[index] = value
    setCorrectWords([...correctWords])
  }

  const onAddNewAnswer = () => {
    if (correctWords) {
      setCorrectWords([...correctWords, []])
    } else {
      setCorrectWords([[]])
    }
  }

  const onDeleted = (index: number) => {
    setCorrectWords(correctWords.filter((m, mIndex) => mIndex != index))
  }

  return (
    <div className={`${className}`}>
      <div style={{ position: 'relative' }}>
        <div className="box-words" data-exist="true">
          {words?.map((word: string, wordIndex: number) => (
            <div key={`word_${wordIndex}`}>
              <span>{word}</span>
              <img
                src="/images/icons/ic-close-circle.png"
                onClick={onClickRemove.bind(null, wordIndex)}
              />
            </div>
          ))}
          <input onKeyDown={onKeyDown} />
          <label>
            <span>Từ khóa</span>
          </label>
        </div>
        <div className="box-action-info">
          <span className="text-guide">
            <img src="/images/icons/ic-info-blue.png" />
            Nhấn nút “Enter" để tạo từ khóa
          </span>
        </div>
      </div>
      <table className={`question-table`}>
        <thead>
          <tr>
            <th align="left">Danh sách đáp án</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {correctWords?.map((wordList: string[], wordsIndex: number) => (
            <tr key={`${groupKey}_${wordsIndex}`}>
              <td>
                <TagPicker
                  data={words.map((m) => ({ label: m, value: m }))}
                  value={wordList}
                  onChange={onChangeCorrectAnswer.bind(null, wordsIndex)}
                  placeholder={' '}
                />
              </td>
              <td align="right">
                <img
                  className="ic-action"
                  src="/images/icons/ic-trash.png"
                  onClick={onDeleted.bind(null, wordsIndex)}
                />
              </td>
            </tr>
          ))}
          <tr className="action">
            <td colSpan={2} align="left">
              <label className="add-new-answer" onClick={onAddNewAnswer}>
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
