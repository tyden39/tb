import { DefaultPropsType } from '../../../interfaces/types'

export const SkilCard = ({ className = '', style }: DefaultPropsType) => {
  return <div className={`m-skill-card ${className}`} style={style}></div>
}
