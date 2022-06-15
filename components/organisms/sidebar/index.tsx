import { Button } from 'rsuite'

import { DefaultPropsType } from '../../../interfaces/types'
import { Sidenav } from '../../molecules/sidenav'

interface Props extends DefaultPropsType {
  isExpand: boolean
  onToggle: () => void
}

export const Sidebar = ({
  className = '',
  isExpand,
  style,
  onToggle,
}: Props) => {
  return (
    <aside
      className={`o-sidebar ${className}`}
      data-expand={isExpand}
      style={style}
    >
      <Button className="o-sidebar__toggle" onClick={onToggle}>
        <img src="/images/icons/ic-arrow-left-active.png" alt="toggle" />
      </Button>
      <div className="o-sidebar__brand">
        <img
          className="brand-logo"
          src="/images/collections/clt-logo.png"
          alt=""
        />
      </div>
      <div
        className="o-sidebar__sidenav"
        style={{ overflow: isExpand ? 'auto' : 'unset' }}
      >
        <Sidenav isExpand={isExpand} />
      </div>
    </aside>
  )
}
