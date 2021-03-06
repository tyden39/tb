import { CSSProperties, useContext, useEffect, useRef, useState } from 'react'

import FileUploadIcon from '@rsuite/icons/FileUpload'
import ImportIcon from '@rsuite/icons/Import'
import PlusRoundIcon from '@rsuite/icons/PlusRound'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { Collapse } from 'react-collapse'
import { Controller, useForm } from 'react-hook-form'
import readXlsxFile from 'read-excel-file'
import { Button, toaster, Message, Whisper, Tooltip } from 'rsuite'

import { paths } from 'api/paths'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { SelectField } from 'components/atoms/selectField'
import { MultiSelectPicker } from 'components/atoms/selectPicker/multiSelectPicker'
import { QuestionTable } from 'components/molecules/questionTable'
import { USER_ROLES } from 'interfaces/constants'
import { QuestionContext } from 'interfaces/contexts'
import {
  GRADE_SELECTIONS,
  LEVEL_SELECTIONS,
  PUBLISHER_SELECTIONS,
  SERIES_SELECTIONS,
  SKILLS_SELECTIONS,
  TASK_SELECTIONS,
} from 'interfaces/struct'
import { QuestionContextType, QuestionSearchType } from 'interfaces/types'
import { userInRight } from 'utils'
import { useMatchMutate } from 'utils/swr'

type PropsType = {
  className?: string
  style?: CSSProperties
}

export const QuestionContainer = ({ className = '', style }: PropsType) => {
  const router = useRouter()
  const [session] = useSession()
  const isImportable = userInRight([USER_ROLES.Operator], session)
  const isCreatable =
    router.query.m !== undefined || (!router.query.m && isImportable)

  const { search, setSearch } = useContext<QuestionContextType>(QuestionContext)
  const fileImport = useRef(null)
  const fileUpload = useRef(null)
  const formSearch = useRef(null)
  const matchMutate = useMatchMutate()
  const { register, handleSubmit, setValue } = useForm()

  const [isOpenFilterCollapse, setIsOpenFilterCollapse] = useState(false)
  const [triggerReset, setTriggerReset] = useState(false)
  const [filterBagde, setFilterBagde] = useState(0)
  const filterData = useRef<any>({})

  useEffect(() => {
    register('publisher')
    register('series')
    register('grade')
    register('skills')
    register('level')
    register('question_type')
    register('question_text')
  }, [])

  const onChangeFile = () => {
    if (fileImport.current.files.length > 0) {
      readXlsxFile(fileImport.current.files[0], { schema }).then(
        async (fileData) => {
          try {
            const res = await fetch(paths.api_questions_import, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(fileData.rows),
            })
            const json = await res.json()

            if (!res.ok) throw Error(json.message)

            toaster.push(
              <Message showIcon type="success">
                Nh???p danh s??ch c??u h???i th??nh c??ng
              </Message>,
            )
            matchMutate(new RegExp(`^${paths.api_questions}\\?page=`))
          } catch (e: any) {
            throw Error(e.message)
          }
        },
      )
    }
  }

  const onChangeFileUpload = async () => {
    if (fileUpload.current.files.length > 0) {
      const data = new FormData()
      data.append('file', fileUpload.current.files[0])
      const res = await fetch(paths.api_questions_upload, {
        method: 'POST',
        body: data,
      })
      const json = await res.json()

      if (!res.ok) throw Error(json.message)

      toaster.push(
        <Message showIcon type="success">
          T???i l??n th??nh c??ng
        </Message>,
      )
    }
  }

  const onSubmit = async (formData: QuestionSearchType) => {
    setSearch({ ...search, ...formData, page_index: 0 })
  }

  const onChange = (name: string, value: any) => {
    setValue(name, value)
    filterData.current[name] = value
    setFilterBagde(
      Object.keys(filterData.current).filter(
        (m) => filterData.current[m].length > 0,
      ).length,
    )
    setTimeout(() => {
      handleSubmit(onSubmit)(formSearch.current)
    }, 0)
  }

  const onResetForm = () => {
    setValue('question_text', '')
    setValue('publisher', [])
    setValue('series', [])
    setValue('grade', [])
    setValue('skills', [])
    setValue('level', [])
    setValue('question_type', [])
    filterData.current = {}
    setFilterBagde(0)
    setTriggerReset(!triggerReset)
    setTimeout(() => {
      handleSubmit(onSubmit)(formSearch.current)
    }, 0)
  }

  return (
    <div style={{ margin: '1.4rem 0 0 0' }}>
      <form
        ref={formSearch}
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className="m-unittest-template-table-data__content">
          <div className="content__sup">
            <div className="__input-group" style={{ marginTop: '1rem' }}>
              <InputWithLabel
                className="__search-box"
                label="Y??u c???u ????? b??i ho???c c??u h???i"
                placeholder="T??m theo Y??u c???u ????? b??i ho???c c??u h???i"
                triggerReset={triggerReset}
                type="text"
                //onBlur={handleNameChange}
                icon={
                  <img src="/images/icons/ic-search-dark.png" alt="search" />
                }
                onChange={(val: string) => setValue('question_text', val)}
              />
              <Button
                className="__sub-btn"
                data-active={isOpenFilterCollapse}
                style={{ marginLeft: '0.8rem' }}
                onClick={() => setIsOpenFilterCollapse(!isOpenFilterCollapse)}
              >
                <div
                  className="__badge"
                  data-value={filterBagde}
                  data-hidden={filterBagde <= 0}
                >
                  <img src="/images/icons/ic-filter-dark.png" alt="filter" />
                </div>
                <span>L???c</span>
              </Button>
              <Button className="__sub-btn" onClick={onResetForm}>
                <img src="/images/icons/ic-reset-darker.png" alt="reset" />
                <span>Reset</span>
              </Button>
              <Button className="__main-btn" type="submit">
                <img src="/images/icons/ic-search-dark.png" alt="find" />
                <span>T??m ki???m</span>
              </Button>
            </div>
            <div
              className="__action-group"
              style={{ display: 'flex', marginTop: '1rem' }}
            >
              {isImportable && (
                <>
                  <Button
                    appearance={'primary'}
                    className="__action-btn gray"
                    onClick={() =>
                      fileImport.current.dispatchEvent(new MouseEvent('click'))
                    }
                  >
                    <img
                      src="/images/icons/ic-upload-purple.png"
                      alt="Import"
                    />
                    <span>Nh????p danh sa??ch c??u ho??i</span>
                    <input
                      type="file"
                      ref={fileImport}
                      style={{ display: 'none' }}
                      accept=".xlsx"
                      onChange={onChangeFile}
                    ></input>
                  </Button>
                  <Whisper
                    placement="top"
                    controlId="control-id-hover"
                    trigger="hover"
                    speaker={
                      <Tooltip>
                        Nh????n ?????? ta??i hi??nh a??nh, video, audio l??n h???? th????ng Test
                        bank
                      </Tooltip>
                    }
                  >
                    <Button
                      appearance={'primary'}
                      className="__action-btn gray"
                      onClick={() =>
                        fileUpload.current.dispatchEvent(
                          new MouseEvent('click'),
                        )
                      }
                    >
                      <img
                        src="/images/icons/ic-upload-purple.png"
                        alt="Import file"
                      />
                      <span>T???i l??n</span>
                      <input
                        type="file"
                        ref={fileUpload}
                        style={{ display: 'none' }}
                        accept=".zip"
                        onChange={onChangeFileUpload}
                      ></input>
                    </Button>
                  </Whisper>
                </>
              )}
              {isCreatable && (
                <Button
                  className="__action-btn"
                  onClick={() => {
                    router.push('/questions/[questionSlug]', `/questions/${-1}`)
                  }}
                >
                  <img src="/images/icons/ic-plus-white.png" alt="create" />
                  <span>T???o m???i</span>
                </Button>
              )}
            </div>
          </div>
          <Collapse isOpened={isOpenFilterCollapse}>
            <div className="content__sub">
              <MultiSelectPicker
                className="__filter-box"
                data={PUBLISHER_SELECTIONS}
                label="NXB"
                triggerReset={triggerReset}
                onChange={onChange.bind(this, 'publisher')}
                style={{ zIndex: 10 }}
              />
              <MultiSelectPicker
                label="Ch????ng tr??nh"
                data={SERIES_SELECTIONS}
                className={'__filter-box'}
                onChange={onChange.bind(this, 'series')}
                style={{ zIndex: 9 }}
                triggerReset={triggerReset}
              />
              <MultiSelectPicker
                label="Kh???i l???p"
                data={GRADE_SELECTIONS}
                className={'__filter-box'}
                onChange={onChange.bind(this, 'grade')}
                style={{ zIndex: 8 }}
                triggerReset={triggerReset}
              />
              <MultiSelectPicker
                label="K??? n??ng"
                data={SKILLS_SELECTIONS}
                className={'__filter-box'}
                onChange={onChange.bind(this, 'skills')}
                style={{ zIndex: 7 }}
                triggerReset={triggerReset}
              />
              <MultiSelectPicker
                label="????? kh??"
                data={LEVEL_SELECTIONS}
                className={'__filter-box'}
                onChange={onChange.bind(this, 'level')}
                style={{ zIndex: 6 }}
                triggerReset={triggerReset}
              />
              <MultiSelectPicker
                label="Loa??i c??u ho??i"
                data={TASK_SELECTIONS}
                className={'__filter-box'}
                onChange={onChange.bind(this, 'question_type')}
                style={{ zIndex: 5 }}
                triggerReset={triggerReset}
              />
            </div>
          </Collapse>
        </div>
      </form>

      <QuestionTable filterBagde={filterBagde} />
    </div>
  )
}

