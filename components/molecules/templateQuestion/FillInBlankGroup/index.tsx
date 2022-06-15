import React, { useEffect, useState, useRef, useCallback } from 'react'

import { UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { ContentField } from 'components/atoms/contentField'
import { TextAreaField } from 'components/atoms/textAreaField'
import { QuestionDataType } from 'interfaces/types'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  isAudio?: boolean
  isImage?: boolean
}

export default function FillInBlankGroup({
  question,
  register,
  setValue,
  isAudio = false,
  isImage = false,
}: PropsType) {
  const [selectedValue, setSelectedValue] = useState(null)

  const inputRef = useRef(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef(null)
  const fileImgRef = useRef(null)
  const [hasAudio, setHasAudio] = useState(
    question?.audio != '' && question?.audio != undefined,
  )
  const [hasImage, setHasImage] = useState(
    question?.image != '' && question?.image != undefined,
  )

  const convertListInput = useCallback((strV: string) => {
    const listV: Answer[][] =
      strV?.split('#').map((m) =>
        m.split('*').map((g) => ({
          text: g,
        })),
      ) ?? []
    return listV
  }, [])

  const listInput = useRef(convertListInput(question?.correct_answers))
  const groupKey = useRef(Math.random()).current
  const isInit = useRef(true)

  useEffect(() => {
    if (isImage) {
      register('image_file')
      register('image', {
        maxLength: {
          value: 255,
          message: 'Hình ảnh không được lớn hơn 255 ký tự',
        },
        required: 'Hình ảnh không được để trống',
        value: question?.image,
      })
    }
    if (isAudio) {
      register('audio_file')
      register('audio', {
        maxLength: {
          value: 255,
          message: 'Audio không được lớn hơn 255 ký tự',
        },
        required: 'Audio không được để trống',
        value: question?.audio,
      })
      register('audio_script', {
        required: 'Nội dung bài nghe không được để trống',
        maxLength: {
          value: 2000,
          message: 'Nội dung bài nghe không được lớn hơn 2000 ký tự',
        },
        value: question?.audio_script,
      })
    }
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

  const onUpdateCorrectAnswer = useCallback(() => {
    setValue(
      'correct_answers',
      listInput.current
        .map((m: any) => m?.map((g: any) => g.text)?.join('*'))
        .join('#'),
    )
  }, [])

  const onChange = (data: any) => {
    setValue(
      'question_text',
      data.replaceAll('##', '%s%').replaceAll('%lb%', '\n'),
    )
  }

  const onChangeAudioScript = (data: any) => {
    if (isAudio) {
      setValue('audio_script', data.replaceAll('%lb%', '\n'))
    }
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

  const onTabCreated = (id: string, index: number) => {
    listInput.current.splice(index, 0, [])
    onUpdateCorrectAnswer()
  }

  const onTabsDeleted = (indexes: number[]) => {
    listInput.current = listInput.current.filter(
      (m, mIndex) => !indexes.includes(mIndex),
    )
    onUpdateCorrectAnswer()
  }

  const onTabClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const input = e.target as HTMLInputElement
    setSelectedValue({ index: index, value: listInput.current[index] })

    const inputRect = input.getBoundingClientRect()
    const parentRect = inputRef.current.getBoundingClientRect()
    const offetTop = inputRect.top - parentRect.top + inputRect.height + 10
    let offsetLeft = inputRect.left - parentRect.left + inputRect.width / 2 - 5
    let tableLeft = 0
    if (offsetLeft > 260) {
      tableLeft = offsetLeft - 260
      offsetLeft = 260
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

  const onChangeAnswerText = (answerIndex: number, e: any) => {
    selectedValue.value[answerIndex].text = e.target.value
    const item = listInput.current[selectedValue.index]
    item[answerIndex].text = e.target.value
    setSelectedValue({ ...selectedValue })
  }

  const onAddAnswer = () => {
    selectedValue.value.push({ text: '' })
    listInput.current[selectedValue.index] = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  const onDeleteAnswerText = (answerIndex: number) => {
    selectedValue.value.splice(answerIndex, 1)
    listInput.current[selectedValue.index] = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  const onChangeFile = () => {
    if (fileRef.current.files.length > 0) {
      setValue('audio_file', fileRef.current.files[0])
      const urlAudio = URL.createObjectURL(fileRef.current.files[0])
      setValue('audio', urlAudio)
      setHasAudio(true)
    }
  }

  const onChangeImageFile = () => {
    if (fileImgRef.current.files.length > 0) {
      setValue('image_file', fileImgRef.current.files[0])
      const urlAudio = URL.createObjectURL(fileImgRef.current.files[0])
      setValue('image', urlAudio)
      setHasImage(true)
    }
  }

  return (
    <div className="m-fill-in-blank">
      {isAudio && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ContentField
            label={'Nội dung bài nghe'}
            strValue={question?.audio_script}
            disableTab={true}
            //styleAction={['b', 'i', 'u']}
            onChange={onChangeAudioScript}
            className="form-input-stretch"
            style={{ flex: 1 }}
          />
        </div>
      )}
      <div style={{ flex: 1 }}>
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
          style={{ height: '9rem' }}
          className="form-input-stretch"
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
            <div className="box-media">
              {isImage && (
                <div
                  className={`box-media-input ${hasImage ? 'has-data' : ''}`}
                  onClick={() =>
                    fileImgRef.current.dispatchEvent(new MouseEvent('click'))
                  }
                >
                  <img
                    src="/images/icons/ic-image.png"
                    width={16}
                    height={16}
                  />
                  Hình ảnh
                  <input
                    ref={fileImgRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".png,.jpeg"
                    onChange={onChangeImageFile}
                  />
                </div>
              )}
              {isAudio && (
                <div
                  className={`box-media-input ${hasAudio ? 'has-data' : ''}`}
                  onClick={() => {
                    fileRef.current.dispatchEvent(new MouseEvent('click'))
                  }}
                >
                  <img
                    src="/images/icons/ic-audio.png"
                    width={16}
                    height={16}
                  />
                  Audio
                  <input
                    ref={fileRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".mp3"
                    onChange={onChangeFile}
                  />
                </div>
              )}
            </div>
          </div>

          <div ref={tableRef} className="popup-table">
            {selectedValue && (
              <table className={`question-table`}>
                <thead>
                  <tr>
                    <th align="left">Đáp án đúng</th>
                    <th className="action" style={{ width: '60px' }}>
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
                        <td>
                          <input
                            type="text"
                            value={answer.text}
                            onChange={onChangeAnswerText.bind(
                              null,
                              answerIndex,
                            )}
                          />
                        </td>
                        <td align="center">
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
                    <td colSpan={2} align="left">
                      <span className="add-new-answer" onClick={onAddAnswer}>
                        <img
                          src="/images/icons/ic-plus-sub.png"
                          width={17}
                          height={17}
                        />{' '}
                        Thêm đáp án
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type Answer = {
  text: string
}
