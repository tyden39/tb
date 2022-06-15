import { useContext, useEffect, useState } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Button } from 'rsuite'

import { UnittestInfoCard } from 'components/atoms/unittestInfoCard'
import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'
import { ProgressUnittest } from 'components/molecules/progressUnittest'
import { UnittestTemplateTableData } from 'components/molecules/unittestTemplateTableData'
import { QuestionPreviewSection } from 'components/organisms/questionPreviewSection'
import { StickyFooter } from 'components/organisms/stickyFooter'
import { Wrapper } from 'components/templates/wrapper'
import useNoti from 'hooks/useNoti'
import { USER_ROLES } from 'interfaces/constants'
import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'
import { userInRight } from 'utils'
import { formatDate } from 'utils/string'

import { callApi } from '../../../api/utils'
import { UnitSectionCard } from '../../molecules/unitSectionCard/index'

export const CreateNewUnittest = ({
  className = '',
  title = '',
  style,
}: any) => {
  const router = useRouter()

  const { getNoti } = useNoti()

  const {
    mode,
    breadcrumbData,
    chosenTemplate,
    templateData,
    totalPages,
    currentPage,
    isLoading,
  } = useContext(SingleTemplateContext)

  const sectionData = chosenTemplate.state?.sections || []

  const totalPoints =
    chosenTemplate.state?.totalPoints || chosenTemplate.state?.point || ''

  const [slider, setSlider] = useState(mode === 'create' ? 0 : 1)
  const [biggestStep, setBiggestStep] = useState(0)

  const getTotalSentence = (arr: any[]) => {
    let totalChosenSentence = 0
    if (arr) {
      arr.forEach((item) => {
        if (item?.total_question) totalChosenSentence += item.total_question
      })
    }
    return totalChosenSentence
  }

  const checkReady = () => {
    if (!chosenTemplate.state?.date[0]) return false
    if (!chosenTemplate.state?.name) return false
    if (!totalPoints) return false
    if (!chosenTemplate.state?.templateLevelId) return false
    if (!chosenTemplate.state?.time) return false
    if (!chosenTemplate.state?.totalQuestion) return false
    return true
  }

  const checkReadyToFinalSubmit = () => {
    let check = true
    if (
      !chosenTemplate.state?.sections ||
      chosenTemplate.state.sections.length <= 0
    )
      return false
    chosenTemplate.state.sections.forEach((section: any) => {
      if (
        !section?.parts[0] ||
        !section.parts[0]?.name ||
        !section.parts[0]?.questions ||
        !section.parts[0]?.totalQuestion ||
        getTotalSentence(section.parts[0].questions) !==
          section.parts[0].totalQuestion
      )
        check = false
    })
    return check
  }

  const handleMoveToThirdStep = () => {
    // thong tin chung
    const unitTestTotalQuestion = chosenTemplate.state?.totalQuestion || 0
    if (!unitTestTotalQuestion) {
      getNoti('error', 'topEnd', 'Tổng số câu hỏi đề thi phải lớn hơn 0')
      return
    }
    const unitTestTotalPoint = totalPoints || 0
    if (!unitTestTotalPoint) {
      getNoti('error', 'topEnd', 'Tổng số điểm đề thi phải lớn hơn 0')
      return
    }

    // thong tin chi tiet vs thong tin chung
    let skillTotalQuestion = 0
    let skillTotalPoint = 0
    let existEmptyName = false
    if (chosenTemplate.state?.sections)
      chosenTemplate.state.sections.forEach((section: any) => {
        if (section?.parts[0]) {
          if (!section.parts[0]?.name && !existEmptyName) existEmptyName = true
          if (section.parts[0]?.totalQuestion)
            skillTotalQuestion += section.parts[0]?.totalQuestion
          if (section.parts[0]?.points)
            skillTotalPoint += section.parts[0]?.points
        }
      })

    if (existEmptyName) {
      getNoti('error', 'topEnd', 'Tên phần thi không được để trống')
      return
    }
    if (skillTotalQuestion && skillTotalQuestion !== unitTestTotalQuestion) {
      getNoti(
        'error',
        'topEnd',
        'Tổng số câu hỏi các kĩ năng phải bằng tổng số câu hỏi đề thi',
      )
      return
    }
    skillTotalPoint = Math.round(skillTotalPoint * 100) / 100
    if (skillTotalPoint && skillTotalPoint !== unitTestTotalPoint) {
      getNoti(
        'error',
        'topEnd',
        'Tổng số điểm các kĩ năng phải bằng tổng số điểm đề thi',
      )
      return
    }

    if (!chosenTemplate.state.date[0]) {
      getNoti('error', 'topEnd', 'Ngày bắt đầu không được trống')
      return
    }
    const date = chosenTemplate.state.date.map((item: number) =>
      item ? formatDate(item) : null,
    )

    if (date[1]) {
      if (
        date[1] !== [date[0]] &&
        chosenTemplate.state.date[0] > chosenTemplate.state.date[1]
      ) {
        getNoti('error', 'topEnd', 'Ngày bắt đầu phải trước ngày kết thúc')
        return
      }
    }

    // move to 3rd step
    setSlider(2)
    setBiggestStep(2)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slider])

  return (
    <Wrapper
      className={`p-create-new-template p-detail-format ${className}`}
      pageTitle={title}
      style={style}
    >
      <div className="p-detail-format__breadcrumb">
        <BreadCrumbNav data={breadcrumbData} />
      </div>
      <div
        className="p-detail-format__progress"
        style={
          ['update', 'detail'].includes(mode)
            ? { margin: '2.4rem 0 0 0' }
            : null
        }
      >
        {mode === 'create' && (
          <ProgressUnittest
            max={biggestStep}
            setMax={setBiggestStep}
            value={slider}
            setValue={setSlider}
          />
        )}
        {['update', 'detail'].includes(mode) && (
          <>
            <Button
              className="__progress-btn"
              data-active={slider === 1}
              onClick={() => setSlider(1)}
            >
              Xem thông tin
            </Button>
            <Button
              className="__progress-btn"
              data-active={slider === 2}
              onClick={() => setSlider(2)}
            >
              Xem lại đề thi
            </Button>
          </>
        )}
      </div>
      {slider === 0 && mode === 'create' && (
        <>
          {templateData.length > 0 ? (
            <UnittestTemplateTableData
              className="templates-table"
              title="Chọn cấu trúc đề thi"
              data={templateData}
              total={totalPages}
              pageIndex={currentPage}
              nextStep={() => {
                if (biggestStep < 1) setBiggestStep(1)
                setSlider(1)
              }}
            />
          ) : (
            <div
              className="o-question-drawer__empty"
              style={{ minHeight: '50vh', paddingTop: 32, paddingBottom: 32 }}
            >
              <img
                className="__banner"
                src="/images/collections/clt-emty-template.png"
                alt="banner"
              />
              <p className="__description">
                Chưa có đề thi nào trong danh sách.
                <br />
                Vui lòng tạo mới để quản lý
              </p>
              <Button
                className="__submit"
                onClick={() =>
                  router.push(
                    '/unit-test/[templateSlug]',
                    '/questions/create-new-unittest',
                  )
                }
              >
                Tạo đề thi
              </Button>
            </div>
          )}
        </>
      )}
      {slider === 1 && (
        <div className="p-detail-format__container">
          <div className="container-info">
            <div className="container-title">
              <h5>THÔNG TIN CHUNG</h5>
            </div>
            <UnittestInfoCard />
          </div>
          <div className="container-section-list">
            <div className="container-title">
              <h5>THÔNG TIN CHI TIẾT</h5>
            </div>
            <UnitSectionCard isReady={checkReady()} />
          </div>
          <StickyFooter>
            <div className="container-footer" style={{ width: '100%' }}>
              <Button
                className="__submit"
                disabled={!checkReadyToFinalSubmit()}
                onClick={handleMoveToThirdStep}
              >
                <span>Tiếp theo</span>
              </Button>
            </div>
          </StickyFooter>
        </div>
      )}
      {slider === 2 && (
        <div className="p-detail-format__preview">
          {sectionData.map((item: any) => (
            <QuestionPreviewSection key={item.id} data={item} />
          ))}
          <FinalSubmit />
        </div>
      )}
    </Wrapper>
  )
}

