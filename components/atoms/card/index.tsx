import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  title: string
}

export const Card = ({ className = '', title, style, children }: PropsType) => {
  return (
    <div className={`a-card ${className}`} style={style}>
      <div className="a-card__header">
        <h5 className="header-title">{title}</h5>
      </div>
      {children}
    </div>
  )
}
