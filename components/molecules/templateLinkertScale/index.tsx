import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data: any
  mode?: 'audio' | 'paragraph'
}

export const TemplateLinkertScale = ({
  className = '',
  data,
  mode = 'audio',
  style,
}: PropsType) => {
  const correctList = data?.correct_answers
    ? data.correct_answers
        .split('#')
        .map((item: 'T' | 'F' | 'NI') =>
          item === 'T' ? true : item === 'F' ? false : null,
        )
    : data.answers.split('#').map(() => false)

  return (
    <div className={`m-template-linkert-scale ${className}`} style={style}>
      <p className="m-template-linkert-scale__instruction">
        {data?.question_description || ''}
      </p>
      <div className="m-template-linkert-scale__question-container">
        <div className="m-template-linkert-scale__question-container__question">
          {mode === 'audio' && (
            <div
              className={`m-template-linkert-scale__question-container__question__audio-mode`}
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
              className={`m-template-linkert-scale__question-container__question__paragraph-mode`}
            >
              {data?.question_text || ''}
            </p>
          )}
        </div>
        <div className="m-template-linkert-scale__question-container__answer">
          <ul>
            <li>
              <span>Danh sách đáp án</span>
              <span>True</span>
              <span>False</span>
              <span>NI</span>
            </li>
            {data?.answers &&
              data.answers.split('#').map((item: string, i: number) => (
                <li key={i}>
                  <span>{item}</span>
                  <span>
                    <img
                      src={
                        correctList[i] === true
                          ? '/images/icons/ic-true.png'
                          : '/images/icons/ic-blank-checkmark.png'
                      }
                      alt={correctList[i] ? 'true' : 'false'}
                    />
                  </span>
                  <span>
                    <img
                      src={
                        correctList[i] === false
                          ? '/images/icons/ic-true.png'
                          : '/images/icons/ic-blank-checkmark.png'
                      }
                      alt={correctList[i] ? 'true' : 'false'}
                    />
                  </span>
                  <span>
                    <img
                      src={
                        correctList[i] === null
                          ? '/images/icons/ic-true.png'
                          : '/images/icons/ic-blank-checkmark.png'
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
