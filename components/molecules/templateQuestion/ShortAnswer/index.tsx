import { ContentField } from 'components/atoms/contentField'
import { TextAreaField } from 'components/atoms/textAreaField'
import { QuestionDataType } from 'interfaces/types'
import { useEffect, useRef } from 'react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ShortAnswerTable from './table'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
}

export default function ShortAnswer({
  question,
  register,
  setValue,
}: PropsType) {
  const inputRef = useRef(null)

  useEffect(() => {
    register('question_text', {
      required: 'Câu hỏi không được để trống',
      maxLength: {
        value: 2000,
        message: 'Câu hỏi không được lớn hơn 2000 ký tự',
      },
      value: question?.question_text,
    })
    register('answers', {
      maxLength: {
        value: 500,
        message: 'Gợi ý không được lớn hơn 500 ký tự',
      },
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

  const onChangeQuestionText = (data: any) => {
    console.log('question_text', data)
    setValue('question_text', data)
  }

  const onChangeHintText = (data: any) => {
    console.log('answers', data)
    setValue('answers', data.replace('##', '%s%'))
  }

  const onCorrectAnswerChange = (data: any) => {
    console.log('correct_answers', data)
    setValue('correct_answers', data)
  }

  const onAddSpace = (e: any) => {
    e.preventDefault()
    inputRef.current.pressTab()
  }

  return (
    <div className="m-short-answer">
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
        className="form-input-haft"
        style={{ height: '9rem' }}
      />
      <div className="form-input-haft" style={{ position: 'relative' }}>
        <ContentField
          ref={inputRef}
          label="Gợi ý"
          strValue={question?.answers?.replace('%s%', '##')}
          disableTabInput={true}
          onChange={onChangeHintText}
          style={{ height: '9rem' }}
        />
        <div className="box-action-info">
          <span className="add-new-answer" onMouseDown={onAddSpace}>
            <img src="/images/icons/ic-plus-sub.png" width={17} height={17} />{' '}
            Thêm khoảng trống
          </span>
        </div>
      </div>
      <ContentField
        className="form-input-haft"
        label="Câu hỏi"
        strValue={question?.question_text}
        disableTab={true}
        styleAction={['u']}
        onChange={onChangeQuestionText}
      />
      <ShortAnswerTable
        className="form-input-haft"
        correctStr={question?.correct_answers}
        onChange={onCorrectAnswerChange}
      />
    </div>
  )
}
