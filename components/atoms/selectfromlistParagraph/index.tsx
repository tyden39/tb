import { DefaultPropsType } from '../../../interfaces/types'
import { SLAnswersDropdown } from '../selectfromlistAnswersDropdown'

interface PropsType extends DefaultPropsType {
  correctOptions: string[]
  data: string
  options: any[]
}

export const SLParagraph = ({
  className = '',
  correctOptions,
  data,
  options,
  style,
}: PropsType) => {
  const transformData = data.split('%s%')

  return (
    <div className={`a-sl-paragraph ${className}`} style={style}>
      <div className="a-sl-paragraph__title">
        <p>
          {transformData.map((item: string, i: number) => (
            <>
              {item}
              {i !== transformData.length - 1 && (
                <SLAnswersDropdown
                  data={options[i] || []}
                  selected={correctOptions[i] || ''}
                />
              )}
            </>
          ))}
        </p>
      </div>
    </div>
  )
}
