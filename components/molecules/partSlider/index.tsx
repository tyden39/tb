import { PartCard } from 'components/atoms/partCard'
import { DefaultPropsType } from 'interfaces/types'

interface PropsType extends DefaultPropsType {
  data: any[]
}

export const PartSlider = ({ className = '', data, style }: PropsType) => {
  return (
    <div className={`m-part-slider ${className}`} style={style}>
      <div className="m-part-slider__container">
        {data.map((item, i) => (
          <PartCard className="container-card" key={i} />
        ))}
      </div>
    </div>
  )
}
