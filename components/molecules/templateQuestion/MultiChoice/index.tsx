import { UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { QuestionDataType } from 'interfaces/types'

import MultiChoiceTable from './table'
import { ContentField } from 'components/atoms/contentField'
import { useCallback, useEffect, useRef, useState } from 'react'
import { InputField } from 'components/atoms/inputField'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  isReading?: boolean
  isImage?: boolean
}

export default function MultiChoice({
  question,
  register,
  setValue,
  isReading = false,
  isImage = false,
}: PropsType) {
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const [hasImage, setHasImage] = useState(
    question?.image != '' && question?.image != undefined,
  )

  useEffect(() => {
    if (isReading) {
      register('question_text', {
        required: 'Câu hỏi không được để trống',
        maxLength: {
          value: 2000,
          message: 'Câu hỏi không được lớn hơn 2000 ký tự',
        },
        value: question?.question_text,
      })
    }
    if (isImage) {
      register('image_file')
      register('image', {
        maxLength: {
          value: 255,
          message: 'Hình ảnh không được lớn hơn 255 ký tự',
        },
        required: 'Hình ảnh không được để trống',
        value: question?.image,
      })
    }
    register('answers', {
      validate: (value: string) => {
        return (value ?? '').split('*').some((m) => m === '')
          ? 'Danh sách đáp án không được để trống'
          : true
      },
      maxLength: {
        value: 500,
        message: 'Danh sách đáp án không được lớn hơn 500 ký tự',
      },
      value: question?.answers,
    })
    register('correct_answers', {
      required: 'Đáp án không được để trống',
      maxLength: {
        value: 500,
        message: 'Đáp án không được lớn hơn 500 ký tự',
      },
      value: question?.correct_answers,
    })
  }, [])

  const updateFormData = (data: any) => {
    console.log(data)
    setValue('answers', data.answers)
    setValue('correct_answers', data.correct_answers ?? '', {
      shouldValidate: true,
    })
  }

  const onChangeQuestionText = useCallback((data: string) => {
    console.log(data.replace(/##/g, '%s%'))
    setValue('question_text', data.replace(/##/g, '%s%'))
  }, [])

  const onAddSpace = (e: any) => {
    e.preventDefault()
    inputRef.current.pressTab()
  }

  const onChangeFile = () => {
    if (fileRef.current.files.length > 0) {
      setValue('image_file', fileRef.current.files[0])
      const urlImage = URL.createObjectURL(fileRef.current.files[0])
      setValue('image', urlImage)
      setHasImage(true)
    }
  }

  return (
    <div className="m-multi-choice">
      <InputField
        label="Yêu cầu đề bài"
        type="text"
        register={register('question_description', {
          required: 'Yêu cầu đề bài không được để trống',
          maxLength: {
            value: 200,
            message: 'Yêu cầu đề bài không được lớn hơn 200 ký tự',
          },
        })}
        defaultValue={question?.question_description}
        className="form-input-stretch"
      />
      {isReading && (
        <div className="form-input-stretch" style={{ position: 'relative' }}>
          <ContentField
            ref={inputRef}
            label="Câu hỏi"
            strValue={(question?.question_text as any)?.replaceAll('%s%', '##')}
            disableTabInput={true}
            isMultiTab={true}
            onChange={onChangeQuestionText}
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
                    fileRef.current.dispatchEvent(new MouseEvent('click'))
                  }
                >
                  <img
                    src="/images/icons/ic-image.png"
                    width={16}
                    height={16}
                  />
                  Hình ảnh
                  <input
                    ref={fileRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".png,.jpeg"
                    onChange={onChangeFile}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <MultiChoiceTable
        className="form-input-stretch"
        answerStr={question?.answers ?? '***'}
        correctStr={question?.correct_answers}
        onChange={updateFormData}
      />
    </div>
  )
}
