import { CSSProperties } from 'react'

import { useRouter } from 'next/dist/client/router'
import { Breadcrumb } from 'rsuite'

import { BreadcrumbItemType } from '../../../interfaces/types'

type PropsType = {
  className?: string
  data: BreadcrumbItemType[]
  style?: CSSProperties
}

export const BreadcrumbNavigation = ({
  className = '',
  data,
  style,
}: PropsType) => {
  const router = useRouter()

  if (data.length <= 0) return <></>

  return (
    <div className={`m-breadcrumb-navigation ${className}`} style={style}>
      <Breadcrumb>
        {data.map((item, i) =>
          i >= data.length - 1 ? (
            <Breadcrumb.Item key={item.url} active>
              {item.name}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item
              key={item.url}
              onClick={() => router.push(item.url)}
            >
              {item.name}
            </Breadcrumb.Item>
          ),
        )}
      </Breadcrumb>
    </div>
  )
}
