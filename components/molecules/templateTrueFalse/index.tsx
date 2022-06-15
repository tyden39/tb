import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data: any
  mode?: 'audio' | 'paragraph'
}

export const TemplateTrueFalse = ({
  className = '',
  data,
  mode = 'audio',
  style,
}: PropsType) => {
  const correctList = data?.correct_answers
    ? data.correct_answers.split('#').map((item: 'T' | 'F') => item === 'T')
    : data.answers.split('#').map(() => false)

  return (
    <div className={`m-template-true-false ${className}`} style={style}>
      <p className={`m-template-true-false__instruction`}>
        {data?.question_description || ''}
      </p>
      <div className={`m-template-true-false__question-container`}>
        <div className={`m-template-true-false__question-container__question`}>
          {mode === 'audio' && (
            <div
              className={`m-template-true-false__question-container__question__audio-mode`}
            >
              <audio controls>
                <source
                  src={
                    data?.audio.startsWith('blob')
                      ? data.audio
                      : `/upload/${data?.audio || ''}`
                  }
                  type="audio/mpeg"
                />
              </audio>
            </div>
          )}

          {mode === 'paragraph' && (
            <p
              className={`m-template-true-false__question-container__question__paragraph-mode`}
            >
              {data?.question_text || ''}
            </p>
          )}
        </div>
        <div className="m-template-true-false__question-container__answer">
          <ul>
            <li>
              <span>Danh sách đáp án</span>
              <span>True/False</span>
            </li>
            {data?.answers &&
              data.answers.split('#').map((item: string, i: number) => (
                <li key={i}>
                  <span>{item}</span>
                  <span>
                    <img
                      src={
                        correctList[i]
                          ? '/images/icons/ic-true.png'
                          : '/images/icons/ic-false.png'
                      }
                      alt={correctList[i] ? 'true' : 'false'}
                    />
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
