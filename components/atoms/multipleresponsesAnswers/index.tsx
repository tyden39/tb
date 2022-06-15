import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: any[]
  correctData: any[]
}

export const MultipleResponsesAnswers = ({
  className = '',
  data,
  correctData,
  style,
}: PropsType) => {
  const chunkArray = Array.from(
    Array(Math.ceil(data.length / 3)),
    () => [],
  ) as any[]
  data.forEach((item: string, i: number) => {
    const index = Math.floor(i / 3)
    chunkArray[index].push(item)
  })

  return (
    <div className={`a-multiple-responses-answers ${className}`} style={style}>
      <div className="a-multiple-responses-answers__answer">
        {chunkArray.map((arr: string[], i: number) => (
          <ul key={i} className="a-multiple-responses-answers__input ">
            {arr.map((item, j) => (
              <li key={j}>
                <input
                  type="checkbox"
                  className="option-input checkbox"
                  defaultChecked={correctData.includes(item)}
                />
                <label>{item}</label>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
