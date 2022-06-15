import { StructType } from './types'

export const PUBLISHER_SELECTIONS: StructType[] = [
  { code: 'NA', display: 'Không xác định' },
  { code: 'DTP', display: 'DTP' },
  { code: 'EX', display: 'EXPRESS' },
]

export const SERIES_SELECTIONS: StructType[] = [
  { code: 'NA', display: 'Không xác định' },
  { code: 'IW', display: 'I-learn Smart World' },
  { code: 'IW1', display: 'I-learn Smart World 1' },
  { code: 'MS', display: 'Math & Science' },
  { code: 'RO', display: 'Right-on!' },
  { code: 'IS', display: 'i-learn smart start' },
]

export const LEVEL_SELECTIONS: StructType[] = [
  { code: 'NA', display: 'Không xác định' },
  { code: 'M1', display: 'M1' },
  { code: 'M2', display: 'M2' },
  { code: 'M3', display: 'M3' },
  { code: 'M4', display: 'M4' },
]

export const TEMPLATE_LEVEL_SELECTIONS: StructType[] = [
  { code: 'M1', display: 'M1 - Nhận biết' },
  { code: 'M2', display: 'M2 - Hiểu' },
  { code: 'M3', display: 'M3 - Vận dụng' },
  { code: 'M4', display: 'M4 - Vận dụng cao' },
]

export const GRADE_SELECTIONS: StructType[] = [
  { code: 'G6', display: 'Lớp 6' },
  { code: 'G7', display: 'Lớp 7' },
  { code: 'G8', display: 'Lớp 8' },
  { code: 'G9', display: 'Lớp 9' },
]

export const CERF_SELECTIONS: StructType[] = [
  { code: 'NA', display: 'Không xác định' },
  { code: 'PA1Y', display: 'Pre A1 starters' },
  { code: 'A1Y', display: 'A1 Movers' },
  { code: 'A2Y', display: 'A2 Flyers' },
  { code: 'A1', display: 'Beginner' },
  { code: 'A1+', display: 'False beginner' },
  { code: 'A2', display: 'Elementary' },
  { code: 'B1', display: 'Pre-intermediate' },
  { code: 'B1+', display: 'Intermediate' },
  { code: 'B2', display: 'Upper-intermediade' },
  { code: 'C1', display: 'Advanced' },
  { code: 'C2', display: 'Proficiency' },
]

export const FORMAT_SELECTIONS: StructType[] = [
  { code: 'NA', display: 'Không xác định' },
  { code: 'DO', display: 'DOET' },
  { code: 'CA', display: 'CAMBRIDGE' },
]

export const TEST_TYPE_SELECTIONS: StructType[] = [
  // { code: 'NA', display: 'Không xác định' },
  { code: 'EN', display: 'Tiếng Anh' },
  { code: 'MA', display: 'Toán' },
]

export const TYPES_SELECTIONS: StructType[] = [
  { code: 'NA', display: 'Không xác định' },
  { code: 'PT', display: 'Placement tests' },
  { code: 'UT', display: 'Unit tests' },
  { code: 'PGT', display: 'Progress tests' },
  { code: 'M1T', display: 'Midterm 1 tests' },
  { code: 'T1T', display: 'Term 1 tests' },
  { code: 'M2T', display: 'Midterm 2 tests' },
  { code: 'T2T', display: 'Term 2 tests' },
]

export const SKILLS_SELECTIONS: StructType[] = [
  { code: 'PR', display: 'Pronunciation' },
  { code: 'VO', display: 'Vocab' },
  { code: 'GR', display: 'Grammar' },
  { code: 'RE', display: 'Reading' },
  { code: 'WR', display: 'Writing' },
  { code: 'LI', display: 'Listening' },
  { code: 'SP', display: 'Speaking' },
  //{ code: 'UE', display: 'Use of English' },
]

