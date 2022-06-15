import { CUSTOM_TEXT_TYPE } from '../../../interfaces/types'

export const CustomText = ({
  children,
  className = '',
  style,
  tag = 'span',
}) => {
  const Tag = tag

  return (
    <Tag className={`pt-a-text ${className}`} style={style}>
      {children}
    </Tag>
  )
}

CustomText.propTypes = CUSTOM_TEXT_TYPE