const FinalSubmit = () => {
  const router = useRouter()

  const [session] = useSession()
  const checkScope = userInRight([USER_ROLES.Operator], session)
  const isAdmin = userInRight([], session)

  const { chosenTemplate, mode } = useContext(SingleTemplateContext)
  const { globalModal }: any = useContext(WrapperContext)

  const totalPoints =
    chosenTemplate.state?.totalPoints || chosenTemplate.state?.point || ''

  const handleFinalSubmit = async () => {
    const formData = {} as any
    formData.id = mode === 'update' ? chosenTemplate.state.id : null
    formData.template_id =
      mode === 'update'
        ? chosenTemplate.state.templateId
        : chosenTemplate.state.id
    formData.name = chosenTemplate.state?.name || ''
    formData.template_level_id = chosenTemplate.state?.templateLevelId || null
    formData.time = chosenTemplate.state?.time || null
    formData.total_question = chosenTemplate.state?.totalQuestion || null
    formData.total_point = totalPoints || null
    formData.start_date = chosenTemplate.state?.date[0] || null
    formData.end_date = chosenTemplate.state?.date[1] || null
    formData.scope = checkScope ? 0 : 1
    const sections = [] as any[]
    if (chosenTemplate.state?.sections)
      chosenTemplate.state.sections.forEach((section: any) => {
        const returnSection = {} as any
        let formSkills = []
        if (Array.isArray(section?.sectionId)) formSkills = section.sectionId
        else
          formSkills = section?.sectionId
            ? `${section.sectionId}`.split(',')
            : []
        returnSection.section = formSkills
        const parts = [] as any[]
        if (section?.parts)
          section.parts.forEach((part: any) => {
            const returnPart = {} as any
            returnPart.name = part?.name
            returnPart.question_types = part.questionTypes
            returnPart.total_question = part.totalQuestion
            returnPart.points = part.points
            returnPart.questions = part?.questions
              ? part.questions.map((question: any) => question.id)
              : []
            parts.push(returnPart)
          })
        returnSection.parts = parts
        sections.push(returnSection)
      })
    formData.sections = sections
    const response: any = await callApi(
      '/api/unit-test',
      mode === 'update' ? 'put' : 'post',
      'Token',
      formData,
    )
    if (response && mode === 'update') window.location.reload()
    if (response?.id && response?.userId && mode === 'create') {
      globalModal.setState({
        id: 'share-link',
        content: { id: response.id, userId: response.userId },
      })
    }
  }

  if (mode === 'detail') {
    if (
      isAdmin ||
      (!router.query?.m && checkScope) ||
      (router?.query.m === 'mine' && !checkScope)
    )
      return (
        <StickyFooter>
          <div className="preview-footer" style={{ width: '100%' }}>
            <Button
              className="__submit"
              onClick={() =>
                (window.location.href = `/unit-test/${router.query?.templateSlug}?mode=edit`)
              }
            >
              <span>Chỉnh sửa</span>
            </Button>
          </div>
        </StickyFooter>
      )
    else return <></>
  } else
    return (
      <StickyFooter>
        <div className="preview-footer" style={{ width: '100%' }}>
          <Button className="__submit" onClick={handleFinalSubmit}>
            <span>Hoàn tất</span>
          </Button>
        </div>
      </StickyFooter>
    )
}
