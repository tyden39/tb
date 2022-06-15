import { MatchingQuestion } from 'components/molecules/matchingQuestion'
import { TemplateLinkertScale } from 'components/molecules/templateLinkertScale'
import { TemplateTrueFalse } from 'components/molecules/templateTrueFalse'
import { UnitTestTemplateDD1 } from 'components/molecules/unitTestTemplateDD1'
import { UnitTestTemplateFB1 } from 'components/molecules/unitTestTemplateFB1'
import { UnitTestTemplateFB2 } from 'components/molecules/unitTestTemplateFB2'
import { UnitTestTemplateFB3 } from 'components/molecules/unitTestTemplateFB3'
import { UnitTestTemplateFB4 } from 'components/molecules/unitTestTemplateFB4'
import { UnitTestTemplateFB5 } from 'components/molecules/unitTestTemplateFB5'
import { UnitTestTemplateMR1 } from 'components/molecules/unitTestTemplateMR1'
import { UnitTestTemplateMR2 } from 'components/molecules/unitTestTemplateMR2'
import { UnitTestTemplateMR3 } from 'components/molecules/unitTestTemplateMR3'
import { UnitTestTemplateMultiChoices1 } from 'components/molecules/unitTestTemplateMultiChoices1'
import { UnitTestTemplateMultiChoices2 } from 'components/molecules/unitTestTemplateMultiChoices2'
import { UnitTestTemplateMultiChoices3 } from 'components/molecules/unitTestTemplateMultiChoices3'
import { UnitTestTemplateMultiChoices4 } from 'components/molecules/unitTestTemplateMultiChoices4'
import { UnitTestTemplateMultiChoices5 } from 'components/molecules/unitTestTemplateMultiChoices5'
import { UnitTestTemplateMultiChoices6 } from 'components/molecules/unitTestTemplateMultiChoices6'
import { UnitTestTemplateSA1 } from 'components/molecules/unitTestTemplateSA1'
import { UnitTestTemplateSL1 } from 'components/molecules/unitTestTemplateSL1'
import { SKILLS_SELECTIONS } from 'interfaces/struct'

import { DefaultPropsType } from '../../../interfaces/types'

interface Props extends DefaultPropsType {
  data: any
}

const skillThumbnails: any = {
  GR: '/images/collections/clt-grammar.png',
  LI: '/images/collections/clt-listening.png',
  PR: '/images/collections/clt-pronunciation.png',
  RE: '/images/collections/clt-reading.png',
  SP: '/images/collections/clt-speaking.png',
  US: '/images/collections/clt-use-of-english.png',
  VO: '/images/collections/clt-vocab.png',
  WR: '/images/collections/clt-writing.png',
}

export const QuestionPreviewSection = ({
  className = '',
  data,
  style,
}: Props) => {
  const sectionArr = Array.isArray(data?.sectionId)
    ? data.sectionId
    : [data?.sectionId]

  return (
    <div className={`o-question-preview-section ${className}`} style={style}>
      <div
        className="o-question-preview-section__header"
        title={
          data?.sectionId && data.sectionId.length > 0
            ? sectionArr
                .map(
                  (item: any) =>
                    SKILLS_SELECTIONS.find((skill) => skill.code === item)
                      ?.display || item,
                )
                .join(', ')
            : null
        }
      >
        {data?.sectionId ? (
          sectionArr
            .filter((item: any, i: number) => i <= 3)
            .map((item: any, i: number) =>
              i === 3 ? (
                <div key={i} className="__banner">
                  +2
                </div>
              ) : (
                <div key={i} className="__banner">
                  <img
                    src={
                      skillThumbnails[item] ||
                      '/images/collections/clt-unknown.png'
                    }
                    alt="banner"
                  />
                </div>
              ),
            )
        ) : (
          <div className="__banner">
            <img src="/images/collections/clt-unknown.png" alt="banner" />
          </div>
        )}
        <h5 className="__title">{data?.parts[0]?.name || 'Phần thi'}</h5>
      </div>
      <div className="o-question-preview-section__body">
        {data?.parts[0]?.questions.map((item: any) => (
          <div key={item.id} className="o-question-preview-section__item">
            <ActivityPicker data={item} type={item.question_type} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const ActivityPicker = ({ data, type }: any) => {
  switch (type) {
    // drag and drop
    case 'DD1':
      return <UnitTestTemplateDD1 data={data} />

    // fill in blanks
    case 'FB1':
      return <UnitTestTemplateFB1 data={data} />
    case 'FB2':
      return <UnitTestTemplateFB2 data={data} />
    case 'FB3':
      return <UnitTestTemplateFB3 data={data} />
    case 'FB4':
      return <UnitTestTemplateFB4 data={data} />
    case 'FB5':
      return <UnitTestTemplateFB5 data={data} />

    // likert scale
    case 'LS1':
      return <TemplateLinkertScale data={data} mode="paragraph" />
    case 'LS2':
      return <TemplateLinkertScale data={data} mode="audio" />

    // multiple choices
    case 'MC1':
      return <UnitTestTemplateMultiChoices1 data={data} />
    case 'MC2':
      return <UnitTestTemplateMultiChoices2 data={data} />
    case 'MC3':
      return <UnitTestTemplateMultiChoices3 data={data} />
    case 'MC4':
      return <UnitTestTemplateMultiChoices4 data={data} />
    case 'MC5':
      return <UnitTestTemplateMultiChoices5 data={data} />
    case 'MC6':
      return <UnitTestTemplateMultiChoices6 data={data} />

    // matching questions
    case 'MG1':
      return <MatchingQuestion data={data} />
    case 'MG2':
      return <MatchingQuestion data={data} />
    case 'MG3':
      return <MatchingQuestion data={data} />

    // multiple responses
    case 'MR1':
      return <UnitTestTemplateMR1 data={data} />
    case 'MR2':
      return <UnitTestTemplateMR2 data={data} />
    case 'MR3':
      return <UnitTestTemplateMR3 data={data} />

    // select from list
    case 'SL1':
      return <UnitTestTemplateSL1 data={data} />

    // short answer
    case 'SA1':
      return <UnitTestTemplateSA1 data={data} />

    // true false
    case 'TF1':
      return <TemplateTrueFalse data={data} mode="audio" />
    case 'TF2':
      return <TemplateTrueFalse data={data} mode="paragraph" />

    // not found
    default:
      return <></>
  }
}
