import { useContext, useEffect, useState } from 'react'

import {
  COUNT_DOWN_TIME,
  COUNT_DOWN_TIME_WARNING,
  TEST_MODE,
} from '../../../interfaces/constants'
import { PageTestContext } from '../../../interfaces/contexts'
import { formatDateTime } from '../../../utils/functions'
import { CustomImage } from '../../atoms/image'
import { CustomText } from '../../atoms/text'
import { TimesUpWarning } from '../modals/timesUpWarning'

export const CountDownClock = ({ modal }) => {
  const { state, setState, testTime } = modal

  const { mode } = useContext(PageTestContext)

  const [countDown, setCountDown] = useState(testTime * 60 * 1000)
  const [isWarning, setIsWarning] = useState(false)
  const [isFirstAuto, setIsFirstAuto] = useState(true)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountDown(countDown - 1000)
    }, 1000)
    if (countDown < COUNT_DOWN_TIME_WARNING.time && !isWarning) {
      setIsWarning(true)
      if (isFirstAuto) {
        setState(true)
        setIsFirstAuto(false)
      }
    }
    if (countDown <= 0) {
      clearInterval(intervalId)
      mode.setState(TEST_MODE.result)
    }
    return () => clearInterval(intervalId)
  }, [countDown, isWarning])

  return (
    <>
      <div className={`pt-m-count-down-clock ${isWarning ? '--warning' : ''}`}>
        <CustomImage
          className="pt-m-count-down-clock__icon"
          alt={
            isWarning
              ? COUNT_DOWN_TIME_WARNING.icon.alt
              : COUNT_DOWN_TIME.icon.alt
          }
          src={
            isWarning
              ? COUNT_DOWN_TIME_WARNING.icon.src
              : COUNT_DOWN_TIME.icon.src
          }
          yRate={0}
        />
        <CustomText tag="span">{formatDateTime(countDown)}</CustomText>
      </div>
      <TimesUpWarning
        status={{
          state: state,
          setState: setState,
        }}
        time={countDown}
      />
    </>
  )
}
