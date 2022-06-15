import { useContext } from 'react'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Button } from 'rsuite'

import { callApi } from 'api/utils'
import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'
import { StickyFooter } from 'components/organisms/stickyFooter'
import { TemplateInfoCard } from 'components/organisms/templateInfoCard'
import { TemplateSectionCard } from 'components/organisms/templateSectionCard'
import { Wrapper } from 'components/templates/wrapper'
import useNoti from 'hooks/useNoti'
import { USER_ROLES } from 'interfaces/constants'
import { SingleTemplateContext } from 'interfaces/contexts'
import { userInRight } from 'utils'

import { DefaultPropsType } from '../../../interfaces/types'

export const CreateNewTemplate = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const router = useRouter()

  const [session] = useSession()
  const isEditAble = userInRight([USER_ROLES.Operator], session)

  const { getNoti } = useNoti()

  const { templateDetail, breadcrumbData, mode } = useContext(
    SingleTemplateContext,
  )

  const checkReady = () => {
    if (!templateDetail.state?.name) return false
    if (!templateDetail.state?.templateLevelId) return false
    if (!templateDetail.state?.time) return false
    if (!templateDetail.state?.totalQuestion) return false
    if (!templateDetail.state?.point) return false
    return true
  }

  const checkReadyToFinalSubmit = () => {
    if (
      !templateDetail.state?.sections ||
      templateDetail.state.sections.length <= 0
    )
      return false
    let check = true
    templateDetail.state.sections.forEach((section: any) => {
      if (!section?.sectionId || section.sectionId.length <= 0) check = false
      else if (!section?.parts[0]) check = false
      else {
        if (
          !section.parts[0]?.name ||
          !section.parts[0]?.totalQuestion ||
          !section.parts[0]?.points
        )
          check = false
      }
    })
    return check
  }

  const handleCheckSubmit = () => {
    // thong tin chung
    const templateTotalQuestion = templateDetail.state?.totalQuestion || 0
    if (!templateTotalQuestion) {
      getNoti('error', 'topEnd', 'Tổng số câu hỏi cấu trúc phải lớn hơn 0')
      return
    }
    const unitTestTotalPoint = templateDetail.state?.point || 0
    if (!unitTestTotalPoint) {
      getNoti('error', 'topEnd', 'Tổng số điểm cấu trúc phải lớn hơn 0')
      return
    }

    // thong tin chi tiet vs thong tin chung
    let skillTotalQuestion = 0
    let skillTotalPoint = 0
    if (templateDetail.state?.sections)
      templateDetail.state.sections.forEach((section: any) => {
        if (section?.parts[0] && section.parts[0]?.totalQuestion)
          skillTotalQuestion += section.parts[0]?.totalQuestion

        if (section?.parts[0] && section.parts[0]?.totalQuestion)
          skillTotalPoint += section.parts[0]?.points
      })
    skillTotalPoint = Math.round(skillTotalPoint * 100) / 100
    if (skillTotalQuestion && skillTotalQuestion !== templateTotalQuestion) {
      getNoti(
        'error',
        'topEnd',
        'Tổng số câu hỏi các kĩ năng phải bằng tổng số câu hỏi cấu trúc',
      )
      return
    }
    if (skillTotalPoint && skillTotalPoint !== unitTestTotalPoint) {
      getNoti(
        'error',
        'topEnd',
        'Tổng số điểm các kĩ năng phải bằng tổng số điểm cấu trúc',
      )
      return
    }

    handleSubmit()
  }

  const handleSubmit = async () => {
    const formData = {} as any
    formData.name = templateDetail.state?.name || ''
    formData.template_level_id = templateDetail.state?.templateLevelId || null
    formData.time = templateDetail.state?.time || null
    formData.total_question = templateDetail.state?.totalQuestion || null
    formData.total_point = templateDetail.state?.point || null
    formData.status = templateDetail.state?.status || false
    const sections = [] as any[]
    if (templateDetail.state?.sections)
      templateDetail.state.sections.forEach((section: any) => {
        const returnSection = {} as any
        returnSection.section_id = section.sectionId
        const parts = [] as any[]
        if (section?.parts)
          section.parts.forEach((part: any) => {
            const returnPart = {} as any
            returnPart.name = part?.name
            returnPart.question_types = part.questionTypes
            returnPart.total_question = part.totalQuestion
            returnPart.points = part.points
            parts.push(returnPart)
          })
        returnSection.parts = parts
        sections.push(returnSection)
      })
    formData.sections = sections
    const response: any = await callApi(
      `/api/templates${
        mode === 'update' ? `/${templateDetail.state?.id || ''}` : ''
      }`,
      mode === 'update' ? 'put' : 'post',
      'Token',
      formData,
    )
    if (response) {
      if (mode === 'create')
        router.push(`/templates${isEditAble ? '' : '?m=mine'}`)
      else if (mode === 'update') window.location.reload()
    }
  }

  return (
    <Wrapper
      className={`p-create-new-template p-detail-format ${className}`}
      pageTitle={
        router.query?.templateSlug === 'create-new-template'
          ? 'Tạo cấu trúc mới'
          : templateDetail.state?.name || ''
      }
      style={style}
    >
      <div className="p-detail-format__breadcrumb">
        <BreadCrumbNav data={breadcrumbData} />
      </div>
      <div className="p-detail-format__container">
        <div className="container-info">
          <div className="container-title">
            <h5>THÔNG TIN CHUNG</h5>
          </div>
          <TemplateInfoCard isReady={checkReady()} />
        </div>
        <div className="container-section-list">
          <div className="container-title">
            <h5>THÔNG TIN CHI TIẾT</h5>
          </div>
          <TemplateSectionCard isReady={checkReady()} />
        </div>
        <div className="container-footer">
          {mode === 'create' && (
            <StickyFooter containerStyle={{ justifyContent: 'flex-end' }}>
              <Button
                className="__submit"
                disabled={!checkReadyToFinalSubmit()}
                onClick={handleCheckSubmit}
              >
                <span>Lưu</span>
              </Button>
            </StickyFooter>
          )}
          {mode === 'detail' && isEditAble && (
            <StickyFooter containerStyle={{ justifyContent: 'flex-end' }}>
              <Button
                className="__submit"
                onClick={() =>
                  router.push(
                    '/templates/[templateSlug]?mode=edit',
                    `/templates/${templateDetail.state?.id}?mode=edit`,
                  )
                }
              >
                <span>Chỉnh sửa</span>
              </Button>
            </StickyFooter>
          )}
          {mode === 'update' && (
            <StickyFooter containerStyle={{ justifyContent: 'flex-end' }}>
              <Button
                className="__submit"
                disabled={!checkReadyToFinalSubmit()}
                onClick={handleCheckSubmit}
              >
                <span>Lưu</span>
              </Button>
            </StickyFooter>
          )}
        </div>
      </div>
    </Wrapper>
  )
}
