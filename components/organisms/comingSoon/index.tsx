import { Button } from 'rsuite'

import { DefaultPropsType } from '../../../interfaces/types'

export const ComingSoon = ({ className = '', style }: DefaultPropsType) => {
  return (
    <div className={`o-coming-soon ${className}`} style={style}>
      <img
        className="o-coming-soon__banner"
        src="/images/collections/clt-emty-result.png"
        alt="coming soon"
      />
      <h5 className="o-coming-soon__title">Tính năng sắp ra mắt!</h5>
      <p className="o-coming-soon__description">
        {/* Chúng tôi đang hoàn thiện tính năng này. Bấm nút bên dưới để nhận thông
        báo khi ra mắt */}
        Chúng tôi đang hoàn thiện tính năng này.
      </p>
      {/* <Button className="o-coming-soon__button">Nhận thông báo</Button> */}
    </div>
  )
}
