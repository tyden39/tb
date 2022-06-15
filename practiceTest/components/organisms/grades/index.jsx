import { useState } from 'react'

import { GRADES_TYPE } from '../../../interfaces/types'
import { CustomImage } from '../../atoms/image'
import { CardGrade } from '../../molecules/cardGrade'
import { LockedGradeNotification } from '../../molecules/modals/lockedGradeNotification'

export const Grades = ({ grades }) => {
  const [isShowModal, setIsShowModal] = useState(false)
  const [gradeName, setGradeName] = useState('')

  const handleModalOpen = (name) => {
    setIsShowModal(true)
    setGradeName(name)
  }

  return (
    <section className="pt-o-grades">
      {grades && grades.length > 0 && (
        <ol className="pt-o-grades__list">
          {grades.map((grade, i) => (
            <Item
              key={grade.id}
              data={grade}
              openModal={() => handleModalOpen(grade.name)}
            />
          ))}
        </ol>
      )}
      <div className="pt-o-grades__background" data-animate="fade-in">
        <CustomImage
          alt="grade background"
          src="/pt/images/backgrounds/bg-grade.png"
          fit="fill"
          yRate={13}
        />
      </div>
      <LockedGradeNotification
        data={{ name: gradeName }}
        status={{
          state: isShowModal,
          setState: setIsShowModal,
        }}
      />
    </section>
  )
}

const Item = ({ data, openModal }) => {
  return (
    <li className="__item" data-animate="fade-up">
      <CardGrade data={data} openModal={openModal} />
    </li>
  )
}

Grades.propTypes = GRADES_TYPE
