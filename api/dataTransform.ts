import {
  SectionConstantApiType,
  SectionConstantType,
  TemplateDetailApiType,
  TemplateDataType,
  TemplateListItemType,
  TemplateDetailSectionApiType,
  TemplateDeTailSectionPartApiType,
  SectionDataType,
  PartDataType,
} from 'interfaces/types'

export const templateListTransformData = (data: any): TemplateListItemType => {
  if (!data) return {} as any
  return {
    id: data.id,
    name: data.name,
    sections: (data?.sections.map((item: any) =>
      item?.name ? item.name.split(',') : [],
    ) || []) as string[][],
    templateLevelId: data.template_level_id,
    totalQuestions: data.total_question,
    totalPoints: data.total_point,
    totalUnitTests: data?.total_unit_test || 0,
    time: data.time,
    status: data.status,
  } as any
}

export const sectionConstantTransform = (
  data: SectionConstantApiType,
): SectionConstantType => {
  if (!data) return {} as SectionConstantType
  return {
    id: data.id,
    name: data.name,
  } as SectionConstantType
}

export const templateDetailTransform = (
  data: TemplateDetailApiType,
): TemplateDataType => {
  if (!data) return {} as TemplateDataType
  return {
    id: data?.id || null,
    name: data?.name || '',
    templateLevelId: data?.template_level_id || '',
    time: data?.time || 0,
    totalPoints: data?.total_point || 0,
    totalQuestion: data?.total_question || 0,
    // date:
    sections: data.sections.map(templateDetailSectionTransform),
  } as TemplateDataType
}

export const templateDetailSectionTransform = (
  data: TemplateDetailSectionApiType,
): SectionDataType => {
  if (!data) return {} as SectionDataType
  return {
    id: data.id,
    sectionId: data.section_id,
    parts: data.parts.map(templateDetailSectionPartTransform),
  } as SectionDataType
}

export const templateDetailSectionPartTransform = (
  data: TemplateDeTailSectionPartApiType,
): PartDataType => {
  if (!data) return {} as PartDataType
  return {
    id: data.id,
    name: data.name,
    questionTypes: data.question_types,
    totalQuestion: data.total_question,
    points: data.points,
    sectionId: data.template_section_id,
  } as PartDataType
}

export const practiceTestQuestionDataTransform = (
  data: any,
  pointOnceQuestion: number,
  totalPoint: number,
) => {
  if (!data) return null
  return {
    groupId: data?.groupId || null,
    list: [{ ...data }],
    name: '',
    pointOnceQuestion: pointOnceQuestion,
    totalPoint: totalPoint,
  } as any
}

export const practiceTestDataTransform = (data: any) => {
  if (!data) return null

  const pointOnceQuestion =
    data?.totalPoint || 1 / data?.list ? data.list.length : 1

  return {
    id: data?.id || null,
    list: data?.list
      ? data.list.map((item: any) =>
          practiceTestQuestionDataTransform(
            item,
            pointOnceQuestion,
            data?.totalPoint || 1,
          ),
        )
      : [],
    name: data?.name || '',
    totalGroup: data?.totalGroup || 1,
    totalPoint: data?.totalPoint || 1,
    code: data?.code || '',
  } as any
}
