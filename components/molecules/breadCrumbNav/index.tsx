import Link from 'next/link'

import { DefaultPropsType, BreadcrumbItemType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  data: BreadcrumbItemType[]
}

export const BreadCrumbNav = ({ className = '', data, style }: Props) => {
  return (
    <div className={`m-breadcrumb-nav ${className}`} style={style}>
      {data.map((item, i: number) => (
        <div key={i} className="m-breadcrumb-nav__item">
          {item.url ? (
            <Link href={item.url}>
              <a>{item.name}</a>
            </Link>
          ) : (
            <span>{item.name}</span>
          )}
        </div>
      ))}
    </div>
  )
}
