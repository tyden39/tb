import { CSSProperties, ReactNode } from 'react'

import { Badge, Button } from 'rsuite'

type PropsType = {
  className?: string
  badge?: {
    content: string
    style?: CSSProperties
  }
  style?: CSSProperties
  children: ReactNode
}

export const HeaderAction = ({
  className = '',
  badge,
  style,
  children,
}: PropsType) => {
  return (
    <div className={`a-header-action ${className}`} style={style}>
      <Badge
        content={badge?.content ? badge.content : false}
        style={badge?.style}
      >
        <Button appearance="subtle">{children}</Button>
      </Badge>
    </div>
  )
}
