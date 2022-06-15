import { useContext, useEffect, useRef } from 'react'
import { Footer } from 'rsuite'
import { PageTestContext } from '../../../interfaces/contexts'

import { PartDirection } from '../../molecules/partDirection'
import { PartPagination } from '../../molecules/partPagination'

export const TestFooter = () => {
  const {currentQuestion} = useContext(PageTestContext)

  const paginationContainer = useRef(null)

  useEffect(() => {
    if (!paginationContainer?.current) return;
    const currentActiveBtn = paginationContainer.current.querySelector('.__list .rs-btn.--active')
    paginationContainer.current.scrollTo({left: currentActiveBtn?.offsetLeft, behavior: 'smooth'})
  }, [currentQuestion])

  return (
    <Footer className="pt-o-test-footer">
      <div ref={paginationContainer} className="pt-o-test-footer__pagination">
        <PartPagination />
      </div>
      <div className="pt-o-test-footer__direction">
        <PartDirection />
      </div>
    </Footer>
  )
}
