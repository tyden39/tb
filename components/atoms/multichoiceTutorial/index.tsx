import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  data?: string
}

export const MultiChoicesTutorial = ({
  className = '',
  data = '',
  style,
}: Props) => {
  return (
    <div className={`a-multichoicetutorial ${className}`} style={style}>
      <div className="a-multichoicetutorial__title">{data}</div>
    </div>
  )
}
