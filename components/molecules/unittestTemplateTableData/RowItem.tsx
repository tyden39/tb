import { useContext } from 'react'

import { Popover, Whisper } from 'rsuite'

import { Radio } from 'components/atoms/radio'
import { SingleTemplateContext } from 'interfaces/contexts'
import { GRADE_SELECTIONS, SKILLS_SELECTIONS } from 'interfaces/struct'

const skillThumbnails: any = {
  GR: '/images/collections/clt-grammar-green.png',
  LI: '/images/collections/clt-listening-green.png',
  PR: '/images/collections/clt-pronunciation-green.png',
  RE: '/images/collections/clt-reading-green.png',
  SP: '/images/collections/clt-speaking-green.png',
  US: '/images/collections/clt-use-of-english-green.png',
  VO: '/images/collections/clt-vocab-green.png',
  WR: '/images/collections/clt-writing-green.png',
}

const getSkills = (arr: any[]) => {
  const skillArr: any[] = []
  arr.forEach((parents) => {
    if (Array.isArray(parents) && parents.length > 0) {
      parents.forEach((children) => {
        if (!skillArr.includes(children)) skillArr.push(children)
      })
    }
  })
  return skillArr
}

export const RowItem = ({ index, activePage, data }: any) => {
  const contextData = useContext(SingleTemplateContext)

  const chosenTemplate = contextData?.chosenTemplate

  return (
    <tr onClick={() => chosenTemplate.setState({ id: data.id })}>
      <td style={{ height: '5.6rem' }}>
        <Radio name="template" checked={chosenTemplate.state?.id === data.id} />
      </td>
      <td style={{ height: '5.6rem' }}>{index + 1 + (activePage - 1) * 10}</td>
      <td title={data?.name} style={{ height: '5.6rem', textAlign: 'left' }}>
        <div className="__elipsis">{data?.name || '---'}</div>
      </td>
      <td
        title={
          GRADE_SELECTIONS.find((item) => item.code === data.templateLevelId)
            ?.display || data.templateLevelId
        }
        style={{ height: '5.6rem' }}
      >
        <div className="__elipsis">
          {GRADE_SELECTIONS.find((item) => item.code === data.templateLevelId)
            ?.display ||
            data.templateLevelId ||
            '---'}
        </div>
      </td>
      <td title={data?.time} style={{ height: '5.6rem' }}>
        <div className="__elipsis">{data?.time || '---'}</div>
      </td>
      <td title={data?.totalQuestions} style={{ height: '5.6rem' }}>
        <div className="__elipsis">{data?.totalQuestions || '---'}</div>
      </td>
      <td
        title={getSkills(data.sections)
          .map(
            (item) =>
              SKILLS_SELECTIONS.find((skill) => skill.code === item)?.display ||
              item,
          )
          .join(', ')}
        style={{ height: '5.6rem' }}
      >
        <Whisper
          placement="leftStart"
          trigger="click"
          speaker={
            <Popover>
              <div className="m-unittest-template-table-data__section-popover">
                {getSkills(data.sections).map((item: any, i: number) => (
                  <div key={i} className="section-item">
                    <img src={skillThumbnails[item]} alt={item} />
                    <span>
                      {SKILLS_SELECTIONS.find((skill) => skill.code === item)
                        ?.display || item}
                    </span>
                  </div>
                ))}
              </div>
            </Popover>
          }
        >
          <span onClick={(e) => e.stopPropagation()}>
            <span
              style={{
                color: '#6868AC',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {getSkills(data.sections).length || 0}
            </span>
            <sup style={{ color: 'red' }}>*</sup>
          </span>
        </Whisper>
      </td>
    </tr>
  )
}
