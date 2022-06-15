import { PARTS_TYPE } from '../../../interfaces/types'
import { CardPart } from '../../molecules/cardPart'

export const Parts = ({ className = '', parts, style }) => {
  return (
    <div className={`pt-o-parts ${className}`} style={style}>
      <ol className="pt-o-parts__list">
        {parts.map((part, i) => (
          <li key={part.id} className="__item">
            <CardPart data={part} index={i + 1} />
          </li>
        ))}
      </ol>
    </div>
  )
}

Parts.propTypes = PARTS_TYPE
