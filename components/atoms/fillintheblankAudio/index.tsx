import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data?: string
}

export const FBAudio = ({ className = '', data, style }: PropsType) => {
  return (
    <div className={`a-fb-audio ${className}`} style={style}>
      <div className="a-fb-audio__audio">
        <audio controls>
          <source src={data} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )
}
