import { CSSProperties } from 'react'

type PropsType = {
  data?: any
  className?: string
  style?: CSSProperties
}

export const MatchingQuestion = ({
  className = '',
  data,
  style,
}: PropsType) => {
  const colData = data?.answers
    .split('#')
    .map((item: string) => item.split('*')) || [[], []]

  const loopLength =
    colData[0].length > colData[1].length
      ? colData[0].length
      : colData[1].length

  const correctList = data?.correct_answers.split('#')
  const posArr = Array.from(Array(loopLength), (e, i) =>
    correctList.findIndex((item: string) => item === colData[1][i]),
  )

  return (
    <div className={`matching-question ${className}`} style={style}>
      <div className="matching-question__des">
        {data?.question_description || ''}
      </div>
      <table className="matching-question__table">
        <tr>
          {(data?.question_text || data?.audio) && (
            <th className="left-data"></th>
          )}
          <th className="left-column"></th>
          <th className="right-column"></th>
          <th className="pos-correct">Vị trí đúng</th>
        </tr>
        {data?.question_text && (
          <tr>
            <th className="left-data-col" rowSpan={loopLength + 1}>
              <div className="left-value">{data.question_text || ''}</div>
            </th>
          </tr>
        )}
        {data?.audio && (
          <tr>
            <th className="left-data-audio" rowSpan={loopLength + 1}>
              <div className="audio">
                <audio controls>
                  <source
                    src={
                      data?.audio.startsWith('blob')
                        ? data?.audio
                        : `/upload/${data?.audio || ''}`
                    }
                  />
                </audio>
              </div>
            </th>
          </tr>
        )}
        {Array.from(Array(loopLength), (e, i) => (
          <tr key={i}>
            <td className="col-data">
              <div className="content">{colData[0][i] || ''}</div>
            </td>
            <td className="col-data">
              <div className="content">{colData[1][i] || ''}</div>
            </td>
            <td className="center">
              {posArr[i] !== -1 ? posArr[i] + 1 : 'N/A'}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}