const schema = {
  Publisher: {
    prop: 'publisher',
    type: String,
  },
  'Exam Type': {
    prop: 'test_type',
    type: String,
  },
  Series: {
    prop: 'series',
    type: String,
  },
  Grade: {
    prop: 'grade',
    type: String,
  },
  Format: {
    prop: 'format',
    type: String,
  },
  Types: {
    prop: 'types',
    type: String,
  },
  Skills: {
    prop: 'skills',
    type: String,
  },
  'Question Type': {
    prop: 'question_type',
    type: String,
  },
  Level: {
    prop: 'level',
    type: String,
  },
  Group: {
    prop: 'group',
    type: String,
  },
  'Parent-Question Description': {
    prop: 'parent_question_description',
    type: String,
  },
  'Parent-Question Text': {
    prop: 'parent_question_text',
    type: String,
  },
  'Question Description': {
    prop: 'question_description',
    type: String,
  },
  'Question Text': {
    prop: 'question_text',
    type: String,
  },
  Image: {
    prop: 'image',
    type: String,
  },
  Video: {
    prop: 'video',
    type: String,
  },
  Audio: {
    prop: 'audio',
    type: String,
  },
  Answers: {
    prop: 'answers',
    type: (value: any) => {
      return value.toString()
    },
  },
  'Correct Answers': {
    prop: 'correct_answers',
    type: String,
  },
  Points: {
    prop: 'points',
    type: Number,
  },
  CEFR: {
    prop: 'cerf',
    type: String,
  },
  'Audio script': {
    prop: 'audio_script',
    type: String,
  },
}
