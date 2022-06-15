import Link from 'next/link'
import { FaBoxes } from 'react-icons/fa'

import { DefaultPropsType } from '../../../interfaces/types'

export const Brand = ({ className = '', style }: DefaultPropsType) => {
  return (
    <div className={`a-brand ${className}`} style={style}>
      <Link href="/">
        <a className="__link">
          <div className="__logo">
            <FaBoxes />
          </div>
          <h5 className="__name">TEST BANK</h5>
        </a>
      </Link>
    </div>
  )
}
