import { DefaultPropsType } from '../../../interfaces/types'

export const SidebarDivider = ({ className = '', style }: DefaultPropsType) => {
  return <div className={`a-sidebar-divider ${className}`} style={style}></div>
}
