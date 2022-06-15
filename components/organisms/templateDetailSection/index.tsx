import { CSSProperties, ReactNode } from 'react'

import { Block } from '../../atoms/block'

type PropsType = {
  className?: string
  defaultShow?: boolean
  title: string
  style?: CSSProperties
  onDelete?: () => void | null
  children?: ReactNode
}

export const TemplateDetailSection = ({
  className = '',
  defaultShow = true,
  title,
  style,
  onDelete,
  children,
}: PropsType) => {
  return (
    <Block
      className={`o-template-detail-section ${className}`}
      defaultShow={defaultShow}
      title={title}
      style={style}
      onDelete={onDelete}
    >
      <div className="__container">{children}</div>
    </Block>
  )
}