export const TASK_SELECTIONS: StructType[] = [
  { code: 'MC1', display: 'Multiple Choice Question 1' },
  { code: 'MC2', display: 'Multiple Choice Question 2' },
  { code: 'MC3', display: 'Multiple Choice Question 3' },
  { code: 'MC4', display: 'Multiple Choice Question 4' },
  { code: 'MC5', display: 'Multiple Choice Question 5' },
  { code: 'MC6', display: 'Multiple Choice Question 6' },
  { code: 'FB1', display: 'Fill In The Blanks 1' },
  { code: 'FB2', display: 'Fill In The Blanks 2' },
  { code: 'FB3', display: 'Fill In The Blanks 3' },
  { code: 'FB4', display: 'Fill In The Blanks 4' },
  { code: 'FB5', display: 'Fill In The Blanks 5' },
  { code: 'SL1', display: 'Select from list' },
  { code: 'DD1', display: 'Drag and Drop' },
  { code: 'SA1', display: 'Short Answer' },
  { code: 'TF1', display: 'True False 1' },
  { code: 'TF2', display: 'True False 2' },
  { code: 'MG1', display: 'Matching 1' },
  { code: 'MG2', display: 'Matching 2' },
  { code: 'MG3', display: 'Matching 3' },
  { code: 'MR1', display: 'Multiple Response question 1' },
  { code: 'MR2', display: 'Multiple Response question 2' },
  { code: 'MR3', display: 'Multiple Response question 3' },
  { code: 'LS1', display: 'Liker Scale 1' },
  { code: 'LS2', display: 'Liker Scale 2' },
]

export const PRACTICE_TEST_ACTIVITY: any = {
  MC1: 1,
  MC2: 1,
  MC3: 1,
  MC4: 4,
  MC5: 11,
  MC6: 11,
  FB1: 2,
  FB2: 3,
  FB3: 3,
  FB4: 3,
  FB5: 14,
  SL1: 5,
  DD1: 6,
  SA1: 7,
  TF1: 8,
  TF2: 8,
  MG1: 9,
  MG2: 9,
  MG3: 9,
  MR1: 12,
  MR2: 12,
  MR3: 12,
  LS1: 15,
  LS2: 15,
}

export const QUESTION_CREATED_BY: StructType[] = [
  { code: '0', display: 'Câu hỏi của hệ thống' },
  { code: '1', display: 'Câu hỏi của tôi' },
]

export const TEMPLATE_CREATED_BY: StructType[] = [
  { code: '0', display: 'Cấu trúc của hệ thống' },
  { code: '1', display: 'Cấu trúc của tôi' },
]

export const ACTIVE_STATUS: StructType[] = [
  { code: 'AC', display: 'Hoạt động' },
  { code: 'DI', display: 'Không hoạt động' },
]

export const TASK_DESCRIPTION: any = {
  MC1: 'Câu hỏi dạng text điền vào chỗ trống gợi ý',
  MC2: 'Câu hỏi dạng có hình gợi ý',
  MC3: 'Câu hỏi dạng text gợi ý',
  MC4: 'Chọn đáp án, có từ gạch chân (biến thể của dạng 3)',
  MC5: 'Đọc đoạn văn và trả lời câu hỏi (theo group)',
  MC6: 'Nghe và trả lời câu hỏi (theo group)',
  FB1: 'Điền vào chỗ trống với từ gợi ý sẵn',
  FB2: 'Điền từ thích hợp vào chỗ trống',
  FB3: 'Nghe và điền từ bất kỳ vào chỗ trống (Fill in the blanks) cho phù hợp với đoạn văn',
  FB4: 'Điền vào chỗ trống cho đoạn văn theo gợi ý từ hình ảnh',
  FB5: 'Điền vào chỗ trống cho các câu dựa vào hình ảnh gợi ý',
  SL1: 'Điền vào ô trống bằng cách lựa chọn các đáp án cho sẵn',
  DD1: 'Sắp xếp các từ thành câu hoàn chỉnh',
  SA1: 'Viết lại câu theo gợi ý (nếu có) để không thay đổi nghĩa của câu cho trước',
  TF1: 'Nghe audio và trả lời câu hỏi True-False',
  TF2: 'Đọc đoan văn và trả lời câu hỏi True-False',
  MG1: 'Đọc đoạn văn và nối các câu ở cột A với câu trả lời đúng ở cột B (cột A cố định)',
  MG2: 'Nối các câu ở cột trái với câu trả lời đúng ở cột bên phải',
  MG3: 'Nghe và nối các câu ở cột trái với câu trả lời đúng ở cột bên phải',
  MR1: 'Lựa chọn các đáp án đúng từ các từ cho sẵn',
  MR2: 'Nghe audio và trả lời câu hỏi bằng cách lựa chọn các từ cho sẵn (dành cho câu hỏi ngắn)',
  MR3: 'Nghe audio và trả lời câu hỏi theo yêu cầu (dành cho hỏi dài)',
  LS1: 'Đoạn đoạn văn và trả lời các câu hỏi',
  LS2: 'Nghe audio và trả lời các câu hỏi',
}
