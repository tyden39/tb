import { useState } from 'react'

import { useRouter } from 'next/router'

import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'
import { USER_ROLES } from 'interfaces/constants'
import { QuestionContext } from 'interfaces/contexts'

import { QuestionContainer } from '../../components/organisms/questionContainer'
import { Wrapper } from '../../components/templates/wrapper'
import { BreadcrumbItemType, QuestionSearchType } from '../../interfaces/types'

export default function QuestionsPage() {
  const router = useRouter()

  const pageTitle = router.query.m
    ? `Câu hỏi của ${router.query.m === 'mine' ? 'tôi' : 'giáo viên'}`
    : 'Câu hỏi của hệ thống'

  const breadcrumbData: BreadcrumbItemType[] = [
    { name: 'Tổng quan', url: '/' },
    {
      name: pageTitle,
      url: null,
    },
  ]

  const [search, setSearch] = useState<QuestionSearchType>({ page_index: 0 })

  return (
    <QuestionContext.Provider value={{ search, setSearch }}>
      <Wrapper
        className="p-questions"
        pageTitle={pageTitle}
        access_role={[USER_ROLES.Operator, USER_ROLES.Teacher]}
      >
        <div className="p-questions__container">
          <div className="p-detail-format__breadcrumb">
            <BreadCrumbNav data={breadcrumbData} />
          </div>
          <QuestionContainer />
        </div>
      </Wrapper>
    </QuestionContext.Provider>
  )
}
