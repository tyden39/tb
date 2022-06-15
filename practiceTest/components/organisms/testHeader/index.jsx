import { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { Header } from 'rsuite'

import { TEST_MODE } from '../../../interfaces/constants'
import { PageTestContext } from '../../../interfaces/contexts'
import { CustomButton } from '../../atoms/button'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'
import { CountDownClock } from '../../molecules/countDownClock'
import { TimesUpWarning } from '../../molecules/modals/timesUpWarning'
import { PartDropdown } from '../../molecules/partDropdown'

export const TestHeader = () => {
  const router = useRouter()
  const gradeId = router?.query?.gradeId ? router.query.gradeId : ''

  const { currentPart, currentQuestion, mode, progress, testInfo } =
    useContext(PageTestContext)

  const { testTime } = testInfo;
  const [isCorrect, setIsCorrect] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)

  const handleToggleReviewClick = () => {
    if (mode.state === TEST_MODE.check) mode.setState(TEST_MODE.review)
    else if (mode.state === TEST_MODE.review) mode.setState(TEST_MODE.check)
  }

  useEffect(() => {
    if (mode.state === TEST_MODE.play) return
    if ([TEST_MODE.check, TEST_MODE.review].includes(mode.state)) {
      const status =
        progress.state[currentPart.index][currentQuestion.index[0]].status
      if (Array.isArray(status))
        setIsCorrect(status.includes(false) ? false : true)
      else setIsCorrect(status)
    }
    if (mode.state !== TEST_MODE.review) mode.setState(TEST_MODE.review)
  }, [currentQuestion.index])

  return (
    <Header className="pt-o-test-header">
      {mode.state === TEST_MODE.play && (
        <>
          <div className="pt-o-test-header__count-down">
            <CountDownClock
              modal={{ state: isOpenModal, setState: setIsOpenModal, testTime: testTime }}
            />
          </div>
          <CustomButton
            className="pt-o-test-header__submit"
            onClick={() => setIsOpenModal(true)}
          >
            <CustomImage
              alt="check"
              src="/pt/images/icons/ic-check.svg"
              yRate={0}
            />
            <span>Submit</span>
          </CustomButton>
        </>
      )}

      <div className="pt-o-test-header__parts-dropdown">
        <PartDropdown />
      </div>

      {[TEST_MODE.check, TEST_MODE.review].includes(mode.state) && (
        <>
          {/* <CustomButton
            className="pt-o-test-header__back"
            onClick={() => router.push('/[gradeId]', `/${gradeId}`)}
          >
            Back to menu
          </CustomButton> */}
          <div className="pt-o-test-header__cr">
            <label
              className={`__label ${isCorrect ? '--success' : '--danger'}`}
            >
              {isCorrect ? 'Correct' : 'Incorrect'}
            </label>
            <CustomButton
              className={`__btn ${
                mode.state === TEST_MODE.check ? '--primary' : '--success'
              }`}
              onClick={() => handleToggleReviewClick()}
            >
              <CustomImage
                className="__icon"
                alt="chat"
                src="/pt/images/icons/ic-chat.svg"
                yRate={0}
              />
              <span className="__text">
                {mode.state === TEST_MODE.check
                  ? 'View my answer'
                  : 'View correct answer'}
              </span>
            </CustomButton>
          </div>
        </>
      )}
    </Header>
  )
}
