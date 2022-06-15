import { useContext } from 'react'

import { useRouter } from 'next/dist/client/router'
import { Button, toaster } from 'rsuite'

import { AlertNoti } from 'components/atoms/alertNoti'
import { WrapperContext } from 'interfaces/contexts'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  mode?: 'createTemplate' | 'updateTemplate' | 'createUnitTest'
}

export const FooterTemplate = ({
  className = '',
  mode = 'createTemplate',
  style,
}: PropsType) => {
  const router = useRouter()

  const { templateDetail } = useContext(WrapperContext)

  const warning = (mess: string) => {
    const key = toaster.push(<AlertNoti type="error" message={mess} />, {
      placement: 'topEnd',
    })
    setTimeout(() => toaster.remove(key), 5000)
  }

  const handleSubmit = async () => {
    const formData = templateDetail.state
    if (!formData?.name) {
      warning('Invalid value at name input!!!')
      return
    }

    if (!formData?.time) {
      warning('Invalid value at time input!!!')
      return
    }

    if (!formData?.totalQuestion) {
      warning('Invalid value at total question input!!!')
      return
    } else {
      if (formData?.sections) {
        let total = 0
        formData.sections.forEach((section: any) => {
          if (section?.parts && section.parts[0]) {
            const numberQuestion = section.parts[0]?.totalQuestion || 0
            total += numberQuestion
          }
        })
        if (total !== formData.totalQuestion) {
          warning(
            'Number of question in sections must be equal to total question!!!',
          )
          return
        }
      }
    }

    if (!formData?.templateLevelId) {
      warning('Invalid value at grade select!!!')
      return
    }

    if (!formData?.sections || formData.sections.length <= 0) {
      warning('Invalid value at section list!!!')
      return
    }

    let method = ''
    let url = ''
    switch (mode) {
      case 'updateTemplate':
        method = 'put'
        url = `/api/templates/${formData?.id}`

        break
      default:
        method = 'post'
        url = '/api/templates'
        break
    }
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.status === 200) {
        switch (mode) {
          case 'updateTemplate':
            window.location.reload()
            break
          default:
            router.push('/templates')
            break
        }
      }
    })
  }

  return (
    <div className={`m-footer-template ${className}`} style={style}>
      <Button className="submit-btn" onClick={() => router.push('/templates')}>
        Back
      </Button>
      <Button
        className="submit-btn"
        appearance="primary"
        color="blue"
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </div>
  )
}
