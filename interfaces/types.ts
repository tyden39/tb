import { Dispatch, SetStateAction, CSSProperties } from 'react'
import { ReactNode } from 'react'

export type BreadcrumbItemType = {
  name: string
  url: string | null
  as?: string | null
}

export type FootnavItemType = {
  name: string
  url: string
}

export type SidenavItemType = {
  id: number
  name: string
  icon: 'general' | 'question' | 'template' | 'unitTest' | 'user'
  url?: string
  baseUrl?: string[]
  list?: {
    id: number
    name: string
    url?: string
    access_role?: number[] // undefined: all, []: only admin, [1 , 2]: admin and 1 and 2, [-1]: not include admin
    onClick?: () => void
  }[]
  onClick?: () => void
  access_role?: number[]
}

export type TemplateListItemApiType = {
  id: number
  name: string
  template_level_id: number
  total_question: number
  total_point: number
  time: number
  deleted: 0 | 1
  status: 0 | 1
  created_date: string
  created_by: string
  sections?: SectionConstantType[]
}

export type TemplateListItemType = {
  id: number
  name: string
  templateLevelId: number
  totalQuestions: number
  totalPoints: number
  time: number
  status: 0 | 1
  sections?: string[]
}

export type TemplateLevelConstantApiType = {
  id: number
  name: string
}

export type SectionConstantApiType = {
  id: number
  name: string
  deleted: 0 | 1
  created_date: string
}

export type SectionConstantType = {
  id: number
  name: string
}

export type TemplateDataType = {
  id: number
  name: string
  templateLevelId: number
  totalQuestion: number
  totalPoints: number
  time: number
  status: 0 | 1
  sections: SectionDataType[]
}

export type SectionDataType = {
  id?: number
  sectionId: number
  parts: PartDataType[]
}

export type PartDataType = {
  id?: number
  name: string
  questionTypes: string
  totalQuestion: number
  points: number
}

export type TemplateDetailApiType = {
  id: number
  name: string
  template_level_id: number
  time: number
  total_question: number
  total_point: number
  sections: TemplateDetailSectionApiType[]
  deleted: 0 | 1
  status: 0 | 1
  created_date: string
  created_by: string
}

export type TemplateDetailSectionApiType = {
  id: number
  section_id: number
  parts: TemplateDeTailSectionPartApiType[]
}

export type TemplateDeTailSectionPartApiType = {
  id: number
  name: string
  question_types: string
  total_question: number
  points: number
  template_section_id: number
}

export type QuestionContextType = {
  search: QuestionSearchType
  setSearch: Dispatch<SetStateAction<QuestionSearchType>>
}

export type TaskSelectType = {
  code: string
  display: string
}

export type QuestionDataType = {
  id: string
  publisher: string
  test_type: string
  series: string
  grade: string
  cerf: string
  format: string
  types: string
  skills: number
  question_type: string
  level: string
  group: string
  parent_question_description: string
  parent_question_text: string
  question_description: string
  question_text: string
  image: string
  video: string
  audio: string
  answers: string
  correct_answers: string
  points: number
  audio_script: string
  scope: number
  created_by: string
  total_question: number
}

export class UserDataType {
  id: string
  user_name: string
  email: string
  password: string
  is_admin: number
  deleted: number
  user_role_id: number
  user_role_name: string
  redirect: string
}

export class RoleDataType {
  id: number
  name: string
}

export interface DefaultPropsType {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export interface StructType {
  code: string | number
  display: string
}

export interface TemplatetableColDataType {
  id: number
  name: string
  width: number
  align: CSSProperties
  property: string
}

export type UnitTestDataType = {
  id: number
  name: string
  total_question: number
  is_publish: number
  time: number
}

export interface GlobalModalType {
  id: string
  data?: any
}

export type QuestionSearchType = {
  publisher?: string
  series?: string
  grade?: string
  skills?: number
  level?: string
  question_type?: string
  question_text?: string
  page_index: number
}
export interface DisplayTemplateTableDataType {
  id: number
  name: string
  width: number
  align: 'left' | 'center' | 'right'
  property: string
}

export interface MyCustomCSS extends CSSProperties {
  '--image': string
}
