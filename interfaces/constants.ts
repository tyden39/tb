import {
  DisplayTemplateTableDataType,
  FootnavItemType,
  SidenavItemType,
} from './types'

export const USER_ROLES = {
  Operator: 1,
  Teacher: 2,
}

export const FOOTNAV_ITEMS: FootnavItemType[] = [
  {
    name: 'Contact Us',
    url: '/',
  },
  {
    name: 'Help',
    url: '/',
  },
  {
    name: 'Privacy & Policy',
    url: '/',
  },
]

export const SIDENAV_ITEMS: SidenavItemType[] = [
  {
    id: 0,
    name: 'Tổng quan',
    icon: 'general',
    url: '/',
  },
  {
    id: 1,
    name: 'Ngân hàng cấu trúc',
    icon: 'template',
    baseUrl: ['/templates/[templateSlug]'],
    list: [
      {
        id: 1,
        name: 'Cấu trúc của tôi',
        url: '/templates?m=mine',
        access_role: [-1, USER_ROLES.Teacher],
      },
      {
        id: 2,
        name: 'Cấu trúc của giáo viên',
        url: '/templates?m=teacher',
        access_role: [],
      },
      { id: 3, name: 'Cấu trúc của hệ thống', url: '/templates' },
    ],
  },
  {
    id: 2,
    name: 'Ngân hàng câu hỏi',
    icon: 'question',
    baseUrl: ['/questions/[questionSlug]'],
    list: [
      {
        id: 1,
        name: 'Câu hỏi của tôi',
        url: '/questions?m=mine',
        access_role: [-1, USER_ROLES.Teacher],
      },
      {
        id: 2,
        name: 'Câu hỏi của Giáo viên',
        url: '/questions?m=teacher',
        access_role: [],
      },
      { id: 3, name: 'Câu hỏi của hệ thống', url: '/questions' },
    ],
  },
  {
    id: 3,
    name: 'Ngân hàng đề thi',
    icon: 'unitTest',
    baseUrl: ['/unit-test/[templateSlug]'],
    list: [
      {
        id: 1,
        name: 'Đề thi của tôi',
        url: '/unit-test?m=mine',
        access_role: [-1, USER_ROLES.Teacher],
      },
      {
        id: 2,
        name: 'Đề thi của giáo viên',
        url: '/unit-test?m=teacher',
        access_role: [],
      },
      { id: 3, name: 'Đề thi mẫu', url: '/unit-test' },
    ],
  },
  {
    id: 4,
    name: 'Quản lý người dùng',
    icon: 'user',
    url: '/users',
    access_role: [],
  },
]

export const SIDENAV_ITEM_ICONS: any = {
  general: {
    active: '/images/icons/ic-general-active.png',
    light: '/images/icons/ic-general-light.png',
    white: '/images/icons/ic-general-white.png',
  },
  question: {
    active: '/images/icons/ic-question-active.png',
    light: '/images/icons/ic-question-light.png',
    white: '/images/icons/ic-question-white.png',
  },
  template: {
    active: '/images/icons/ic-template-active.png',
    light: '/images/icons/ic-template-light.png',
    white: '/images/icons/ic-template-white.png',
  },
  unitTest: {
    active: '/images/icons/ic-unit-test-active.png',
    light: '/images/icons/ic-unit-test-light.png',
    white: '/images/icons/ic-unit-test-white.png',
  },
  user: {
    active: '/images/icons/ic-user-active.png',
    light: '/images/icons/ic-user-light.png',
    white: '/images/icons/ic-user-white.png',
  },
}

export const TEMPLATE_TABLE_COL_DATA: DisplayTemplateTableDataType[] = [
  { id: 1, name: 'Name', width: 40, align: 'left', property: 'name' },
  {
    id: 2,
    name: 'Level',
    width: 15,
    align: 'center',
    property: 'templateLevelId',
  },
  { id: 3, name: 'Time', width: 10, align: 'center', property: 'time' },
  {
    id: 4,
    name: 'Total questions',
    width: 15,
    align: 'center',
    property: 'totalQuestions',
  },
]

export const TEMPLATE_UNITTEST_TABLE_COL_DATA: DisplayTemplateTableDataType[] =
  [
    { id: 1, name: 'Tên cấu trúc', width: 40, align: 'left', property: 'name' },
    {
      id: 2,
      name: 'Khối lớp',
      width: 15,
      align: 'center',
      property: 'templateLevelId',
    },
    {
      id: 3,
      name: 'Thời gian (phút)',
      width: 10,
      align: 'center',
      property: 'time',
    },
    {
      id: 4,
      name: 'Tổng số câu hỏi',
      width: 15,
      align: 'center',
      property: 'totalQuestions',
    },
    {
      id: 5,
      name: 'Số lượng kỹ năng',
      width: 15,
      align: 'center',
      property: 'totalQuestions',
    },
  ]
