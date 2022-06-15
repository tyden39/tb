export const APP_KEY = {
  appId620: process.env.NEXT_PUBLIC_GRADE_6_APP_KEY,
  appId621: process.env.NEXT_PUBLIC_GRADE_7_APP_KEY,
  appId622: process.env.NEXT_PUBLIC_GRADE_8_APP_KEY,
  appId623: process.env.NEXT_PUBLIC_GRADE_9_APP_KEY,
}

export const APP_EDUHOME_URL = {
  appId620:
    'http://eduhome.com.vn/BookDetail?idGrade=0&idSubject=1&idSeries=0&idSupplement=1011&idTheme=620',
  appId621:
    'http://eduhome.com.vn/BookDetail?idGrade=0&idSubject=1&idSeries=0&idSupplement=1011&idTheme=621',
  appId622:
    'http://eduhome.com.vn/BookDetail?idGrade=0&idSubject=1&idSeries=0&idSupplement=1011&idTheme=622',
  appId623:
    'http://eduhome.com.vn/BookDetail?idGrade=0&idSubject=1&idSeries=0&idSupplement=1011&idTheme=623',
  default: 'http://eduhome.com.vn/?Subject=1&Supplement=1011',
}

export const AUTH_COOKIE = 'pt_user_token'

export const COLOR_RESULT_PROGRESS = [
  '#FF82F3',
  '#36BFFA',
  '#5E70F1',
  '#54D7A8',
  '#F5B11F',
]

export const COLOR_TEST_TYPE = [
  { name: 'blue', icon: '/pt/images/collections/clt-doc-blue.png' },
  { name: 'orange', icon: '/pt/images/collections/clt-doc-orange.png' },
  { name: 'purple', icon: '/pt/images/collections/clt-doc-purple.png' },
  { name: 'green', icon: '/pt/images/collections/clt-doc-green.png' },
]

export const COUNT_DOWN_TIME = {
  icon: {
    src: '/pt/images/icons/ic-clock-blue.svg',
    alt: 'blue clock',
  },
  time: 90 * 60 * 1000,
}

export const COUNT_DOWN_TIME_WARNING = {
  icon: {
    src: '/pt/images/icons/ic-clock-orange.svg',
    alt: 'orange clock',
  },
  time: 5 * 60 * 1000,
}

export const EDU_MODE = 'pt_ed_m'

export const EXPIRED_DATE_AUTH_COOKIE = 'pt_epd_ack'

export const EXPIRED_AUTH_COOKIE_DAY_NUMBER = 7

export const PREFIX_APP_KEY = 'appId'

export const PREFIX_APP_EDU_COOKIE = 'pt_a_ed_ck_'

export const PREFIX_APP_UUID = 'pt_a_uuid_'

export const PREFIX_EDU_COOKIE = '_extension_source_'

export const RESULT_SKILL_NAME = [
  {
    id: 6,
    name: 'Vocabulary',
    code: 'VO'
  },
  {
    id: 7,
    name: 'Grammar',
    code: 'GR'
  },
  {
    id: 5,
    name: 'Reading',
    code: 'RE'
  },
  {
    id: 3,
    name: 'Writing',
    code: 'WR'
  },
  {
    id: 4,
    name: 'Listening',
    code: 'LI'
  },
  {
    id: 2,
    name: 'Speaking',
    code: 'SP'
  },
  {
    id: 8,
    name: 'Use of English',
    code: 'UE'
  },

]

export const SMALL_SIZE_ACTIVITIES = [1, 2, 4, 7]

export const SPECIAL_SCRIPT = ['%b', '%i', '%u']

export const STATUS_GRADE_ICON = {
  normal: {
    src: '/pt/images/icons/ic-arrow-right-blue.svg',
    alt: 'arrow right blue',
  },
  disabled: {
    src: '/pt/images/icons/ic-lock-dark-blue.svg',
    alt: 'lock dark blue',
  },
}

export const TEST_MODE = {
  check: 'check',
  play: 'play',
  result: 'result',
  review: 'review',
}

export const MULTI_CHOICE_QUESTION = [
  {
    question: 'My father _______________ the gardening every Sunday.',
  },
]

export const MULTI_CHOICE_TUTORIAL = [
  {
    instruction: 'Choose the options that best complete the sentences',
  },
]

export const MULTI_CHOICE_ANSWERS = [
  {
    answer1: 'makes',
    answer2: 'does',
    answer3: 'works',
  },
]

export const MULTI_CHOICE_IMAGE = [
  {
    src: 'https://media.istockphoto.com/vectors/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-vector-id1128826884?k=20&m=1128826884&s=170667a&w=0&h=_cx7HW9R4Uc_OLLxg2PcRXno4KERpYLi5vCz-NEyhi0=',
    alt: 'image question',
  },
]

export const MULTI_CHOICE_GENERAL_QUESTION = [
  {
    paragraph:
      'Humans have applied technology to better their life. Humans can build tunnels through huge mountains. Nothing can stop humans from travelling from one place to another. There are canals to cross huge rivers and seas. Scientists even send humans into space, searching for new homes for mankind. The sea also offers a lot of potentials. Some governments are thinking of ﬂoating cities or undersea communities. A bright future is waiting for us!',
  },
]

export const MULTI_CHOICE_LIST_ANSWERS = [
  {
    txt: 'bakery',
    answer: '[Đáp án đúng 1.1]/ [Đáp án đúng 1.2]',
  },
  { txt: 'clothes store', answer: '[Đáp án đúng 2]' },
  { txt: 'shoe store', answer: '[Đáp án đúng 3]' },
  { txt: ' post office', answer: '[Đáp án đúng 4]' },
  { txt: 'bus station', answer: '[Đáp án đúng 5]' },
]

export const SELECT_FROM_LIST_ANSWERS = [
  { id: 1, name: 'Đáp án 2.1', value: 'false' },
  { id: 2, name: 'Đáp án 2.2', value: 'true' },
  { id: 3, name: 'Đáp án 2.3', value: 'false' },
  { id: 4, name: 'Đáp án 2.4', value: 'false' },
]

export const DD_KEYWORD = [
  { id: 1, name: 'is' },
  { id: 2, name: 'Mary' },
  { id: 3, name: 'red T-Shirt' },
  { id: 4, name: 'wearing' },
  { id: 5, name: 'house' },
  { id: 6, name: 'black shorts' },
  { id: 7, name: 'there' },
  { id: 8, name: 'this' },
  { id: 9, name: 'that' },
]

export const MULTI_RESPONSES_ANSWERS = [
  {
    answer1: 'apple',
    answer2: 'fish',
    answer3: 'strawberry',
    answer4: 'banana',
    answer5: 'meat',
    answer6: 'cherry',
  },
]
