import { useState, useEffect } from 'react'

import { useRouter } from 'next/dist/client/router'
import Error from 'next/error'

import { callApi } from 'api/utils'
import { CreateNewTemplate } from 'components/pages/createNewTemplate'
import { SingleTemplateContext } from 'interfaces/contexts'

import { BreadcrumbItemType } from '../../../interfaces/types'

const defaultTemplateData: any = {
  id: null,
  name: '',
  templateLevelId: '',
  time: null,
  totalQuestion: null,
  point: null,
  status: false,
  sections: [],
}

export default function TemplateDetailPage() {
  const router = useRouter()

  const mode =
    router.query.templateSlug === 'create-new-template'
      ? 'create'
      : router.query?.mode === 'edit'
      ? 'update'
      : 'detail'

  console.log(mode)

  const [templateData, setTemplateData] = useState({ ...defaultTemplateData })
  const [isReady, setIsReady] = useState(
    !['update', 'detail'].includes(mode) ? true : null,
  )

  const breadcrumbData: BreadcrumbItemType[] = [
    { name: 'Tổng quan', url: '/' },
    {
      name: 'Ngân hàng cấu trúc',
      url: '/templates',
    },
    {
      name:
        router.query.templateSlug === 'create-new-template'
          ? 'Tạo cấu trúc mới'
          : templateData?.name || '',
      url: null,
    },
  ]

  useEffect(() => {
    if (mode === 'create') {
      setIsReady(true)
      return
    }
    if (!router.query?.templateSlug) return
    const fetchData = async () => {
      console.log('go here')
      const response: any = await callApi(
        `/api/templates/${router.query.templateSlug}${
          router.query?.mode ? `?mode=${router.query.mode}` : ''
        }`,
        'get',
        'Token',
      )
      if (response?.status !== 200) {
        setIsReady(response?.status)
        return
      } else {
        if (response?.data) {
          const apiData = response.data
          const originData = {
            id: apiData?.id || null,
            name: apiData?.name || '',
            point: apiData?.total_point || 0,
            sections: apiData?.sections
              ? apiData.sections.map((section: any) => ({
                  id: section?.id || null,
                  parts: section?.parts
                    ? section.parts.map((part: any) => ({
                        id: part?.id || null,
                        name: part?.name || '',
                        points: part?.points || 0,
                        questionTypes: part?.question_types || '',
                        sectionId: part?.template_section_id || null,
                        totalQuestion: part?.total_question || 0,
                      }))
                    : [],
                  sectionId: section?.section_id || [],
                }))
              : [],
            templateLevelId: apiData?.template_level_id || '',
            time: apiData?.time || 0,
            totalQuestion: apiData?.total_question || 0,
            status: apiData?.status || 0,
          }
          setTemplateData({ ...originData })
          setIsReady(true)
        }
      }
    }

    if (['detail', 'update'].includes(mode)) fetchData()
  }, [router.asPath, mode])

  if (isReady === null) return <></>
  else if (isReady !== true) return <Error statusCode={isReady || 500} />

  return (
    <SingleTemplateContext.Provider
      value={{
        breadcrumbData,
        mode,
        templateDetail: { state: templateData, setState: setTemplateData },
      }}
    >
      <CreateNewTemplate />
    </SingleTemplateContext.Provider>
  )
}
