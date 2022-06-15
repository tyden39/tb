import { useEffect, useCallback, useState, useRef } from 'react'

import { UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { TextAreaField } from 'components/atoms/textAreaField'
import { QuestionDataType } from 'interfaces/types'
import { InputQuestion } from './input'
import { ContentField } from 'components/atoms/contentField'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
}

export default function SelectFromList({
  question,
  register,
  setValue,
}: PropsType) {
  const listCorrect = question?.correct_answers?.split('#') ?? []
  const [selectedValue, setSelectedValue] = useState(null)

  const inputRef = useRef(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const convertListInput = useCallback((strV: string, listC: string[]) => {
    const listV: Answer[][] =
      strV?.split('#').map((m) =>
        m.split('*').map((g) => ({
          text: g,
          isCorrect: listC.includes(g),
        })),
      ) ?? []
    return listV
  }, [])

  const listInput = useRef(convertListInput(question?.answers, listCorrect))
  const groupKey = useRef(Math.random()).current
  const isInit = useRef(true)

  useEffect(() => {
    register('answers', {
      maxLength: {
        value: 500,
        message: 'Danh sách đáp án không được lớn hơn 500 ký tự',
      },
      required: 'Danh sách đáp án không được để trống',
      value: question?.answers,
    })
    register('question_text', {
      required: 'Câu hỏi không được để trống',
      maxLength: {
        value: 2000,
        message: 'Câu hỏi không được lớn hơn 2000 ký tự',
      },
      value: question?.question_text,
    })
    register('correct_answers', {
      validate: (value: string) => {
        return (value ?? '').split('#').some((m) => m === '')
          ? 'Đáp án không được để trống'
          : true
      },
      maxLength: {
        value: 500,
        message: 'Đáp án không được lớn hơn 500 ký tự',
      },
      value: question?.correct_answers,
    })
  }, [])

  useEffect(() => {
    if (selectedValue === null) return
    if (isInit.current) {
      isInit.current = false
    } else {
      onUpdateCorrectAnswer()
    }
  }, [selectedValue])

  const onChange = (data: any) => {
    console.log(data)
    setValue(
      'question_text',
      data.replaceAll('##', '%s%').replaceAll('%lb%', '\n'),
    )
  }

  const formatText = useCallback((answerStr: string, corrects: string) => {
    if (!corrects) return answerStr
    let result: any = answerStr
    result = result?.replaceAll('\n', '%lb%')
    const correctList = corrects.split('#')
    for (const correct of correctList) {
      result = result?.replace('%s%', `##`)
    }
    return result
  }, [])

  const onAddSpace = (e: any) => {
    e.preventDefault()
    inputRef.current.pressTab()
  }

  const onUpdateCorrectAnswer = useCallback(() => {
    setValue(
      'answers',
      listInput.current
        .map((m: any) => m.map((g: any) => g.text).join('*'))
        .join('#'),
    )
    setValue(
      'correct_answers',
      listInput.current
        .map((m: any) => m.find((g: any) => g.isCorrect)?.text)
        .join('#'),
    )
  }, [])

  const onTabCreated = (id: string, index: number) => {
    console.log(listInput.current, index)
    listInput.current.splice(index, 0, [])
    onUpdateCorrectAnswer()
  }

  const onTabsDeleted = (indexes: number[]) => {
    console.log(indexes)
    listInput.current = listInput.current.filter(
      (m, mIndex) => !indexes.includes(mIndex),
    )
    console.log(listInput.current)
    onUpdateCorrectAnswer()
  }

  const onTabClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    console.log(listInput.current)
    const input = e.target as HTMLInputElement
    setSelectedValue({ index: index, value: listInput.current[index] })

    const inputRect = input.getBoundingClientRect()
    const parentRect = inputRef.current.getBoundingClientRect()
    const offetTop = inputRect.top - parentRect.top + inputRect.height + 10
    let offsetLeft = inputRect.left - parentRect.left + inputRect.width / 2 - 5
    let tableLeft = 0
    if (offsetLeft > 360) {
      tableLeft = offsetLeft - 360
      offsetLeft = 360
    }
    tableRef.current.style.top = `${offetTop}px`
    tableRef.current.style.left = `${tableLeft}px`
    tableRef.current.style.display = 'unset'
    tableRef.current.style.setProperty('--offset-left', `${offsetLeft}px`)
  }

  const onClosePopup = () => {
    setSelectedValue(null)
    tableRef.current.style.display = null
  }

  const onChangeIsCorrect = (answerIndex: number) => {
    selectedValue.value.forEach((m: any, mIndex: number) => {
      m.isCorrect = mIndex === answerIndex
    })
    listInput.current[selectedValue.index] = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  const onChangeAnswerText = (answerIndex: number, e: any) => {
    selectedValue.value[answerIndex].text = e.target.value
    const item = listInput.current[selectedValue.index]
    item[answerIndex].text = e.target.value
    setSelectedValue({ ...selectedValue })
  }

  const onAddAnswer = () => {
    selectedValue.value.push({ text: '', isCorrect: false })
    listInput.current[selectedValue.index] = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  const onDeleteAnswerText = (answerIndex: number) => {
    selectedValue.value.splice(answerIndex, 1)
    listInput.current[selectedValue.index] = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  return (
    <div className="m-select-from-list">
      <TextAreaField
        label="Yêu cầu đề bài"
        defaultValue={question?.question_description}
        register={register('question_description', {
          required: 'Yêu cầu đề bài không được để trống',
          maxLength: {
            value: 200,
            message: 'Yêu cầu đề bài không được lớn hơn 200 ký tự',
          },
        })}
        className="form-input-stretch"
        style={{ height: '9rem' }}
      />
      <div className="form-input-stretch" style={{ position: 'relative' }}>
        <ContentField
          ref={inputRef}
          label="Câu hỏi"
          strValue={formatText(
            question?.question_text,
            question?.correct_answers,
          )}
          onChange={onChange}
          isMultiTab={true}
          disableTabInput={true}
          onTabClick={onTabClick}
          onTabCreated={onTabCreated}
          onTabsDeleted={onTabsDeleted}
          inputStyle={{ padding: '1rem 1.2rem 4.5rem 1.2rem' }}
        />
        <div className="box-action-info">
          <span className="add-new-answer" onMouseDown={onAddSpace}>
            <img src="/images/icons/ic-plus-sub.png" width={17} height={17} />{' '}
            Thêm khoảng trống
          </span>
        </div>

        <div ref={tableRef} className="popup-table">
          {selectedValue && (
            <table className={`question-table`}>
              <thead>
                <tr>
                  <th>Đáp án đúng</th>
                  <th align="left">Danh sách đáp án</th>
                  <th className="action">
                    <img
                      src="/images/icons/ic-close-dark.png"
                      width={20}
                      height={20}
                      onClick={onClosePopup}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedValue?.value?.map(
                  (answer: Answer, answerIndex: number) => (
                    <tr key={`${groupKey}_${answerIndex}`}>
                      <td align="center">
                        <input
                          type="radio"
                          name={groupKey.toString()}
                          checked={answer.isCorrect}
                          onChange={onChangeIsCorrect.bind(null, answerIndex)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={answer.text}
                          onChange={onChangeAnswerText.bind(null, answerIndex)}
                        />
                      </td>
                      <td align="right">
                        <img
                          onClick={onDeleteAnswerText.bind(null, answerIndex)}
                          className="ic-action"
                          src="/images/icons/ic-trash.png"
                        />
                      </td>
                    </tr>
                  ),
                )}
                <tr className="action">
                  <td></td>
                  <td colSpan={2} align="left">
                    <label className="add-new-answer" onClick={onAddAnswer}>
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
          )}
        </div>
      </div>
    </div>
  )
}

type Answer = {
  text: string
  isCorrect: boolean
}
