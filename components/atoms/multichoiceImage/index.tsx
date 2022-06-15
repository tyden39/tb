import { DefaultPropsType } from 'interfaces/types'

interface Props extends DefaultPropsType {
  data?: string
}

export const MultiChoicesImage = ({ className = '', data, style }: Props) => {
  return (
    <div className={`a-multichoiceimage ${className}`} style={style}>
      <div className="a-multichoiceimage__thumbnail">
        <img src={data} alt="banner" />
      </div>
    </div>
  )
}
