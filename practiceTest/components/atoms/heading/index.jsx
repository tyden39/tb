import { CUSTOM_HEADING_TYPE } from '../../../interfaces/types'

export const CustomHeading = ({
  children,
  className = '',
  style,
  tag = 'h6',
}) => {
  const Tag = tag

  return (
    <Tag className={`pt-a-heading ${tag} ${className}`} style={style}>
      {children}
    </Tag>
  )
}

CustomHeading.propsTypes = CUSTOM_HEADING_TYPE
