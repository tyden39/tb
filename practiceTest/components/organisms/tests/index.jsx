import { useContext, useState } from 'react'

import { PageGradeContext } from '../../../interfaces/contexts'
import { TESTS_TYPE } from '../../../interfaces/types'
import { CardTest } from '../../molecules/cardTest'
import { LockedGradeNotification } from '../../molecules/modals/lockedGradeNotification'

export const Tests = ({ className = '', tests, style }) => {
  const { pageData } = useContext(PageGradeContext)

  const [activeItem, setActiveItem] = useState(null)
  const [isShowModal, setIsShowModal] = useState(false)

  return (
    <section className={`pt-o-tests ${className}`} style={style}>
      <ol className="pt-o-tests__list">
        {tests.slice(0, tests.length / 2).map((test, i) => (
          <Item
            key={test.id}
            active={{ state: activeItem, setState: setActiveItem }}
            color={i % 4}
            data={test}
            index={i}
            isShowModal={{ state: isShowModal, setState: setIsShowModal }}
          />
        ))}
      </ol>
      <ol className="pt-o-tests__list">
        {tests.slice(tests.length / 2, tests.length).map((test, i) => (
          <Item
            key={test.id}
            active={{ state: activeItem, setState: setActiveItem }}
            color={(tests.length / 2 + i) % 4}
            data={test}
            isShowModal={{ state: isShowModal, setState: setIsShowModal }}
          />
        ))}
      </ol>
      <LockedGradeNotification
        data={{ name: pageData?.title || 'This Grade' }}
        status={{
          state: isShowModal,
          setState: setIsShowModal,
        }}
      />
    </section>
  )
}

const Item = ({ active, color, data, isShowModal }) => {
  return (
    <li className="__item" data-animate="fade-up">
      <CardTest
        active={active}
        color={color}
        data={data}
        isShowModal={isShowModal}
      />
    </li>
  )
}

Tests.propTypes = TESTS_TYPE
