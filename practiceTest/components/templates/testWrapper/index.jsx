import { useContext } from 'react'

import { Container } from 'rsuite'

import { questionListTransform } from '../../../api/dataTransform'
import { SMALL_SIZE_ACTIVITIES } from '../../../interfaces/constants'
import { PageTestContext } from '../../../interfaces/contexts'
import { TEST_WRAPPER_TYPE } from '../../../interfaces/types'
import { TestFooter } from '../../organisms/testFooter'
import { TestHeader } from '../../organisms/testHeader'
import { AuthWrapper } from '../authWrapper'

export const TestWrapper = ({ className = '', style, children }) => {
  const { currentPart, currentQuestion, partData } = useContext(PageTestContext)
  const questionList = questionListTransform(partData, currentPart.index)
  const currentActivityType =
    questionList[currentQuestion.index[0]]?.activityType || null

  return (
    <Container className={`pt-t-test-wrapper ${className}`} style={style}>
      <TestHeader />
      <div className="pt-t-test-wrapper__content">
        <div
          className={`__container ${
            SMALL_SIZE_ACTIVITIES.includes(currentActivityType) ? '--sm' : ''
          }`}
        >
          {children}
        </div>
        <div className="__blur-bg"></div>
      </div>
      <TestFooter />
    </Container>
  )
}

TestWrapper.propTypes = TEST_WRAPPER_TYPE
