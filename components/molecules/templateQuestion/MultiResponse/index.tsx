import { ContentField } from 'components/atoms/contentField'
import { TextAreaField } from 'components/atoms/textAreaField'
import { QuestionDataType } from 'interfaces/types'
import { useEffect, useRef, useState } from 'react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import MultiResponseTable from './table'

type PropsType = {
  question: QuestionDataType
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  isAudio?: boolean
}

export default function MultiResponse({
  question,
  register,
  setValue,
  isAudio = false,
}: PropsType) {
  const fileRef = useRef(null)
  const [hasAudio, setHasAudio] = useState(
    question?.audio != '' && question?.audio != undefined,
  )

  useEffect(() => {
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
        required: 'Nội dung bài đọc không được để trống',
        maxLength: {
          value: 2000,
          message: 'Nội dung bài đọc không được lớn hơn 2000 ký tự',
        },
        value: question?.audio_script,
      })
    }
    register('answers', {
      validate: (value: string) => {
        return (value ?? '').split('#').some((m) => m === '')
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

  const onChangeAudioScript = (data: any) => {
    if (isAudio) {
      setValue('audio_script', data.replaceAll('%lb%', '\n'))
    }
  }

  const onCorrectAnswerChange = (data: any) => {
    setValue('answers', data.answers)
    setValue('correct_answers', data.correct_answers)
  }

  const onChangeFile = () => {
    if (fileRef.current.files.length > 0) {
      setValue('audio_file', fileRef.current.files[0])
      const urlAudio = URL.createObjectURL(fileRef.current.files[0])
      setValue('audio', urlAudio)
      setHasAudio(true)
    }
  }

  return (
    <div
      className="m-multi-response"
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      {isAudio && (
        <div style={{ flex: 1, display: 'flex' }}>
          <ContentField
            className="form-input-stretch"
            label={'Nội dung bài nghe'}
            strValue={question?.audio_script}
            disableTab={true}
            //styleAction={['b', 'i', 'u']}
            onChange={onChangeAudioScript}
            style={{ height: 'unset' }}
          />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div className="form-input-stretch" style={{ position: 'relative' }}>
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
            inputStyle={isAudio ? { paddingBottom: '4.5rem' } : {}}
          />
          {isAudio && (
            <div className="box-action-info">
              <span className="add-new-answer"></span>
              <div className="box-media">
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
              </div>
            </div>
          )}
        </div>
        <MultiResponseTable
          className="form-input-stretch"
          answerStr={question?.answers ?? '###'}
          correctStr={question?.correct_answers}
          onChange={onCorrectAnswerChange}
        />
      </div>
    </div>
  )
}
